"use strict";
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const run = require("./task-done.js");
const engine = require("./engine.js");
const utils = require("./task-utils.js");

const readRepo = (name) =>
  fs.readFileSync(path.join(__dirname, "..", name), "utf8");

const NOTE = "TaskNotes/Tasks/fix the fence.md";
const LOG = "TaskRPG/Engine/Events.md";

// TaskNotes marks a task with the configured tag and writes no `type` field.
function noteText(overrides = {}) {
  const fields = {
    taskId: "task-1",
    status: "done",
    skill: "mind",
    size: "small",
    scheduled: utils.today(),
    tags: ["task"],
    ...overrides,
  };
  const lines = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${item}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  return `---\n${lines.join("\n")}\n---\n# Fix the fence\n`;
}

const TASKNOTES_CONFIG = JSON.stringify({
  tasksFolder: "TaskNotes/Tasks",
  taskTag: "task",
});

// The vault keeps tasks in TaskNotes/Tasks, so an active note is two levels
// below the vault root, not in TaskNotes/ itself.
function harness(overrides) {
  const data = new Map([
    ["TaskRPG/Scripts/engine.js", readRepo("Scripts/engine.js")],
    ["TaskRPG/Scripts/task-utils.js", readRepo("Scripts/task-utils.js")],
    ["TaskRPG/Engine/Settings.md", readRepo("Engine/Settings.md")],
    [".obsidian/plugins/tasknotes/data.json", TASKNOTES_CONFIG],
    ["TaskNotes/Tasks", ""],
    [NOTE, noteText(overrides)],
  ]);
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
    list: async () => ({ files: [NOTE], folders: [] }),
  };
  const app = {
    workspace: {
      getActiveFile: () => ({ path: NOTE, basename: "fix the fence" }),
    },
    vault: { adapter },
  };
  return { data, notices, press: () => run({ app }) };
}

describe("task-done.test.js", () => {
  test("Task done resolves a task note stored in the configured TaskNotes folder", async () => {
    const h = harness();

    await h.press();

    const events = engine.parseEvents(h.data.get(LOG));
    assert.deepEqual(
      events.map((e) => e.type),
      ["settings_changed", "task_done"],
    );
    const done = events[1];
    assert.equal(done.taskId, "task-1");
    assert.equal(done.skill, "mind");
    assert.equal(done.size, "small");
    assert.equal(done.planned, true);

    const fields = utils.parseFrontmatter(h.data.get(NOTE));
    assert.equal(fields.status, "done");
    assert.equal(fields.completedDate, done.timestamp);
    assert.match(h.notices[0], /Task complete/);
  });

  // Task done owns the completion status: TaskNotes detects the written value,
  // so an unfinished note must still end up `done`, not keep its old status.
  test("Task done writes status done over the note's current status", async () => {
    const h = harness({ status: "open" });

    await h.press();

    const done = engine.parseEvents(h.data.get(LOG))[1];
    const fields = utils.parseFrontmatter(h.data.get(NOTE));
    assert.equal(fields.status, "done");
    assert.equal(fields.completedDate, done.timestamp);
  });

  test("Task done adds a task_done event to the log", async () => {
    const h = harness();

    await h.press();

    assert.equal(h.data.has(LOG), true);
  });

  // Hero.md is a derived display cache: after resolving a task it must show the
  // state recalculated from the log, not the state before this turn.
  test("Task done rewrites derived Hero.md from the new state", async () => {
    const h = harness();

    await h.press();

    const hero = h.data.get("TaskRPG/Engine/Hero.md");
    assert.match(hero, /^---\ntype: hero-state\nhp: 10\nmaxHP: 10\nmp: 9\nmaxMP: 10\n/m);
    assert.match(hero, /xp_mind: 1$/m);
    assert.match(hero, /VIEW\[\{hp\}\]\[text\]/);
  });

  // TaskNotes identifies a task by tag, not by a `type` field.

  test("Task done refuses a note with no task tag", async () => {
    const h = harness({ tags: ["important"] });

    await h.press();

    assert.equal(h.data.has(LOG), false);
  });

  // Required task properties: TaskRPG cannot resolve without a taskId, a skill
  // listed in Settings, and a size listed in Settings. Empty and YAML null are
  // the same failure as a missing field.
  for (const [label, overrides] of [
    ["skill is missing", { skill: undefined }],
    ["skill is empty", { skill: "" }],
    ["skill is null", { skill: null }],
    ["size is missing", { size: undefined }],
    ["size is empty", { size: "" }],
    ["size is null", { size: null }],
    ["taskId is missing", { taskId: undefined }],
    ["taskId is empty", { taskId: "" }],
    ["taskId is null", { taskId: null }],
  ]) {
    test(`Task done does not run when ${label}`, async () => {
      const h = harness(overrides);
      const before = h.data.get(NOTE);

      await h.press();

      assert.equal(h.data.has(LOG), false);
      assert.equal(h.data.get(NOTE), before);
      assert.match(h.notices[0], /^TaskRPG: /);
      assert.match(h.notices[0], /Nothing was logged/);
    });
  }
});
