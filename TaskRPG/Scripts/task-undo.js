"use strict";

// QuickAdd user script: undoes the newest task or habit action from today.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const ENGINE = "TaskRPG/Scripts/engine.js";
const UTILS = "TaskRPG/Scripts/task-utils.js";

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const settings = engine.parseSettingsNote(await files.read(SETTINGS));
    const previous = (await files.exists(LOG)) ? await files.read(LOG) : "";
    const events = engine.parseEvents(previous);
    const timestamp = engine.localStamp();
    const day = engine.gameDay(timestamp, settings.dayRolloverHour);
    const last = engine
      .recalculate(events, settings)
      .lastActionByDay[day]?.at(-1);
    if (!last) throw new Error("Nothing to undo for today.");

    const target = events.find((event) => event.id === last);
    const out = engine.recordAction(
      events,
      { type: "undo", timestamp },
      settings,
      timestamp,
    );
    const lines =
      out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
    await files.write(
      LOG,
      `${previous.trimEnd()}${previous.trim() ? "\n" : ""}${lines}`,
    );
    committed = true;

    let reopened = false;
    if (target?.type === "task_done" && target.taskId) {
      const path = await findTaskPath(
        files,
        utils,
        await utils.taskFolder(files),
        target.taskId,
      );
      if (path) {
        const text = await files.read(path);
        // TaskNotes owns task status. Undo restores its default open status and
        // clears the completion date, editing only the frontmatter block.
        await files.write(path, utils.reopenTaskNote(text));
        reopened = true;
      }
    }

    new Notice(
      target?.type === "task_done"
        ? reopened
          ? "Undid the last RPG action. TaskNotes status restored to open."
          : "Undid the last RPG action, but no matching task note was found. Check TaskNotes' tasks folder."
        : "Undid the last RPG action. Habit notes are unchanged.",
      8000,
    );
  } catch (error) {
    new Notice(
      `TaskRPG: ${error.message}${committed ? " Undo was saved; do not press again." : " Nothing was changed."}`,
      12000,
    );
  }
};

async function loadModule(files, path) {
  const module = { exports: {} };
  new Function("module", "exports", await files.read(path))(
    module,
    module.exports,
  );
  return module.exports;
}

async function findTaskPath(files, utils, folder, taskId) {
  if (!(await files.exists(folder))) return "";
  const { files: names = [] } = await files.list(folder);
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    if (utils.parseFrontmatter(await files.read(name)).taskId === taskId)
      return name;
  }
  return "";
}
