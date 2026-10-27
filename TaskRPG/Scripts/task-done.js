"use strict";

// QuickAdd user script: resolves the active TaskNotes task through the TaskRPG engine.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const HERO = "TaskRPG/Engine/Hero.md";
const ENGINE = "TaskRPG/Scripts/engine.js";
const UTILS = "TaskRPG/Scripts/task-utils.js";

// Frontmatter values arrive as text: `taskId:` reads as "", `taskId: null` and
// `taskId: ~` read as the literal words. All of them mean "no ID".
function missing(value) {
  const text = String(value ?? "").trim();
  return text === "" || text === "null" || text === "~" || text === "undefined";
}

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const folder = await utils.taskFolder(files);
    const tag = await utils.taskTag(files);
    const file = app.workspace.getActiveFile();
    if (!file || !file.path.startsWith(`${folder}/`)) {
      throw new Error("Open a TaskNotes task before pressing Done.");
    }

    const original = await files.read(file.path);
    const task = utils.parseFrontmatter(original);
    // TaskNotes identifies tasks by tag; there is no `type` field to check.
    if (!utils.hasTag(task.tags, tag) || missing(task.taskId))
      throw new Error("This note is not a task.");

    const settings = engine.parseSettingsNote(await files.read(SETTINGS));
    if (!settings.skills.includes(task.skill))
      throw new Error(`Unknown skill: ${task.skill}`);
    if (!settings.taskSizes[task.size])
      throw new Error(`Unknown size: ${task.size}`);

    const previous = (await files.exists(LOG)) ? await files.read(LOG) : "";
    const events = engine.parseEvents(previous);

    // TaskNotes completion and RPG resolution are separate. Prevent duplicate
    // RPG resolution by following undo corrections through targetEventId.
    if (utils.hasUnresolvedTaskDone(events, task.taskId)) {
      throw new Error(
        "This task has already been resolved by TaskRPG. Use Undo last first.",
      );
    }

    const timestamp = engine.localStamp();
    const dice = engine.rollDice();
    const scheduled = utils.scheduled(task);
    const planned = utils.isPlannedToday(
      scheduled,
      engine.gameDay(timestamp, settings.dayRolloverHour),
    );

    const action = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "task_done",
      timestamp,
      taskId: task.taskId,
      skill: task.skill,
      size: task.size,
      planned,
      important: utils.hasTag(task.tags, "important"),
      urgent: utils.hasTag(task.tags, "urgent"),
      ...dice,
    };

    const out = engine.recordAction(events, action, settings, timestamp);
    const result = out.result;
    const state = engine.recalculate(out.events, settings, timestamp).state;
    const tableResult = utils.pickTableResult(result.outcome, dice.lootRoll);
    const lines =
      out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
    await files.write(
      LOG,
      `${previous.trimEnd()}${previous.trim() ? "\n" : ""}${lines}`,
    );
    committed = true;

    // TaskNotes detects the written status value directly, so Task done owns the
    // completion status: always write `done`, whatever the note held before.
    await files.write(
      file.path,
      utils.updateTaskStatus(original, {
        status: "done",
        completedDate: timestamp,
      }),
    );

    await files.write(HERO, utils.renderHero(state));

    const card = utils.formatResultCard({
      name: task.name || file.basename,
      roll: dice.roll,
      total: result.total,
      outcome: result.outcome,
      tableResult,
      xp: result.xp,
      mpCost: result.mpCost,
      mp: result.mp,
      loot: result.loot,
      overdraft: result.overdraft,
    });

    new Notice(`Task complete: ${result.outcome}\n\n${card}`, 15000);
  } catch (error) {
    new Notice(
      `TaskRPG: ${error.message}${committed ? " Event was saved; do not press Done again. Repair the task note from the event log." : " Nothing was logged."}`,
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
