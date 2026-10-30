"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("./engine.js");
const undoLast = require("./undo.js");
const { hasUnresolvedTaskDone } = require("./task-utils.js");

const readRepo = (name) =>
  fs.readFileSync(path.join(__dirname, "..", name), "utf8");

// Regression tests for TaskNotes-wrapped task resolution and undo: the engine's
// undo events, the QuickAdd undo script, and the duplicate-resolution guard.

// Copy of the frozen starting settings at the top of engine.test.js (that file
// does not export them). Keep the two in step if a default changes.
const SETTINGS = {
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

// ---------------------------------------------------------------------------
// Event builders
// ---------------------------------------------------------------------------

// Full events, as they sit in the log (with ids).
function taskDoneEvent({
  id = "task-event-1",
  taskId = "task-1",
  timestamp = at("09:00"),
  roll = [3, 4],
  lootRoll = 1,
} = {}) {
  return {
    id,
    type: "task_done",
    timestamp,
    taskId,
    skill: "mind",
    size: "small",
    planned: true,
    important: false,
    urgent: false,
    roll,
    lootRoll,
  };
}

const habitEvent = (id, timestamp) => ({
  id,
  type: "habit_done",
  timestamp,
  habitId: "habit-1",
  skill: "vitality",
  onTime: true,
});

// Actions, as passed to engine.recordAction (the engine assigns id/targetEventId).
const taskAction = ({ taskId = "task-1", timestamp = at("09:00") } = {}) => {
  const { id, ...action } = taskDoneEvent({ taskId, timestamp });
  return action;
};

const habitAction = (timestamp = at("09:02")) => {
  const { id, ...action } = habitEvent(null, timestamp);
  return action;
};

const undoAction = (timestamp) => ({ type: "undo", timestamp });

// Hand-built log lines, positional, for the guard tests.
const rawTask = (id, taskId, timestamp) =>
  taskDoneEvent({ id, taskId, timestamp });
const rawUndo = (id, targetEventId, timestamp) => ({
  id,
  type: "undo",
  timestamp,
  targetEventId,
});
const rawHabit = (id, timestamp) => habitEvent(id, timestamp);

// A log kept the way the vault keeps it: JSON lines, parsed back before use.
function logOf() {
  let text = "";
  return {
    events: () => engine.parseEvents(text),
    press(action) {
      const out = engine.recordAction(this.events(), action, SETTINGS);
      text += out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
      return out;
    },
  };
}

// ---------------------------------------------------------------------------
// QuickAdd harness
// ---------------------------------------------------------------------------

const TASKNOTES_DATA = ".obsidian/plugins/tasknotes/data.json";
const TASKS = {
  matching: "TaskNotes/Tasks/fix the fence.md",
  other: "TaskNotes/Tasks/water the plants.md",
};
const HABITS = {
  matching: "TaskRPG/Engine/Habits/Morning routine.md",
  other: "TaskRPG/Engine/Habits/Evening walk.md",
};

function habitNote({ habitId, history = [] }) {
  return `---\ntype: core-habit\nhabitId: ${habitId}\nskill: vitality\nblock: morning\n---\n\n# Habit\n\n## History\n\n${history.join("\n")}\n`;
}

function taskNote({
  taskId,
  status = "done",
  completedDate = "2026-10-15T01:00:00+11:00",
}) {
  return `---\ntype: task\ntaskId: ${taskId}\nstatus: ${status}\ncompletedDate: "${completedDate}"\n---\n# Task\n\nBody stays.`;
}

// Runs the real QuickAdd script against an in-memory vault. The seeded log is
// fixed-shape, but its timestamp must be now so the action lands on today's game day.
function undoHarness({
  action,
  notes = { [TASKS.matching]: "task-1", [TASKS.other]: "task-2" },
  habits = {},
  tasknotesData = { tasksFolder: "TaskNotes/Tasks" },
  taskFolderExists = true,
} = {}) {
  const event =
    action ??
    taskDoneEvent({
      id: "task-event-1",
      taskId: "task-1",
      timestamp: engine.localStamp(),
    });
  const data = new Map([
    ["TaskRPG/Scripts/engine.js", readRepo("Scripts/engine.js")],
    ["TaskRPG/Scripts/task-utils.js", readRepo("Scripts/task-utils.js")],
    ["TaskRPG/Engine/Settings.md", readRepo("Engine/Settings.md")],
    ["TaskRPG/Engine/Events.md", `${JSON.stringify(event)}\n`],
    // Mirrors the vault: TaskNotes stores tasks in its configured tasksFolder,
    // so the lookup has to leave the TaskNotes root to find one.
    [TASKNOTES_DATA, JSON.stringify(tasknotesData)],
    ["TaskRPG/Engine/Habits", ""],
    ["TaskNotes/Start Here.md", "---\ntype: index\n---\n# TaskNotes"],
    ...Object.entries(notes).map(([file, taskId]) => [
      file,
      taskNote({ taskId }),
    ]),
    ...Object.entries(habits).map(([file, habit]) => [file, habitNote(habit)]),
  ]);
  if (taskFolderExists && tasknotesData.tasksFolder)
    data.set(tasknotesData.tasksFolder, "");
  const notices = [];
  global.Notice = class {
    constructor(message) {
      notices.push(message);
    }
  };
  const adapter = {
    read: async (p) => {
      if (!data.has(p)) throw Error(`Missing ${p}`);
      return data.get(p);
    },
    exists: async (p) => data.has(p),
    write: async (p, text) => {
      data.set(p, text);
    },
    list: async (dir) => {
      if (dir === "TaskNotes/Tasks")
        return { files: Object.keys(notes), folders: [] };
      if (dir === "TaskRPG/Engine/Habits")
        return { files: Object.keys(habits), folders: [] };
      if (dir === "TaskNotes")
        return {
          files: ["TaskNotes/Start Here.md"],
          folders: ["TaskNotes/Tasks"],
        };
      return { files: [], folders: [] };
    },
  };
  return {
    data,
    notices,
    press: () => undoLast({ app: { vault: { adapter } } }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("undo.test.js", () => {

  describe("QuickAdd undo script", () => {
    test('undoing a task_done event writes status: open and completedDate: "" to the matching note', async () => {
      const h = undoHarness();
      const otherBefore = h.data.get(TASKS.other);

      await h.press();

      const note = h.data.get(TASKS.matching);
      assert.match(note, /^status: open$/m);
      assert.match(note, /^completedDate: ""$/m);
      assert.match(note, /^taskId: task-1$/m);
      assert.equal(note.endsWith("# Task\n\nBody stays."), true);
      assert.equal(h.data.get(TASKS.other), otherBefore);

      const events = engine.parseEvents(h.data.get("TaskRPG/Engine/Events.md"));
      assert.equal(events.at(-1).type, "undo");
      assert.equal(events.at(-1).targetEventId, "task-event-1");
      assert.match(h.notices[0], /TaskNotes status restored to open/);
    });

    test("undoing a task_done event rewrites derived Hero.md from the corrected state", async () => {
      const h = undoHarness();

      await h.press();

      const hero = h.data.get("TaskRPG/Engine/Hero.md");
      assert.match(
        hero,
        /^---\ntype: hero-state\nhp: 10\nmaxHP: 10\nmp: 10\nmaxMP: 10\n/m,
      );
      assert.match(hero, /xp_mind: 0$/m);
      assert.match(hero, /VIEW\[\{mp\}\]\[text\]/);
    });

    test("undoing a habit removes its history line and leaves task notes untouched", async () => {
      const stamp = engine.localStamp();
      const line = `- ${stamp} | on time | Morning routine complete! +1 HP, +1 XP, -2 MP (MP 8/10)`;
      const older =
        "- 2026-10-20T09:00:00+11:00 | late | Morning routine complete! +1 HP, +1 XP, -2 MP (MP 6/10)";
      const h = undoHarness({
        action: {
          id: "habit-event-1",
          type: "habit_done",
          timestamp: stamp,
          habitId: "morning-routine",
          skill: "vitality",
          onTime: true,
        },
        habits: {
          [HABITS.matching]: {
            habitId: "morning-routine",
            history: [older, line],
          },
          [HABITS.other]: { habitId: "evening-walk", history: [line] },
        },
      });
      const before = [h.data.get(TASKS.matching), h.data.get(TASKS.other)];

      await h.press();

      const note = h.data.get(HABITS.matching);
      assert.doesNotMatch(note, new RegExp(stamp.replace(/[+]/g, "\\+")));
      assert.match(note, /2026-10-20T09:00:00\+11:00 \| late/);
      assert.equal(
        h.data.get(HABITS.other),
        habitNote({
          habitId: "evening-walk",
          history: [line],
        }),
      );
      assert.deepEqual(
        [h.data.get(TASKS.matching), h.data.get(TASKS.other)],
        before,
      );
      assert.doesNotMatch(h.notices[0], /TaskNotes/);
      assert.match(h.notices[0], /Habit history line removed/);
    });

    test("undoing a habit with no matching habit note still logs the correction and says so", async () => {
      const h = undoHarness({
        action: {
          id: "habit-event-2",
          type: "habit_done",
          timestamp: engine.localStamp(),
          habitId: "missing-habit",
          skill: "vitality",
          onTime: false,
        },
      });

      await h.press();

      const events = engine.parseEvents(h.data.get("TaskRPG/Engine/Events.md"));
      assert.equal(events.at(-1).type, "undo");
      assert.match(h.notices[0], /no matching habit note/);
    });

    test("an undo with no matching note still logs the correction and says so", async () => {
      const h = undoHarness({ notes: {} });

      await h.press();

      const events = engine.parseEvents(h.data.get("TaskRPG/Engine/Events.md"));
      assert.equal(events.length, 3);
      assert.equal(events.at(-1).type, "undo");
      assert.equal(
        h.notices[0],
        "Undo saved, but the task note was not found. Fix the note by hand.",
      );
    });

    test("undo with a missing TaskNotes tasks folder still logs the correction and names the folder", async () => {
      const h = undoHarness({
        taskFolderExists: false,
        notes: {},
      });

      await h.press();

      const events = engine.parseEvents(h.data.get("TaskRPG/Engine/Events.md"));
      assert.equal(events.length, 3);
      assert.equal(events.at(-1).type, "undo");
      assert.equal(
        h.notices[0],
        "Undo saved, but the TaskNotes tasks folder was not found. Check TaskNotes' tasks folder.",
      );
    });

    test("undo with duplicate taskId notes saves nothing and reports the duplicate", async () => {
      const dupA = "TaskNotes/Tasks/fix the fence.md";
      const dupB = "TaskNotes/Tasks/fix the fence copy.md";
      const h = undoHarness({
        notes: { [dupA]: "task-1", [dupB]: "task-1" },
      });
      const beforeA = h.data.get(dupA);
      const beforeB = h.data.get(dupB);
      const logBefore = h.data.get("TaskRPG/Engine/Events.md");

      await h.press();

      assert.equal(h.data.get("TaskRPG/Engine/Events.md"), logBefore);
      assert.equal(h.data.has("TaskRPG/Engine/Hero.md"), false);
      assert.equal(h.data.get(dupA), beforeA);
      assert.equal(h.data.get(dupB), beforeB);
      assert.equal(h.notices.length, 1);
      assert.equal(
        h.notices[0],
        "TaskRPG: Duplicate taskId found in task notes, so Undo was not applied. Change taskID to prevent duplicate id, nothing was saved.",
      );
    });
  });

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
        () => engine.recordAction(before, undoAction(at("09:00")), SETTINGS),
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
        taskDoneEvent({ id: "t1", taskId: "task-1", timestamp: at("09:00") }),
        {
          id: "u1",
          type: "undo",
          timestamp: at("09:05"),
          targetEventId: "missing",
        },
      ];

      assert.equal(hasUnresolvedTaskDone(events, "task-1"), true);
      assert.equal(hasUnresolvedTaskDone([events[1]], "task-1"), false);
      assert.throws(
        () => engine.recalculate(events, SETTINGS),
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
        () => engine.recalculate(events, SETTINGS),
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
      assert.doesNotThrow(() => engine.recalculate(events, SETTINGS));
    });

    test("an empty or undefined taskId never matches a real task's events", () => {
      const events = [rawTask("t1", "task-1", at("09:00"))];

      assert.equal(hasUnresolvedTaskDone(events, ""), false);
      assert.equal(hasUnresolvedTaskDone(events, undefined), false);
      assert.equal(hasUnresolvedTaskDone(events, null), false);
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

  });
});
