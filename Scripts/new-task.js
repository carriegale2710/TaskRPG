'use strict';

// QuickAdd user script: creates a TaskRPG task in TaskNotes/.
const SETTINGS = 'Engine/Settings.md';
const ENGINE = 'Scripts/engine.js';
const UTILS = 'Scripts/task-utils.js';
const TASKS_DIR = 'TaskNotes';

module.exports = async ({ app, quickAddApi }) => {
  const files = app.vault.adapter;
  let createdPath = '';
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const settings = engine.parseSettingsNote(await files.read(SETTINGS));

    const name = (await quickAddApi.inputPrompt('Task name'))?.trim();
    if (!name) return;

    const skill = await quickAddApi.suggester(settings.skills, settings.skills);
    if (!skill) return;

    const tasks = await readTasks(files, utils);
    const suggested = utils.suggestSize(tasks, skill);
    const sizeOptions = settings.taskSizes && Object.keys(settings.taskSizes).length
      ? Object.keys(settings.taskSizes)
      : utils.SIZES;
    const size = await quickAddApi.suggester(
      sizeOptions.map((option) => option === suggested ? `${option} (usual)` : option),
      sizeOptions
    );
    if (!size) return;

    const urgent = await quickAddApi.yesNoPrompt('Urgent?');
    const important = await quickAddApi.yesNoPrompt('Important?');
    if (urgent !== true && urgent !== false) return;
    if (important !== true && important !== false) return;

    const slug = utils.slugify(name);
    const taskId = `${slug}-${Date.now().toString(36)}`;
    const path = await uniquePath(files, `${TASKS_DIR}/${slug}.md`);
    const note = utils.buildTaskNote({
      name, skill, size, urgent, important, taskId,
      created: engine.localStamp(),
    });

    await files.write(path, note);
    createdPath = path;
    new Notice(`Task created: ${name}`, 6000);
  } catch (error) {
    if (createdPath && await files.exists(createdPath)) await files.remove(createdPath).catch(() => {});
    new Notice(`TaskRPG: ${error.message} Nothing was created.`, 10000);
  }
};

async function loadModule(files, path) {
  const module = { exports: {} };
  new Function('module', 'exports', await files.read(path))(module, module.exports);
  return module.exports;
}

async function readTasks(files, utils) {
  if (!(await files.exists(TASKS_DIR))) return [];
  const tasks = [];
  for (const file of (await files.list(TASKS_DIR)).files || []) {
    if (!file.endsWith('.md')) continue;
    const fields = utils.parseFrontmatter(await files.read(file));
    tasks.push({ skill: fields.skill, size: fields.size });
  }
  return tasks;
}

async function uniquePath(files, path) {
  if (!(await files.exists(path))) return path;
  const base = path.replace(/\.md$/, '');
  let n = 2;
  while (await files.exists(`${base}-${n}.md`)) n++;
  return `${base}-${n}.md`;
}
