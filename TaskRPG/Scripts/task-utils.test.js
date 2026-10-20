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
});
