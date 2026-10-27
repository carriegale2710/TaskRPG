"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("./engine.js");
const undoLast = require("./undo.js");

const readRepo = (name) =>
  fs.readFileSync(path.join(__dirname, "..", name), "utf8");

// Regression tests for TaskNotes-wrapped task resolution and undo.

const SETTINGS = {
  dayRolloverHour: 4,
  maxHP: 10,
  maxMP: 10,
  minTaskMP: 1,
  unplannedMP: 1,
  woundedMP: 1,
  tiredPenalty: 1,
  habitWindowDays: 30,
  habitXP: 1,
  habitHP: 1,
  restDaysPerMonth: 4,
  missedDeadlineHP: 1,
  maxHPLossPerDay: 2,
  threatPerArc: 1,
  maxThreat: 4,
  successAt: 9,
  partialAt: 6,
  overdraftXPFactor: 0.5,
  skills: ["mind"],
  xpBonus: { important: 0.5, urgent: 0.5, focus: 0.25 },
  taskSizes: {
    small: { mp: 1, xp: 1 },
    medium: { mp: 3, xp: 3 },
    large: { mp: 5, xp: 5 },
  },
  mpDiscountLevels: [5, 10],
  diceBonusLevels: [2, 4, 6, 8, 10],
  lootDropRolls: [5, 6],
  xpThresholds: [0, 10, 25, 45, 70, 100, 140, 190, 250, 320],
  hpPenalties: [
    { minHP: 7, penalty: 0 },
    { minHP: 4, penalty: 1 },
    { minHP: 1, penalty: 2 },
    { minHP: 0, penalty: 3 },
  ],
  habitTiers: [
    { minShare: 0, cost: 2 },
    { minShare: 1 / 3, cost: 1 },
    { minShare: 2 / 3, cost: 0 },
  ],
};

function taskDoneEvent({ id, taskId, timestamp, roll = [3, 4], lootRoll = 1 }) {
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

function undoEvent({ id, targetEventId, timestamp }) {
  return { id, type: "undo", timestamp, targetEventId };
}

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

describe("undo.test.js", () => {
  test("resolution after undo is marked repeat by the engine", () => {
    const first = taskDoneEvent({
      id: "task-event-1",
      taskId: "task-1",
      timestamp: "2026-10-15T09:00:00+11:00",
      roll: [6, 6],
      lootRoll: 1,
    });
    const undo = undoEvent({
      id: "undo-event-1",
      targetEventId: "task-event-1",
      timestamp: "2026-10-15T09:05:00+11:00",
    });
    const second = taskDoneEvent({
      id: "task-event-2",
      taskId: "task-1",
      timestamp: "2026-10-15T09:10:00+11:00",
      roll: [6, 6],
      lootRoll: 1,
    });

    const out = engine.recordAction(
      [first, undo],
      second,
      SETTINGS,
      "2026-10-15T09:10:00+11:00",
    );

    assert.equal(out.result.repeat, true);
  });

  test("undo preserves the original task_done event and appends a correction", () => {
    const first = taskDoneEvent({
      id: "task-event-1",
      taskId: "task-1",
      timestamp: "2026-10-15T09:00:00+11:00",
    });
    const undo = undoEvent({
      id: "undo-event-1",
      targetEventId: "task-event-1",
      timestamp: "2026-10-15T09:05:00+11:00",
    });

    const out = engine.recordAction(
      [first],
      undo,
      SETTINGS,
      "2026-10-15T09:05:00+11:00",
    );

    assert.equal(out.events.length, 3); // settings_changed, task_done, undo
    assert.equal(out.events.at(-1).type, "undo");
    assert.equal(out.events.at(-1).targetEventId, "task-event-1");
    assert.equal(
      out.events.some((event) => event.id === "task-event-1"),
      true,
    );
  });

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
