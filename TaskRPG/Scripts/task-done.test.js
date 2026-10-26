"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const run = require("./task-done.js");
const runUndo = require("./undo.js");
const engine = require("./engine.js");
const utils = require("./task-utils.js");

const readRepo = (name) =>
  fs.readFileSync(path.join(__dirname, "..", name), "utf8");

const NOTE = "TaskNotes/Tasks/fix the fence.md";
const LOG = "TaskRPG/Engine/Events.md";
const HERO = "TaskRPG/Engine/Hero.md";

const TASKNOTES_CONFIG = JSON.stringify({
  tasksFolder: "TaskNotes/Tasks",
  taskTag: "task",
});

// TaskNotes identifies tasks by the configured tag, not by a `type` field.
function noteText(overrides = {}) {
  const fields = {
    taskId: "task-1",
    status: "open",
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
      for (const item of value) lines.push(` - ${item}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return `---\n${lines.join("\n")}\n---\n# Fix the fence\n`;
}

// opts:
// - active: active-note path, or null for no active note
// - extraFiles: additional vault files, keyed by path
// - log: initial Events.md contents
// - settings: initial Settings.md contents
// - failWrite: (path) => boolean; makes the matching write throw
function harness(overrides = {}, opts = {}) {
  const { active = NOTE, extraFiles = {}, log, settings, failWrite } = opts;

  const data = new Map([
    ["TaskRPG/Scripts/engine.js", readRepo("Scripts/engine.js")],
    ["TaskRPG/Scripts/task-utils.js", readRepo("Scripts/task-utils.js")],
    ["TaskRPG/Engine/Settings.md", settings ?? readRepo("Engine/Settings.md")],
    [".obsidian/plugins/tasknotes/data.json", TASKNOTES_CONFIG],
    ["TaskNotes/Tasks", ""],
    [NOTE, noteText(overrides)],
    ...Object.entries(extraFiles),
  ]);

  if (log !== undefined) data.set(LOG, log);

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
      if (failWrite?.(p)) throw new Error("disk full");
      data.set(p, text);
    },
    list: async () => ({ files: [NOTE], folders: [] }),
  };

  const app = {
    workspace: {
      getActiveFile: () =>
        active === null
          ? null
          : {
              path: active,
              basename: path.basename(active, ".md"),
            },
    },
    vault: { adapter },
  };

  return {
    data,
    notices,
    press: () => run({ app }),
    undo: () => runUndo({ app }),
  };
}

const eventsOf = (h) => engine.parseEvents(h.data.get(LOG));
const taskDoneEventsOf = (h) =>
  eventsOf(h).filter((event) => event.type === "task_done");
const firstTaskDoneOf = (h) => taskDoneEventsOf(h)[0];
const settingsNote = (text = readRepo("Engine/Settings.md")) =>
  engine.parseSettingsNote(text);

// Built independently of utils.today() so the expected date is not derived
// from the code under test.
function ymd(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

// Build a valid seed log through the engine rather than hand-writing events.
function seededLog(actions, settings = settingsNote()) {
  let events = [];

  for (const action of actions) {
    events = engine.recordAction(events, action, settings).events;
  }

  return `${events.map((event) => JSON.stringify(event)).join("\n")}\n`;
}

const secondsAgo = (seconds) =>
  engine.localStamp(new Date(Date.now() - seconds * 1000));

// The caller must pass the note text captured before `press()`. This avoids
// falsely comparing a note created with overrides against the default note.
function assertNothingWasWritten(h, { notePath = NOTE, originalNote } = {}) {
  assert.ok(
    originalNote !== undefined,
    "pass the note text captured before press()",
  );

  assert.equal(h.data.has(LOG), false, "no event log was created");
  assert.equal(h.data.has(HERO), false, "no Hero cache was created");
  assert.equal(
    h.data.get(notePath),
    originalNote,
    "the task note was unchanged",
  );
  assert.equal(h.notices.length, 1, "exactly one user-facing Notice");
  assert.match(h.notices[0], /^TaskRPG: /);
  assert.match(h.notices[0], /Nothing was logged/);
}

describe("task-done.test.js", () => {
  describe("happy path", () => {
    test("resolves a task in the configured TaskNotes folder", async () => {
      const h = harness({ status: "open" });

      await h.press();

      const events = eventsOf(h);
      assert.deepEqual(
        events.map((event) => event.type),
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

      assert.equal(h.notices.length, 1);
      assert.match(h.notices[0], /Task complete/);
      assert.match(h.notices[0], /\*\*Outcome:\*\* \w+/);
    });

    test("writes status done over the note's previous status", async () => {
      const h = harness({ status: "in-progress" });

      await h.press();

      const done = firstTaskDoneOf(h);
      const fields = utils.parseFrontmatter(h.data.get(NOTE));

      assert.equal(fields.status, "done");
      assert.equal(fields.completedDate, done.timestamp);
    });

    test("rewrites Hero.md from the recalculated state", async () => {
      const h = harness({ status: "open" });

      await h.press();

      const hero = h.data.get(HERO);

      assert.match(hero, /^---\ntype: hero-state\n/m);
      assert.match(hero, /^mp: 9$/m);
      assert.match(hero, /^maxMP: 10$/m);
      assert.match(hero, /^xp_mind: 1$/m);
    });
  });

  describe("scope and task validation", () => {
    test("does nothing when no note is active", async () => {
      const h = harness({}, { active: null });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assertNothingWasWritten(h, { originalNote });
      assert.match(h.notices[0], /Open a TaskNotes task/);
    });

    test("does nothing for a valid-looking note outside the tasks folder", async () => {
      const outside = "Notes/fix the fence.md";
      const h = harness(
        {},
        {
          active: outside,
          extraFiles: { [outside]: noteText() },
        },
      );
      const originalNote = h.data.get(outside);

      await h.press();

      assertNothingWasWritten(h, {
        notePath: outside,
        originalNote,
      });
      assert.match(h.notices[0], /Open a TaskNotes task/);
    });

    test("does nothing when the note has no configured task tag", async () => {
      const h = harness({ tags: ["important"] });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assertNothingWasWritten(h, { originalNote });
      assert.match(h.notices[0], /This note is not a task/);
    });

    // TC-5: taskId identity failures are rejected before Settings validation.
    for (const [label, value] of [
      ["missing", undefined],
      ["empty", ""],
      ["quoted-empty", '""'],
      ["null", null],
      ["YAML null", "~"],
      ["the word undefined", "undefined"],
    ]) {
      test(`does nothing when taskId is ${label}`, async () => {
        const h = harness({ taskId: value });
        const originalNote = h.data.get(NOTE);

        await h.press();

        assertNothingWasWritten(h, { originalNote });
        assert.match(h.notices[0], /This note is not a task/);
      });
    }

    // TC-6: an absent or blank skill reaches Settings validation and is
    // rejected as unknown, before any write.
    for (const [label, value] of [
      ["missing", undefined],
      ["empty", ""],
      ["quoted-empty", '""'],
      ["null", null],
      ["YAML null", "~"],
      ["the word undefined", "undefined"],
    ]) {
      test(`does nothing when skill is ${label}`, async () => {
        const h = harness({ skill: value });
        const originalNote = h.data.get(NOTE);

        await h.press();

        assertNothingWasWritten(h, { originalNote });
        assert.match(h.notices[0], /Unknown skill:/);
      });
    }

    // TC-7: an absent or blank size reaches Settings validation and is
    // rejected as unknown, before any write.
    for (const [label, value] of [
      ["missing", undefined],
      ["empty", ""],
      ["quoted-empty", '""'],
      ["null", null],
      ["YAML null", "~"],
      ["the word undefined", "undefined"],
    ]) {
      test(`does nothing when size is ${label}`, async () => {
        const h = harness({ size: value });
        const originalNote = h.data.get(NOTE);

        await h.press();

        assertNothingWasWritten(h, { originalNote });
        assert.match(h.notices[0], /Unknown size:/);
      });
    }

    test("rejects a skill not listed in Settings before any write", async () => {
      const h = harness({ skill: "baking" });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assertNothingWasWritten(h, { originalNote });
      assert.match(h.notices[0], /Unknown skill: baking/);
    });

    test("rejects a size not listed in Settings before any write", async () => {
      const h = harness({ size: "huge" });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assertNothingWasWritten(h, { originalNote });
      assert.match(h.notices[0], /Unknown size: huge/);
    });
  });

  describe("planning rules", () => {
    test("a task scheduled today is planned and costs only its size", async () => {
      const h = harness({ scheduled: ymd(0) });

      await h.press();

      const done = firstTaskDoneOf(h);

      assert.equal(done.planned, true);
      assert.equal(done.mp, 1);
    });

    for (const [label, scheduled] of [
      ["yesterday", ymd(-1)],
      ["tomorrow", ymd(1)],
      ["absent", undefined],
      ["not a date", "not-a-date"],
    ]) {
      test(`a task scheduled ${label} is unplanned and pays the surcharge`, async () => {
        const h = harness({ scheduled });

        await h.press();

        const done = firstTaskDoneOf(h);

        assert.equal(done.planned, false);
        assert.equal(done.mp, 2, "small costs 1 MP plus 1 unplanned MP");
        assert.match(h.data.get(HERO), /^mp: 8$/m);
      });
    }

    test("a scheduled value with a time component is planned for the current game day", async () => {
      const currentGameDay = engine.gameDay(engine.localStamp(), 4);
      const h = harness({ scheduled: `${currentGameDay}T09:00` });

      await h.press();

      const done = firstTaskDoneOf(h);

      assert.equal(done.planned, true);
      assert.equal(done.mp, 1);
    });

    test("a quoted scheduled value is planned for the current game day", async () => {
      const currentGameDay = engine.gameDay(engine.localStamp(), 4);
      const h = harness({ scheduled: `"${currentGameDay}"` });

      await h.press();

      const done = firstTaskDoneOf(h);

      assert.equal(done.planned, true);
      assert.equal(done.mp, 1);
    });
  });

  describe("priority tags", () => {
    for (const [label, tags, important, urgent, xp] of [
      ["neither priority tag", ["task"], false, false, 3],
      ["important only", ["task", "important"], true, false, 5],
      ["urgent only", ["task", "urgent"], false, true, 5],
      ["both priority tags", ["task", "important", "urgent"], true, true, 6],
    ]) {
      test(`reads ${label} for a medium task`, async () => {
        const h = harness({ tags, size: "medium" });

        await h.press();

        const done = firstTaskDoneOf(h);

        assert.equal(done.important, important);
        assert.equal(done.urgent, urgent);
        assert.equal(done.xp, xp);
      });
    }
  });

  describe("duplicate and undo behaviour", () => {
    test("blocks a second resolution and changes nothing", async () => {
      const h = harness({ status: "open" });

      await h.press();

      const logAfterFirst = h.data.get(LOG);
      const noteAfterFirst = h.data.get(NOTE);
      const heroAfterFirst = h.data.get(HERO);

      await h.press();

      assert.equal(h.notices.length, 2);
      assert.match(h.notices[1], /already been resolved/);
      assert.match(h.notices[1], /Nothing was logged/);
      assert.equal(h.data.get(LOG), logAfterFirst);
      assert.equal(h.data.get(NOTE), noteAfterFirst);
      assert.equal(h.data.get(HERO), heroAfterFirst);
      assert.equal(taskDoneEventsOf(h).length, 1);
    });

    test("after Undo last, resolves again as a repeat while preserving the original event", async () => {
      const h = harness({ status: "open" });

      await h.press();

      const originalTaskDone = firstTaskDoneOf(h);
      const originalLine = h.data
        .get(LOG)
        .split("\n")
        .find((line) => line.includes(`"id":"${originalTaskDone.id}"`));

      await h.undo();

      assert.equal(utils.parseFrontmatter(h.data.get(NOTE)).status, "open");

      await h.press();

      const events = eventsOf(h);
      assert.deepEqual(
        events.map((event) => event.type),
        ["settings_changed", "task_done", "undo", "task_done"],
      );

      assert.ok(
        h.data.get(LOG).includes(originalLine),
        "the original task_done line remains unchanged",
      );

      const { results } = engine.recalculate(events, settingsNote());
      assert.equal(
        results[events[1].id],
        undefined,
        "the undone resolution is excluded",
      );
      assert.equal(results[events[3].id].repeat, true);

      const fields = utils.parseFrontmatter(h.data.get(NOTE));
      assert.equal(fields.status, "done");

      assert.equal(h.notices.length, 3);
      assert.match(h.notices[2], /Task complete/);
    });
  });

  describe("write failures", () => {
    test("writes nothing when the event-log write fails", async () => {
      const h = harness({ status: "open" }, { failWrite: (p) => p === LOG });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assertNothingWasWritten(h, { originalNote });
      assert.match(h.notices[0], /disk full/);
    });

    test("keeps the committed event when the task-note write fails", async () => {
      const h = harness({ status: "open" }, { failWrite: (p) => p === NOTE });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assert.equal(taskDoneEventsOf(h).length, 1);
      assert.equal(h.data.get(NOTE), originalNote);
      assert.equal(h.notices.length, 1);
      assert.match(h.notices[0], /disk full/);
      assert.match(h.notices[0], /Event was saved; do not press Done again/);
      assert.doesNotMatch(h.notices[0], /Nothing was logged/);
    });

    test("keeps the committed event and updated note when the Hero write fails", async () => {
      const h = harness({ status: "open" }, { failWrite: (p) => p === HERO });

      await h.press();

      const done = firstTaskDoneOf(h);
      const fields = utils.parseFrontmatter(h.data.get(NOTE));

      assert.ok(done, "the event was committed");
      assert.equal(fields.status, "done");
      assert.equal(fields.completedDate, done.timestamp);
      assert.equal(h.data.has(HERO), false);
      assert.equal(h.notices.length, 1);
      assert.match(h.notices[0], /disk full/);
      assert.match(h.notices[0], /Event was saved; do not press Done again/);
      assert.doesNotMatch(h.notices[0], /Nothing was logged/);
    });
  });

  describe("settings versioning", () => {
    const olderTaskDone = {
      type: "task_done",
      timestamp: secondsAgo(2 * 86400),
      taskId: "older-task",
      skill: "mind",
      size: "small",
      planned: true,
      roll: [4, 4],
      lootRoll: 1,
    };

    test("appends settings_changed before task_done when Settings.md changed", async () => {
      const oldSettings = settingsNote();
      const seeded = seededLog([olderTaskDone], oldSettings);

      const changedText = readRepo("Engine/Settings.md").replace(
        '"small": { "mp": 1',
        '"small": { "mp": 2',
      );
      assert.notEqual(changedText, readRepo("Engine/Settings.md"));

      const h = harness({}, { log: seeded, settings: changedText });

      await h.press();

      const log = h.data.get(LOG);
      assert.ok(log.startsWith(seeded), "earlier log lines are unchanged");

      const all = eventsOf(h);
      const added = all.slice(engine.parseEvents(seeded).length);

      assert.deepEqual(
        added.map((event) => event.type),
        ["settings_changed", "task_done"],
      );
      assert.equal(added[0].settings.taskSizes.small.mp, 2);
      assert.equal(added[1].mp, 2);
      assert.equal(added[0].timestamp, added[1].timestamp);

      const { results } = engine.recalculate(all, settingsNote(changedText));
      assert.equal(
        results[all[1].id].mpCost,
        1,
        "the older event keeps its original rules",
      );
    });

    test("appends only task_done when Settings.md is unchanged", async () => {
      const seeded = seededLog([olderTaskDone]);
      const h = harness({}, { log: seeded });

      await h.press();

      const all = eventsOf(h);
      const added = all.slice(engine.parseEvents(seeded).length);

      assert.deepEqual(
        added.map((event) => event.type),
        ["task_done"],
      );
    });

    test("fails safely when the existing event log is malformed", async () => {
      const malformedLog = "{not json\n";
      const h = harness({}, { log: malformedLog });
      const originalNote = h.data.get(NOTE);

      await h.press();

      assert.equal(
        h.data.get(LOG),
        malformedLog,
        "the malformed event log was not modified",
      );
      assert.equal(h.data.has(HERO), false, "no Hero cache was created");
      assert.equal(
        h.data.get(NOTE),
        originalNote,
        "the task note was unchanged",
      );
      assert.equal(h.notices.length, 1, "exactly one user-facing Notice");
      assert.match(h.notices[0], /^TaskRPG: /);
      assert.match(h.notices[0], /Nothing was logged/);
    });
  });

  describe("v1 field scope", () => {
    test("ignores project and companion fields on the note", async () => {
      const seeded = seededLog([
        {
          type: "focus_project",
          timestamp: secondsAgo(60),
          projectId: "p1",
        },
      ]);

      const h = harness(
        {
          size: "medium",
          project: '"[[02 Projects/Portfolio Site/Portfolio Site Home]]"',
          projectId: "p1",
          companion: "ember",
          campaign: "archivists-coast",
        },
        { log: seeded },
      );

      await h.press();

      const done = firstTaskDoneOf(h);

      for (const key of ["projectId", "project", "companion", "campaign"]) {
        assert.equal(
          key in done,
          false,
          `${key} must not reach the task_done event`,
        );
      }

      assert.equal(done.xp, 3, "v1 applies no focus-project bonus");
    });
  });
});
