'use strict';

// QuickAdd user script: adds the active backlog TaskNote to today's list.
const UTILS = 'Scripts/task-utils.js';

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  try {
    const utils = await loadModule(files, UTILS);
    const file = app.workspace.getActiveFile();
    if (!file || !/^TaskNotes\/[^/]+\.md$/.test(file.path)) {
      throw new Error('Open a TaskNotes task before planning it.');
    }

    const original = await files.read(file.path);
    const task = utils.parseFrontmatter(original);
    if (task.type !== 'task' || !task.taskId) throw new Error('This note is not a TaskRPG task.');
    if (task.status === 'completed') throw new Error('This task is already completed.');

    const plannedDate = utils.today();
    await files.write(file.path, utils.updateTaskStatus(original, {
      status: 'planned',
      plannedDate,
      completedDate: task.completedDate || '',
    }));

    new Notice(`Planned for today: ${task.name || file.basename}`, 6000);
  } catch (error) {
    new Notice(`TaskRPG: ${error.message}`, 10000);
  }
};

async function loadModule(files, path) {
  const module = { exports: {} };
  new Function('module', 'exports', await files.read(path))(module, module.exports);
  return module.exports;
}
