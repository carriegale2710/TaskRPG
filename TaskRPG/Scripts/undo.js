"use strict";

// QuickAdd user script: undoes the newest task or habit action from today.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const HERO = "TaskRPG/Engine/Hero.md";
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
    const state = engine.recalculate(out.events, settings, timestamp).state;

    let reopened = false;
    let taskLookup = "not_checked";
    if (target?.type === "task_done" && target.taskId) {
      const taskPath = await findTaskPath(
        files,
        utils,
        await utils.taskFolder(files),
        target.taskId,
      );
      taskLookup = taskPath.status;
      if (taskPath.path) {
        const text = await files.read(taskPath.path);
        // TaskNotes owns task status. Undo restores its default open status and
        // clears the completion date, editing only the frontmatter block.
        await files.write(taskPath.path, utils.reopenTaskNote(text));
        reopened = true;
      }
    }

    let habitRemoved = false;
    if (target?.type === "habit_done" && target.habitId) {
      const path = await findHabitPath(files, utils, target.habitId);
      if (path) {
        const text = await files.read(path);
        const next = utils.removeHabitLogLine(text, target.timestamp);
        habitRemoved = next !== text;
        if (habitRemoved) await files.write(path, next);
      }
    }

    await files.write(HERO, utils.renderHero(state));

    new Notice(
      target?.type === "task_done"
        ? reopened
          ? "Undid the last RPG action. TaskNotes status restored to open."
          : taskLookup === "ambiguous"
            ? "Undo saved, but multiple task notes share this taskId. Fix the note by hand."
            : "Undo saved, but the task note was not found. Fix the note by hand."
        : target?.type === "habit_done"
          ? habitRemoved
            ? "Undid the last RPG action. Habit history line removed."
            : "Undid the last RPG action, but no matching habit note or history line was found."
          : "Undid the last RPG action.",
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
  if (!(await files.exists(folder))) return { status: "folder_missing", path: "" };
  const { files: names = [] } = await files.list(folder);
  const matches = [];
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    if (utils.parseFrontmatter(await files.read(name)).taskId === taskId)
      matches.push(name);
  }
  if (matches.length === 1) return { status: "found", path: matches[0] };
  if (matches.length > 1) return { status: "ambiguous", path: "" };
  return { status: "not_found", path: "" };
}

async function findHabitPath(files, utils, habitId) {
  const folder = "TaskRPG/Engine/Habits";
  if (!(await files.exists(folder))) return "";
  const { files: names = [] } = await files.list(folder);
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    if (utils.parseFrontmatter(await files.read(name)).habitId === habitId)
      return name;
  }
  return "";
}
