"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const utils = require("./task-utils.js");

describe("task-utils.test.js", () => {
  test("parses TaskNotes frontmatter", () => {
    const fields = utils.parseFrontmatter(
      "---\ntype: task\ntaskId: abc\nscheduled: 2026-10-15\ntags: [urgent, important]\n---\n# Task",
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
      "---\ntype: task\ntags:\n  - task\n  - important\n  - #urgent\n---\n# Task",
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
      '---\ntaskId: "1"\nscheduled: \'2026-10-15\'\nstatus: open\n---\n# Task',
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

  test("accepts a fully quoted task the way task-done.js checks it", () => {
    const fields = utils.parseFrontmatter(
      '---\ntype: "task"\ntaskId: "1"\nskill: "mind"\nsize: "medium"\n---\n# Task',
    );
    const settings = {
      skills: ["mind"],
      taskSizes: { medium: { mp: 3, xp: 3 } },
    };
    assert.equal(fields.type !== "task" || !fields.taskId, false);
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
      '---\ncompletedDate: ""\nstatus: \'\'\n---\n# Task',
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
      "---\r\ntags:\r\n  - important\r\n---\r\n# Task",
    );
    assert.deepEqual(crlf.tags, ["important"]);

    const bom = utils.parseFrontmatter("\uFEFF---\ntype: task\n---\n# Task");
    assert.equal(bom.type, "task");

    assert.deepEqual(utils.parseFrontmatter("---\n---\n# Task"), {});
    assert.deepEqual(utils.parseFrontmatter("# Task"), {});
  });

  test("reads the TaskNotes scheduled date", () => {
    assert.equal(utils.scheduled({ scheduled: "2026-10-15" }), "2026-10-15");
    assert.equal(utils.scheduled({ scheduled: "2026-10-15" }), "2026-10-15");
    assert.equal(utils.scheduled({}), "");
  });

  test("selects a placeholder table result", () => {
    assert.equal(
      utils.pickTableResult("success", 1),
      utils.OUTCOME_TABLE.success[0],
    );
    assert.equal(
      utils.pickTableResult("setback", 6),
      utils.OUTCOME_TABLE.setback[5],
    );
    assert.throws(() => utils.pickTableResult("success", 7));
  });

  test("formats a dismissible result card", () => {
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
    assert.match(card, /\*\*Roll:\*\* 3 \+ 4 = 7/);
    assert.match(card, /\*\*Outcome:\*\* partial/);
    assert.match(card, /Progress comes at a cost\./);
  });

  test("taskFolder reads TaskNotes' configured folder and falls back to the default", async () => {
    const files = (text) => ({
      read: async () => {
        if (text === null) throw new Error("missing data.json");
        return text;
      },
    });
    const configured = JSON.stringify({ tasksFolder: "/TaskNotes/Tasks/" });
    assert.equal(await utils.taskFolder(files(configured)), "TaskNotes/Tasks");
    assert.equal(await utils.taskFolder(files(null)), "TaskNotes/Tasks");
    assert.equal(await utils.taskFolder(files("not json")), "TaskNotes/Tasks");
  });

  test("taskTag reads TaskNotes' configured tag and falls back to 'task'", async () => {
    const files = (text) => ({
      read: async () => {
        if (text === null) throw new Error("missing data.json");
        return text;
      },
    });
    const configured = JSON.stringify({ taskTag: "#todo" });
    assert.equal(await utils.taskTag(files(configured)), "todo");
    assert.equal(await utils.taskTag(files(null)), "task");
    assert.equal(await utils.taskTag(files("not json")), "task");
  });

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

  test("undo writes an empty completedDate and preserves the existing status", () => {
    const text = "---\ntype: task\ntaskId: abc\nstatus: done\n---\n# Task";
    const updated = utils.updateTaskStatus(text, {
      status: "done",
      completedDate: "",
    });
    const fields = utils.parseFrontmatter(updated);
    assert.equal(fields.status, "done");
    assert.equal(fields.completedDate, "");
  });

  test("undoing a task_done event reopens the matching note", () => {
    const text =
      '---\ntype: task\ntaskId: abc\nstatus: done\ncompletedDate: "2026-10-15T01:00:00+11:00"\n---\n# Task';
    const updated = utils.reopenTaskNote(text);
    const fields = utils.parseFrontmatter(updated);
    assert.equal(fields.status, "open");
    assert.equal(fields.completedDate, "");
    assert.equal(fields.taskId, "abc");
    assert.equal(updated.endsWith("# Task"), true);
  });

  test("preserves CRLF line endings when inserting a field", () => {
    const text =
      "---\r\ntype: task\r\ntaskId: abc\r\nstatus: done\r\n---\r\n# Task\r\n";
    const updated = utils.updateTaskStatus(text, {
      status: "done",
      completedDate: "2026-10-15T01:00:00+11:00",
    });
    assert.equal(utils.parseFrontmatter(updated).completedDate, "2026-10-15T01:00:00+11:00");
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
