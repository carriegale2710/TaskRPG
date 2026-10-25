"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const utils = require("./task-utils.js");

describe("task-utils.test.js", () => {
  describe("parseFrontmatter", () => {
    test("parses TaskNotes frontmatter", () => {
      const fields = utils.parseFrontmatter(
        [
          "---",
          "type: task",
          "taskId: abc",
          "scheduled: 2026-10-15",
          "tags: [urgent, important]",
          "---",
          "# Task",
        ].join("\n"),
      );

      assert.equal(fields.type, "task");
      assert.equal(fields.taskId, "abc");
      assert.equal(fields.scheduled, "2026-10-15");
      assert.deepEqual(utils.parseTags(fields.tags), ["urgent", "important"]);
      assert.equal(utils.hasTag(fields.tags, "urgent"), true);
      assert.equal(utils.hasTag(fields.tags, "important"), true);
    });

    test("parses TaskNotes tags written as a YAML block list", () => {
      const fields = utils.parseFrontmatter(
        [
          "---",
          "type: task",
          "tags:",
          " - task",
          " - important",
          " - #urgent",
          "---",
          "# Task",
        ].join("\n"),
      );

      assert.deepEqual(fields.tags, ["task", "important", "#urgent"]);
      assert.equal(utils.hasTag(fields.tags, "important"), true);
      assert.equal(utils.hasTag(fields.tags, "urgent"), true);
    });

    test("parses quoted flow-list tags without quotes", () => {
      const fields = utils.parseFrontmatter(
        '---\ntags: ["urgent", "important"]\n---\n# Task',
      );

      assert.deepEqual(utils.parseTags(fields.tags), ["urgent", "important"]);
    });

    test("matches tags case-insensitively and ignores prefixes", () => {
      assert.equal(utils.hasTag("#Urgent", "urgent"), true);
      assert.equal(utils.hasTag("urgently", "urgent"), false);
      assert.equal(utils.hasTag("Important", "important"), true);

      assert.deepEqual(utils.parseTags(null), []);
      assert.deepEqual(utils.parseTags(undefined), []);
      assert.deepEqual(utils.parseTags([]), []);
      assert.deepEqual(utils.parseTags(""), []);
    });

    test("strips quotes from scalar values", () => {
      const fields = utils.parseFrontmatter(
        "---\ntaskId: \"1\"\nscheduled: '2026-10-15'\nstatus: open\n---\n# Task",
      );

      assert.equal(fields.taskId, "1");
      assert.equal(fields.scheduled, "2026-10-15");
      assert.equal(fields.status, "open");
    });

    test("parses type, taskId, skill and size written in double quotes", () => {
      const fields = utils.parseFrontmatter(
        '---\ntype: "task"\ntaskId: "1"\nskill: "mind"\nsize: "medium"\n---\n# Task',
      );

      assert.equal(fields.type, "task");
      assert.equal(fields.taskId, "1");
      assert.equal(fields.skill, "mind");
      assert.equal(fields.size, "medium");
    });

    test("accepts quoted values the way task-done.js checks them", () => {
      const fields = utils.parseFrontmatter(
        '---\ntype: "task"\ntaskId: "1"\nskill: "mind"\nsize: "medium"\n---\n# Task',
      );
      const settings = {
        skills: ["mind"],
        taskSizes: { medium: { mp: 3, xp: 3 } },
      };

      assert.equal(fields.taskId, "1");
      assert.equal(settings.skills.includes(fields.skill), true);
      assert.equal(Boolean(settings.taskSizes[fields.size]), true);
    });

    test("single-quoted and unquoted values match double-quoted values", () => {
      const read = (note) => utils.parseFrontmatter(note);
      const values = [
        ["type", "task"],
        ["taskId", "1"],
        ["skill", "mind"],
        ["size", "m"],
      ];

      for (const [key, value] of values) {
        const doubleQuoted = read(`---\n${key}: "${value}"\n---\n# Task`);
        const singleQuoted = read(`---\n${key}: '${value}'\n---\n# Task`);
        const unquoted = read(`---\n${key}: ${value}\n---\n# Task`);

        assert.equal(doubleQuoted[key], value);
        assert.equal(singleQuoted[key], value);
        assert.equal(unquoted[key], value);
      }
    });

    test("parses an empty quoted value as an empty string", () => {
      const fields = utils.parseFrontmatter(
        "---\ncompletedDate: \"\"\nstatus: ''\n---\n# Task",
      );

      assert.equal(fields.completedDate, "");
      assert.equal(fields.status, "");
    });

    test("keeps a colon or quote inside a quoted value", () => {
      const fields = utils.parseFrontmatter(
        '---\nname: "a: b"\nnote: \'a "b"\'\n---\n# Task',
      );

      assert.equal(fields.name, "a: b");
      assert.equal(fields.note, 'a "b"');
    });

    test("handles CRLF, a leading BOM, empty and missing frontmatter", () => {
      const crlf = utils.parseFrontmatter(
        "---\r\ntags:\r\n - important\r\n---\r\n# Task",
      );
      assert.deepEqual(crlf.tags, ["important"]);

      const bom = utils.parseFrontmatter("\uFEFF---\ntype: task\n---\n# Task");
      assert.equal(bom.type, "task");

      assert.deepEqual(utils.parseFrontmatter("---\n---\n# Task"), {});
      assert.deepEqual(utils.parseFrontmatter("# Task"), {});
    });
  });

  describe("scheduled", () => {
    test("reads the TaskNotes scheduled date", () => {
      assert.equal(utils.scheduled({ scheduled: "2026-10-15" }), "2026-10-15");
      assert.equal(utils.scheduled({}), "");
    });
  });

  describe("result presentation", () => {
    const outcomes = Object.keys(utils.OUTCOME_TABLE);

    test("selects every placeholder table result for rolls 1 through 6", () => {
      for (const outcome of outcomes) {
        for (let lootRoll = 1; lootRoll <= 6; lootRoll += 1) {
          assert.equal(
            utils.pickTableResult(outcome, lootRoll),
            utils.OUTCOME_TABLE[outcome][lootRoll - 1],
            `${outcome} / loot roll ${lootRoll}`,
          );
        }
      }
    });

    test("rejects loot rolls outside 1 through 6", () => {
      for (const outcome of outcomes) {
        assert.throws(() => utils.pickTableResult(outcome, 0));
        assert.throws(() => utils.pickTableResult(outcome, 7));
      }
    });

    test("formats a basic result card without loot or overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [3, 4],
        total: 7,
        outcome: "partial",
        tableResult: "Progress comes at a cost.",
        xp: 3,
        mpCost: 3,
        mp: 7,
        loot: false,
        overdraft: false,
      });

      assert.match(card, /^# Write tests$/m);
      assert.match(card, /\*\*Roll:\*\* 3 \+ 4 = 7/);
      assert.match(card, /\*\*Outcome:\*\* partial/);
      assert.match(card, /Progress comes at a cost\./);
      assert.match(card, /\*\*XP:\*\* \+3/);
      assert.match(card, /\*\*MP:\*\* -3 \(now 7\)/);

      assert.doesNotMatch(card, /Loot/i);
      assert.doesNotMatch(card, /Tired/i);
    });

    test("formats a result card with loot", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [5, 5],
        total: 10,
        outcome: "success",
        tableResult: "You find something useful.",
        xp: 3,
        mpCost: 1,
        mp: 9,
        loot: true,
        overdraft: false,
      });

      assert.match(card, /\*\*Roll:\*\* 5 \+ 5 = 10/);
      assert.match(card, /\*\*Outcome:\*\* success/);
      assert.match(card, /You find something useful\./);
      assert.match(card, /\*\*XP:\*\* \+3/);
      assert.match(card, /\*\*MP:\*\* -1 \(now 9\)/);
      assert.match(card, /Loot/i);

      assert.doesNotMatch(card, /Tired/i);
    });

    test("formats a result card with an overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [2, 2],
        total: 4,
        outcome: "setback",
        tableResult: "The effort costs more than expected.",
        xp: 1,
        mpCost: 5,
        mp: 0,
        loot: false,
        overdraft: true,
      });

      assert.match(card, /\*\*Roll:\*\* 2 \+ 2 = 4/);
      assert.match(card, /\*\*Outcome:\*\* setback/);
      assert.match(card, /\*\*XP:\*\* \+1/);
      assert.match(card, /\*\*MP:\*\* -5 \(now 0\)/);
      assert.match(card, /Tired/i);

      assert.doesNotMatch(card, /Loot/i);
    });

    test("formats a result card with both loot and an overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [6, 6],
        total: 12,
        outcome: "success",
        tableResult: "A costly discovery.",
        xp: 6,
        mpCost: 6,
        mp: 0,
        loot: true,
        overdraft: true,
      });

      assert.match(card, /\*\*Roll:\*\* 6 \+ 6 = 12/);
      assert.match(card, /\*\*Outcome:\*\* success/);
      assert.match(card, /\*\*XP:\*\* \+6/);
      assert.match(card, /\*\*MP:\*\* -6 \(now 0\)/);
      assert.match(card, /Loot/i);
      assert.match(card, /Tired/i);
    });
  });

  describe("TaskNotes configuration", () => {
    const files = (text) => ({
      read: async () => {
        if (text === null) throw new Error("missing data.json");
        return text;
      },
    });

    test("taskFolder reads the configured folder and falls back to the default", async () => {
      const configured = JSON.stringify({
        tasksFolder: "/TaskNotes/Tasks/",
      });

      assert.equal(
        await utils.taskFolder(files(configured)),
        "TaskNotes/Tasks",
      );
      assert.equal(await utils.taskFolder(files(null)), "TaskNotes/Tasks");
      assert.equal(
        await utils.taskFolder(files("not json")),
        "TaskNotes/Tasks",
      );
    });

    test("taskTag reads the configured tag and falls back to 'task'", async () => {
      const configured = JSON.stringify({ taskTag: "#todo" });

      assert.equal(await utils.taskTag(files(configured)), "todo");
      assert.equal(await utils.taskTag(files(null)), "task");
      assert.equal(await utils.taskTag(files("not json")), "task");
    });
  });

  describe("updateTaskStatus", () => {
    test("updates completion fields without losing other fields", () => {
      const text =
        '---\ntype: task\ntaskId: abc\nstatus: done\ncompletedDate: ""\n---\n# Task';

      const updated = utils.updateTaskStatus(text, {
        status: "completed",
        completedDate: "2026-10-15T01:00:00+11:00",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "completed");
      assert.equal(fields.completedDate, "2026-10-15T01:00:00+11:00");
      assert.equal(fields.taskId, "abc");
    });

    test("inserts a missing completedDate into the frontmatter", () => {
      const text = "---\ntype: task\ntaskId: abc\nstatus: done\n---\n# Task";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "2026-10-15T01:00:00+11:00",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.completedDate, "2026-10-15T01:00:00+11:00");
      assert.equal(fields.taskId, "abc");
      assert.equal(updated.endsWith("# Task"), true);
    });

    test("edits only the frontmatter, not a status line in the body", () => {
      const body = "# Task\n\nstatus: body-value\ncompletedDate: body-date";
      const text = `---\ntype: task\ntaskId: abc\n---\n${body}`;

      const updated = utils.updateTaskStatus(text, {
        status: "completed",
        completedDate: "2026-10-15T01:00:00+11:00",
      });

      assert.equal(utils.parseFrontmatter(updated).status, "completed");
      assert.equal(updated.endsWith(body), true);
      assert.match(updated, /^status: body-value$/m);
    });

    test("writes replacement-pattern characters literally", () => {
      const text =
        '---\ntype: task\nstatus: open\ncompletedDate: ""\n---\n# Task';

      const updated = utils.updateTaskStatus(text, {
        status: "$&",
        completedDate: "$1 and $&",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "$&");
      assert.equal(fields.completedDate, "$1 and $&");
    });

    test("writes an empty completedDate and keeps the status it is given", () => {
      const text = "---\ntype: task\ntaskId: abc\nstatus: done\n---\n# Task";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "done");
      assert.equal(fields.completedDate, "");
    });

    test("preserves CRLF line endings when inserting a field", () => {
      const text =
        "---\r\ntype: task\r\ntaskId: abc\r\nstatus: done\r\n---\r\n# Task\r\n";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "2026-10-15T01:00:00+11:00",
      });

      assert.equal(
        utils.parseFrontmatter(updated).completedDate,
        "2026-10-15T01:00:00+11:00",
      );
      assert.equal(/[^\r]\n/.test(updated), false);
      assert.equal(updated.endsWith("---\r\n# Task\r\n"), true);
    });

    test("throws a clear error when there is no frontmatter to edit", () => {
      assert.throws(
        () =>
          utils.updateTaskStatus("# Task\n\nstatus: body-value", {
            status: "completed",
            completedDate: "2026-10-15T01:00:00+11:00",
          }),
        /frontmatter/i,
      );
    });
  });

  describe("reopenTaskNote", () => {
    test("reopens a note after undoing its task_done event", () => {
      const text =
        '---\ntype: task\ntaskId: abc\nstatus: done\ncompletedDate: "2026-10-15T01:00:00+11:00"\n---\n# Task';

      const updated = utils.reopenTaskNote(text);
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "open");
      assert.equal(fields.completedDate, "");
      assert.equal(fields.taskId, "abc");
      assert.equal(updated.endsWith("# Task"), true);
    });
  });

  // Duplicate-resolution guard used by task-done.js.
  //
  // Undo command behavior is covered by undo.test.js. This section covers only
  // the event-list query that decides whether pressing Task done again is safe.
  describe("hasUnresolvedTaskDone", () => {
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
      assert.equal(utils.hasUnresolvedTaskDone([], "task-1"), false);
    });

    test("blocks a second resolution while the latest relevant event is an unresolved task_done", () => {
      const events = [taskDoneEvent()];

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), true);
    });

    test("allows another resolution after an undo targets the task's task_done event", () => {
      const events = [
        taskDoneEvent(),
        undoEvent({ targetEventId: "task-event-1" }),
      ];

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("links an undo by targetEventId rather than taskId", () => {
      const events = [
        taskDoneEvent(),
        undoEvent({ targetEventId: "task-event-1" }),
      ];

      assert.equal(events.at(-1).taskId, undefined);
      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), false);
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

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), true);
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

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), true);
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

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), false);
    });

    test("does not confuse a task_done for another task with this task's guard", () => {
      const events = [taskDoneEvent({ id: "task-event-1", taskId: "task-2" })];

      assert.equal(utils.hasUnresolvedTaskDone(events, "task-1"), false);
    });
  });
});
