'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const utils = require('./task-utils.js');

test('parses TaskNotes frontmatter', () => {
  const fields = utils.parseFrontmatter('---\ntype: task\ntaskId: abc\nurgent: true\n---\n# Task');
  assert.equal(fields.type, 'task');
  assert.equal(fields.taskId, 'abc');
  assert.equal(fields.urgent, 'true');
});

test('builds a backlog task note', () => {
  const text = utils.buildTaskNote({
    name: 'Write tests', skill: 'mind', size: 'medium',
    urgent: false, important: true, taskId: 'write-tests-1', created: '2026-10-15T00:00:00+11:00',
  });
  const fields = utils.parseFrontmatter(text);
  assert.equal(fields.status, 'backlog');
  assert.equal(fields.size, 'medium');
  assert.equal(fields.important, 'true');
  assert.match(text, /# Write tests/);
});

test('suggests the most frequent size and defaults to medium', () => {
  const tasks = [
    { skill: 'mind', size: 'small' },
    { skill: 'mind', size: 'small' },
    { skill: 'mind', size: 'large' },
    { skill: 'body', size: 'large' },
  ];
  assert.equal(utils.suggestSize(tasks, 'mind'), 'small');
  assert.equal(utils.suggestSize(tasks, 'body'), 'large');
  assert.equal(utils.suggestSize([], 'craft'), 'medium');
});

test('selects a placeholder table result', () => {
  assert.equal(utils.pickTableResult('success', 1), utils.OUTCOME_TABLE.success[0]);
  assert.equal(utils.pickTableResult('setback', 6), utils.OUTCOME_TABLE.setback[5]);
  assert.throws(() => utils.pickTableResult('success', 7));
});

test('formats a dismissible result card', () => {
  const card = utils.formatResultCard({
    name: 'Write tests', roll: [3, 4], total: 7, outcome: 'partial',
    tableResult: 'Progress comes at a cost.', xp: 3, mpCost: 3, mp: 7,
    loot: false, overdraft: false,
  });
  assert.match(card, /\*\*Roll:\*\* 3 \+ 4 = 7/);
  assert.match(card, /\*\*Outcome:\*\* partial/);
  assert.match(card, /Progress comes at a cost\./);
});

test('updates task status without losing other fields', () => {
  const text = utils.buildTaskNote({
    name: 'Write tests', skill: 'mind', size: 'medium',
    urgent: false, important: true, taskId: 'write-tests-1', created: '2026-10-15T00:00:00+11:00',
  });
  const updated = utils.updateTaskStatus(text, {
    status: 'completed', plannedDate: '2026-10-15', completedDate: '2026-10-15T01:00:00+11:00',
  });
  const fields = utils.parseFrontmatter(updated);
  assert.equal(fields.status, 'completed');
  assert.equal(fields.plannedDate, '"2026-10-15"');
  assert.equal(fields.completedDate, '"2026-10-15T01:00:00+11:00"');
  assert.equal(fields.taskId, 'write-tests-1');
});
