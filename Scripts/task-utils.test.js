"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const utils = require("./task-utils.js");

test("parses TaskNotes frontmatter", () => {
  const fields = utils.parseFrontmatter(
    "---\ntype: task\ntaskId: abc\nscheduled: 2026-10-15\nurgent: true\n---\n# Task",
  );
  assert.equal(fields.type, "task");
  assert.equal(fields.taskId, "abc");
  assert.equal(fields.scheduled, "2026-10-15");
  assert.equal(fields.urgent, "true");
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
  assert.equal(fields.completedDate, '"2026-10-15T01:00:00+11:00"');
  assert.equal(fields.taskId, "abc");
});
