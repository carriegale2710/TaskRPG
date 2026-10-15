'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { hasUnresolvedTaskDone } = require('./task-utils.js');
const engine = require('./engine.js');

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
  skills: ['mind'],
  xpBonus: { important: 0.5, urgent: 0.5, focus: 0.25 },
  taskSizes: { small: { mp: 1, xp: 1 }, medium: { mp: 3, xp: 3 }, large: { mp: 5, xp: 5 } },
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
    type: 'task_done',
    timestamp,
    taskId,
    skill: 'mind',
    size: 'small',
    planned: true,
    important: false,
    urgent: false,
    roll,
    lootRoll,
  };
}

function undoEvent({ id, targetEventId, timestamp }) {
  return { id, type: 'undo', timestamp, targetEventId };
}

test('a TaskNotes task marked Done can be resolved when no RPG resolution exists', () => {
  assert.equal(hasUnresolvedTaskDone([], 'task-1'), false);
});

test('a second resolution is blocked while the latest relevant event is an unresolved task_done', () => {
  const events = [
    taskDoneEvent({ id: 'task-event-1', taskId: 'task-1', timestamp: '2026-10-15T09:00:00+11:00' }),
  ];
  assert.equal(hasUnresolvedTaskDone(events, 'task-1'), true);
});

test('a valid engine undo makes the task eligible for resolution again', () => {
  const events = [
    taskDoneEvent({ id: 'task-event-1', taskId: 'task-1', timestamp: '2026-10-15T09:00:00+11:00' }),
    undoEvent({
      id: 'undo-event-1',
      targetEventId: 'task-event-1',
      timestamp: '2026-10-15T09:05:00+11:00',
    }),
  ];
  assert.equal(hasUnresolvedTaskDone(events, 'task-1'), false);
});

test('undo is linked by targetEventId, not taskId', () => {
  const events = [
    taskDoneEvent({ id: 'task-event-1', taskId: 'task-1', timestamp: '2026-10-15T09:00:00+11:00' }),
    undoEvent({
      id: 'undo-event-1',
      targetEventId: 'task-event-1',
      timestamp: '2026-10-15T09:05:00+11:00',
    }),
  ];
  assert.equal(events.at(-1).taskId, undefined);
  assert.equal(hasUnresolvedTaskDone(events, 'task-1'), false);
});

test('an undo targeting another task does not release this task resolution guard', () => {
  const events = [
    taskDoneEvent({ id: 'task-event-1', taskId: 'task-1', timestamp: '2026-10-15T09:00:00+11:00' }),
    taskDoneEvent({ id: 'task-event-2', taskId: 'task-2', timestamp: '2026-10-15T09:01:00+11:00' }),
    undoEvent({
      id: 'undo-event-2',
      targetEventId: 'task-event-2',
      timestamp: '2026-10-15T09:06:00+11:00',
    }),
  ];
  assert.equal(hasUnresolvedTaskDone(events, 'task-1'), true);
});

test('resolution after undo is marked repeat by the engine', () => {
  const first = taskDoneEvent({
    id: 'task-event-1',
    taskId: 'task-1',
    timestamp: '2026-10-15T09:00:00+11:00',
    roll: [6, 6],
    lootRoll: 1,
  });
  const undo = undoEvent({
    id: 'undo-event-1',
    targetEventId: 'task-event-1',
    timestamp: '2026-10-15T09:05:00+11:00',
  });
  const second = taskDoneEvent({
    id: 'task-event-2',
    taskId: 'task-1',
    timestamp: '2026-10-15T09:10:00+11:00',
    roll: [6, 6],
    lootRoll: 1,
  });

  const out = engine.recordAction(
    [first, undo],
    second,
    SETTINGS,
    '2026-10-15T09:10:00+11:00'
  );

  assert.equal(out.result.repeat, true);
});

test('undo preserves the original task_done event and appends a correction', () => {
  const first = taskDoneEvent({
    id: 'task-event-1',
    taskId: 'task-1',
    timestamp: '2026-10-15T09:00:00+11:00',
  });
  const undo = undoEvent({
    id: 'undo-event-1',
      targetEventId: 'task-event-1',
      timestamp: '2026-10-15T09:05:00+11:00',
  });

  const out = engine.recordAction(
    [first],
    undo,
    SETTINGS,
    '2026-10-15T09:05:00+11:00'
  );

  assert.equal(out.events.length, 3); // settings_changed, task_done, undo
  assert.equal(out.events.at(-1).type, 'undo');
  assert.equal(out.events.at(-1).targetEventId, 'task-event-1');
  assert.equal(out.events.some((event) => event.id === 'task-event-1'), true);
});

test('duplicate resolution guard accepts an undo that targets the original task_done event', () => {
  const events = [
    taskDoneEvent({ id: 'task-event-1', taskId: 'task-1', timestamp: '2026-10-15T09:00:00+11:00' }),
    undoEvent({
      id: 'undo-event-1',
      targetEventId: 'task-event-1',
      timestamp: '2026-10-15T09:05:00+11:00',
    }),
    taskDoneEvent({ id: 'task-event-2', taskId: 'task-1', timestamp: '2026-10-15T09:10:00+11:00' }),
  ];
  assert.equal(hasUnresolvedTaskDone(events, 'task-1'), true);
});
