"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const run = require("./task-done.js");

const readRepo = (name) =>
  fs.readFileSync(path.join(__dirname, "..", name), "utf8");

const NOTE = "TaskNotes/Tasks/fix the fence.md";
const COPY = "TaskNotes/Tasks/fix the fence copy.md";
const LOG = "TaskRPG/Engine/Events.md";
const HERO = "TaskRPG/Engine/Hero.md";

function noteText(taskId) {
  return `---\ntaskId: ${taskId}\nstatus: open\nskill: mind\nsize: small\ntags:\n - task\n---\n# Fix the fence\n`;
}

// Two task notes in the tasks folder; the active note is NOTE.
function harness(copyTaskId) {
  const data = new Map([
    ["TaskRPG/Scripts/engine.js", readRepo("Scripts/engine.js")],
    ["TaskRPG/Scripts/task-utils.js", readRepo("Scripts/task-utils.js")],
    ["TaskRPG/Engine/Settings.md", readRepo("Engine/Settings.md")],
    [
      ".obsidian/plugins/tasknotes/data.json",
      JSON.stringify({ tasksFolder: "TaskNotes/Tasks", taskTag: "task" }),
    ],
    ["TaskNotes/Tasks", ""],
    [NOTE, noteText("task-1")],
    [COPY, noteText(copyTaskId)],
  ]);
  const notices = [];
  global.Notice = class {
    constructor(message) {
      notices.push(message);
    }
  };
  const adapter = {
    read: async (p) => {
      if (!data.has(p)) throw new Error(`Missing ${p}`);
      return data.get(p);
    },
    exists: async (p) => data.has(p),
    write: async (p, text) => {
      data.set(p, text);
    },
    list: async () => ({ files: [NOTE, COPY], folders: [] }),
  };
  const app = {
    workspace: {
      getActiveFile: () => ({ path: NOTE, basename: "fix the fence" }),
    },
    vault: { adapter },
  };
  return { data, notices, press: () => run({ app }) };
}

describe("task-done.js duplicate taskId guard", () => {
  test("refuses to resolve a task whose taskId is shared and saves nothing", async () => {
    const h = harness("task-1");
    const noteBefore = h.data.get(NOTE);
    const copyBefore = h.data.get(COPY);

    await h.press();

    assert.deepEqual(h.notices, [
      "TaskRPG: Change taskID to prevent duplicate id, nothing was saved.",
    ]);
    assert.equal(h.data.has(LOG), false, "no event log was created");
    assert.equal(h.data.has(HERO), false, "no Hero cache was created");
    assert.equal(h.data.get(NOTE), noteBefore);
    assert.equal(h.data.get(COPY), copyBefore);
  });

  test("still resolves a task when the other note has a different taskId", async () => {
    const h = harness("task-2");

    await h.press();

    assert.equal(h.notices.length, 1);
    assert.match(h.notices[0], /Task complete/);
    assert.equal(h.data.has(LOG), true);
  });
});
