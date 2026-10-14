'use strict';

// QuickAdd user script: undoes the newest task or habit action from today.
const LOG = 'Engine/Events.md';
const SETTINGS = 'Engine/Settings.md';
const ENGINE = 'Scripts/engine.js';
const UTILS = 'Scripts/task-utils.js';
const TASKS_DIR = 'TaskNotes';

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const settings = engine.parseSettingsNote(await files.read(SETTINGS));
    const previous = await files.exists(LOG) ? await files.read(LOG) : '';
    const events = engine.parseEvents(previous);
    const timestamp = engine.localStamp();
    const day = engine.gameDay(timestamp, settings.dayRolloverHour);
    const last = engine.recalculate(events, settings).lastActionByDay[day]?.at(-1);
    if (!last) throw new Error('Nothing to undo for today.');

    const target = events.find((event) => event.id === last);
    const out = engine.recordAction(events, { type: 'undo', timestamp }, settings, timestamp);
    const lines = out.added.map((event) => JSON.stringify(event)).join('\n') + '\n';
    await files.write(LOG, `${previous.trimEnd()}${previous.trim() ? '\n' : ''}${lines}`);
    committed = true;

    if (target?.type === 'task_done' && target.taskId) {
      const path = await findTaskPath(files, utils, target.taskId);
      if (path) {
        const text = await files.read(path);
        const task = utils.parseFrontmatter(text);
        await files.write(path, utils.updateTaskStatus(text, {
          status: task.plannedDate === utils.today() ? 'planned' : 'backlog',
          plannedDate: task.plannedDate || '',
          completedDate: '',
        }));
      }
    }

    new Notice('Undid the last action. No re-roll.', 8000);
  } catch (error) {
    new Notice(
      `TaskRPG: ${error.message}${committed ? ' Undo was saved; do not press again.' : ' Nothing was changed.'}`,
      12000
    );
  }
};

async function loadModule(files, path) {
  const module = { exports: {} };
  new Function('module', 'exports', await files.read(path))(module, module.exports);
  return module.exports;
}

async function findTaskPath(files, utils, taskId) {
  if (!(await files.exists(TASKS_DIR))) return '';
  for (const file of (await files.list(TASKS_DIR)).files || []) {
    if (!file.endsWith('.md')) continue;
    if (utils.parseFrontmatter(await files.read(file)).taskId === taskId) return file;
  }
  return '';
}
