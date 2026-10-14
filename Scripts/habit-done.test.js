'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const run = require('./habit-done.js');
const E = require('./engine.js');

const readRepo = (name) => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
function harness(choice = true, active = 'Engine/Habits/Morning routine.md') {
  const data = new Map([
    ['Scripts/engine.js', readRepo('Scripts/engine.js')],
    ['Engine/Settings.md', readRepo('Engine/Settings.md')],
    ['Engine/Habits/Morning routine.md', readRepo('Engine/Habits/Morning routine.md')],
    ['Engine/Hero.md', readRepo('Engine/Hero.md')],
  ]);
  const notices = [];
  global.Notice = class { constructor(message) { notices.push(message); } };
  const app = {
    workspace: { getActiveFile: () => active ? { path: active, basename: 'Morning routine' } : null },
    vault: { adapter: { read: async (p) => { if (!data.has(p)) throw Error(`Missing ${p}`); return data.get(p); },
      exists: async (p) => data.has(p), write: async (p, text) => { data.set(p, text); } } },
  };
  return { data, notices, press: () => run({ app, quickAddApi: { suggester: async () => choice } }) };
}

test('on-time and late Done append events and refresh derived panels without dice', async () => {
  const h = harness(true);
  await h.press();
  const first = E.parseEvents(h.data.get('Engine/Events.md'));
  assert.deepEqual(first.map((e) => e.type), ['settings_changed', 'habit_done']);
  assert.equal(first[1].onTime, true);
  assert.equal(first[1].roll, undefined);
  assert.match(h.data.get('Engine/Habits/Morning routine.md'), /\| on time \|/);
  assert.match(h.data.get('Engine/Hero.md'), /xp_vitality: 1/);
  assert.match(h.notices[0], /\+1 XP/);
  const late = harness(false);
  await late.press();
  const second = E.parseEvents(late.data.get('Engine/Events.md'));
  assert.equal(second[1].onTime, false);
  assert.match(late.data.get('Engine/Habits/Morning routine.md'), /\| late \|/);
});

test('cancel and invalid active note do not write an event', async () => {
  for (const h of [harness(undefined), harness(true, null)]) {
    await h.press();
    assert.equal(h.data.has('Engine/Events.md'), false);
  }
});
