"use strict";

// QuickAdd user script: undoes the newest task or habit action from today.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const HERO = "TaskRPG/Engine/Hero.md";
const ENGINE = "TaskRPG/Scripts/engine.js";
const UTILS = "TaskRPG/Scripts/task-utils.js";

const DUPLICATE_ID_NOTICE =
  "TaskRPG: Duplicate taskId found in task notes, so Undo was not applied. Change taskID to prevent duplicate id, nothing was saved.";

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const settings = engine.parseSettingsNote(await files.read(SETTINGS));
    const previous = await utils.readLog(files, LOG);
    const events = engine.parseEvents(previous);
    const timestamp = engine.localStamp();
    const day = engine.gameDay(timestamp, settings.dayRolloverHour);
    const last = engine
      .recalculate(events, settings)
      .lastActionByDay[day]?.at(-1);
    if (!last) throw new Error("Nothing to undo for today.");

    const target = events.find((event) => event.id === last);

    // Reopening a task needs exactly one note. Look it up before anything is
    // saved so a duplicate taskId leaves the log, notes and Hero untouched.
    let taskNote = null;
    if (target?.type === "task_done" && target.taskId) {
      taskNote = await utils.findTaskNote(
        files,
        await utils.taskFolder(files),
        target.taskId,
      );
      if (taskNote.status === "ambiguous") {
        new Notice(DUPLICATE_ID_NOTICE, 12000);
        return;
      }
    }

    const out = engine.recordAction(
      events,
      { type: "undo", timestamp },
      settings,
      timestamp,
    );
    await utils.appendEvents(files, LOG, previous, out.added);
    committed = true;
    const state = engine.recalculate(out.events, settings, timestamp).state;

    let reopened = false;
    if (taskNote?.path) {
      const text = await files.read(taskNote.path);
      // TaskNotes owns task status. Undo restores its default open status and
      // clears the completion date, editing only the frontmatter block.
      await files.write(taskNote.path, utils.reopenTaskNote(text));
      reopened = true;
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
        ? taskUndoNotice(taskNote, reopened)
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

function taskUndoNotice(taskNote, reopened) {
  if (reopened)
    return "Undid the last RPG action. TaskNotes status restored to open.";
  if (taskNote?.status === "folder_missing")
    return "Undo saved, but the TaskNotes tasks folder was not found. Check TaskNotes' tasks folder.";
  if (taskNote)
    return "Undo saved, but the task note was not found. Fix the note by hand.";
  return "Undo saved, but this event has no taskId, so no task note was updated. Fix the note by hand.";
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
