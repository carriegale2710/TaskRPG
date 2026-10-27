"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const engine = require("./engine.js");
const { hasUnresolvedTaskDone } = require("./task-utils.js");

// Copy of the frozen starting settings at the top of engine.test.js (that file
// does not export them). Keep the two in step if a default changes.
const settings = {
  skills: ["focus", "vitality", "craft", "mind", "presence"],
  dayRolloverHour: 4,
  maxHP: 10,
  maxMP: 10,
  taskSizes: {
    small: { mp: 1, xp: 1 },
    medium: { mp: 3, xp: 3 },
    large: { mp: 5, xp: 5 },
  },
  minTaskMP: 1,
  unplannedMP: 1,
  woundedMP: 1,
  mpDiscountLevels: [5, 10],
  overdraftXPFactor: 0.5,
  tiredPenalty: 1,
  xpBonus: { important: 0.5, urgent: 0.5, focus: 0.25 },
  xpThresholds: [0, 10, 25, 45, 70, 100, 140, 190, 250, 320],
  diceBonusLevels: [2, 4, 6, 8, 10],
  successAt: 9,
  partialAt: 6,
  lootDropRolls: [5, 6],
  hpPenalties: [
    { minHP: 7, penalty: 0 },
    { minHP: 4, penalty: 1 },
    { minHP: 1, penalty: 2 },
    { minHP: 0, penalty: 3 },
  ],
  habitWindowDays: 30,
  habitXP: 1,
  habitHP: 1,
  habitTiers: [
    { minShare: 0, cost: 2 },
    { minShare: 0.3333333333333333, cost: 1 },
    { minShare: 0.6666666666666666, cost: 0 },
  ],
  missedDeadlineHP: 1,
  maxHPLossPerDay: 2,
  restDaysPerMonth: 4,
  threatPerArc: 1,
  maxThreat: 4,
};

const DAY = "2026-10-15";
const at = (time, day = DAY) => `${day}T${time}:00+11:00`;

const taskAction = ({ taskId = "task-1", timestamp = at("09:00") } = {}) => ({
  type: "task_done",
  timestamp,
  taskId,
  skill: "mind",
  size: "small",
  planned: true,
  important: false,
  urgent: false,
  roll: [3, 4],
  lootRoll: 1,
});

const habitAction = (timestamp = at("09:02")) => ({
  type: "habit_done",
  timestamp,
  habitId: "habit-1",
  skill: "vitality",
  onTime: true,
});

const undoAction = (timestamp) => ({ type: "undo", timestamp });

// A log kept the way the vault keeps it: JSON lines, parsed back before use.
function logOf() {
  let text = "";
  return {
    events: () => engine.parseEvents(text),
    press(action) {
      const out = engine.recordAction(this.events(), action, settings);
      text += out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
      return out;
    },
  };
}

const rawTask = (id, taskId, timestamp) => ({
  ...taskAction({ taskId, timestamp }),
  id,
});
const rawUndo = (id, targetEventId, timestamp) => ({
  id,
  type: "undo",
  timestamp,
  targetEventId,
});
const rawHabit = (id, timestamp) => ({ ...habitAction(timestamp), id });

describe("task-undo-resolution.test.js", () => {
  describe("engine round trip", () => {
    test("recordAction -> JSON lines -> parseEvents -> guard blocks a second resolution", () => {
      const log = logOf();
      const out = log.press(taskAction());
      const events = log.events();

      assert.deepEqual(
        events.map((event) => event.type),
        ["settings_changed", "task_done"],
      );
      assert.deepEqual(
        events.map((event) => event.id),
        out.added.map((event) => event.id),
      );
      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
    });

    test("an undo recorded by the engine releases the guard through targetEventId", () => {
      const log = logOf();
      const done = log.press(taskAction()).added.at(-1);
      const undo = log.press(undoAction(at("09:05"))).added.at(-1);
      const events = log.events();

      assert.equal(events.at(-1).type, "undo");
      assert.equal(events.at(-1).id, undo.id);
      assert.equal(events.at(-1).targetEventId, done.id);
      assert.equal(events.at(-1).taskId, undefined);
      assert.equal(hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("done -> undo -> done -> undo ends unblocked", () => {
      const log = logOf();
      const seen = [];
      const check = () =>
        seen.push(hasUnresolvedTaskDone(log.events(), "task-1"));

      log.press(taskAction({ timestamp: at("09:00") }));
      check();
      log.press(undoAction(at("09:05")));
      check();
      const again = log.press(taskAction({ timestamp: at("09:10") }));
      check();
      log.press(undoAction(at("09:15")));
      check();

      assert.deepEqual(seen, [true, false, true, false]);
      assert.equal(again.result.repeat, true);
      assert.deepEqual(
        log.events().map((event) => event.type),
        ["settings_changed", "task_done", "undo", "task_done", "undo"],
      );
    });

    test("interleaved tasks: undo releases only the newest task", () => {
      const log = logOf();
      log.press(taskAction({ taskId: "task-1", timestamp: at("09:00") }));
      log.press(taskAction({ taskId: "task-2", timestamp: at("09:01") }));
      log.press(undoAction(at("09:05")));

      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), true);
      assert.equal(hasUnresolvedTaskDone(log.events(), "task-2"), false);

      log.press(undoAction(at("09:06")));

      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), false);
    });

    test("habit_done in the log does not affect the guard; undo of a habit keeps the task blocked", () => {
      const log = logOf();
      log.press(taskAction());
      const habit = log.press(habitAction()).added.at(-1);

      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), true);

      const undo = log.press(undoAction(at("09:05"))).added.at(-1);

      assert.equal(undo.targetEventId, habit.id);
      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), true);

      log.press(undoAction(at("09:06")));

      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), false);
    });
  });

  describe("undo for a previous game day", () => {
    test("recordAction throws and appends nothing when only yesterday has an action", () => {
      const log = logOf();
      log.press(taskAction({ timestamp: at("09:00", "2026-10-14") }));
      const before = log.events();
      const snapshot = JSON.stringify(before);

      assert.throws(
        () => engine.recordAction(before, undoAction(at("09:00")), settings),
        /Nothing to undo for this game day/,
      );
      assert.equal(JSON.stringify(before), snapshot);
      assert.equal(hasUnresolvedTaskDone(before, "task-1"), true);
    });

    test("before the 04:00 rollover the previous calendar day is still the current game day", () => {
      const log = logOf();
      log.press(taskAction({ timestamp: at("23:00", "2026-10-14") }));
      log.press(undoAction(at("01:00")));

      assert.equal(hasUnresolvedTaskDone(log.events(), "task-1"), false);
    });
  });

  describe("guard on hand-built log shapes", () => {
    test("an undo with a dangling targetEventId changes nothing, and the engine rejects that log", () => {
      const events = [
        rawTask("t1", "task-1", at("09:00")),
        rawUndo("u1", "missing", at("09:05")),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
      assert.equal(hasUnresolvedTaskDone([events[1]], "task-1"), false);
      assert.throws(
        () => engine.recalculate(events, settings),
        /undo must reverse the newest/,
      );
    });

    test("an undo listed before its target does not release the guard, and the engine rejects that log", () => {
      const events = [
        rawUndo("u1", "t1", at("09:00")),
        rawTask("t1", "task-1", at("09:05")),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
      assert.throws(
        () => engine.recalculate(events, settings),
        /undo must reverse the newest/,
      );
    });

    test("habit_done events are never relevant to a task", () => {
      const events = [
        rawTask("t1", "task-1", at("09:00")),
        rawHabit("h1", at("09:01")),
        rawUndo("u1", "t1", at("09:05")),
        rawHabit("h2", at("09:06")),
      ];

      assert.equal(hasUnresolvedTaskDone(events.slice(0, 2), "task-1"), true);
      assert.equal(hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("an undo that targets a habit does not release a task", () => {
      const events = [
        rawTask("t1", "task-1", at("09:00")),
        rawHabit("h1", at("09:01")),
        rawUndo("u1", "h1", at("09:05")),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
      assert.doesNotThrow(() => engine.recalculate(events, settings));
    });

    test("an empty or undefined taskId never matches a real task's events", () => {
      const events = [rawTask("t1", "task-1", at("09:00"))];

      assert.equal(hasUnresolvedTaskDone(events, ""), false);
      assert.equal(hasUnresolvedTaskDone(events, undefined), false);
      assert.equal(hasUnresolvedTaskDone(events, null), false);
    });

    test("numeric 1 and string \"1\" are different task ids", () => {
      const stringId = [rawTask("t1", "1", at("09:00"))];
      const numberId = [rawTask("t1", 1, at("09:00"))];

      assert.equal(hasUnresolvedTaskDone(stringId, "1"), true);
      assert.equal(hasUnresolvedTaskDone(stringId, 1), false);
      assert.equal(hasUnresolvedTaskDone(numberId, 1), true);
      assert.equal(hasUnresolvedTaskDone(numberId, "1"), false);
    });
  });

  describe("duplicate-resolution guard", () => {
    const taskDoneEvent = ({
      id = "task-event-1",
      taskId = "task-1",
      timestamp = "2026-10-15T09:00:00+11:00",
    } = {}) => ({
      id,
      type: "task_done",
      timestamp,
      taskId,
      skill: "mind",
      size: "small",
      planned: true,
      important: false,
      urgent: false,
      roll: [3, 4],
      lootRoll: 1,
    });

    const undoEvent = ({
      id = "undo-event-1",
      targetEventId = "task-event-1",
      timestamp = "2026-10-15T09:05:00+11:00",
    } = {}) => ({
      id,
      type: "undo",
      timestamp,
      targetEventId,
    });

    test("allows a TaskNotes task marked done when it has no RPG resolution", () => {
      assert.equal(hasUnresolvedTaskDone([], "task-1"), false);
    });

    test("blocks a second resolution while the latest relevant event is an unresolved task_done", () => {
      const events = [taskDoneEvent()];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
    });

    test("allows another resolution after an undo targets the task's task_done event", () => {
      const events = [
        taskDoneEvent(),
        undoEvent({ targetEventId: "task-event-1" }),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("does not let an undo for another task release this task's guard", () => {
      const events = [
        taskDoneEvent({ id: "task-event-1", taskId: "task-1" }),
        taskDoneEvent({
          id: "task-event-2",
          taskId: "task-2",
          timestamp: "2026-10-15T09:01:00+11:00",
        }),
        undoEvent({
          id: "undo-event-2",
          targetEventId: "task-event-2",
          timestamp: "2026-10-15T09:06:00+11:00",
        }),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
    });

    test("blocks another resolution after an undo and a fresh task_done", () => {
      const events = [
        taskDoneEvent({ id: "task-event-1" }),
        undoEvent({
          id: "undo-event-1",
          targetEventId: "task-event-1",
        }),
        taskDoneEvent({
          id: "task-event-2",
          timestamp: "2026-10-15T09:10:00+11:00",
        }),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
    });

    test("uses the latest relevant event, so an older unresolved task_done does not block after a later undo", () => {
      const events = [
        taskDoneEvent({ id: "task-event-1" }),
        taskDoneEvent({
          id: "task-event-2",
          timestamp: "2026-10-15T09:01:00+11:00",
        }),
        undoEvent({
          id: "undo-event-2",
          targetEventId: "task-event-2",
          timestamp: "2026-10-15T09:06:00+11:00",
        }),
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("does not confuse a task_done for another task with this task's guard", () => {
      const events = [taskDoneEvent({ id: "task-event-1", taskId: "task-2" })];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), false);
    });
  });
});
