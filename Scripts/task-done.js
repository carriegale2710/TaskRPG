"use strict";

// QuickAdd user script: resolves the active TaskNotes task through the TaskRPG engine.
const LOG = "Engine/Events.md";
const SETTINGS = "Engine/Settings.md";
const ENGINE = "Scripts/engine.js";
const UTILS = "Scripts/task-utils.js";

module.exports = async ({ app }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const file = app.workspace.getActiveFile();
    if (!file || !/^TaskNotes\/[^/]+\.md$/.test(file.path)) {
      throw new Error("Open a TaskNotes task before pressing Done.");
    }

    const original = await files.read(file.path);
    const task = utils.parseFrontmatter(original);
    if (task.type !== "task" || !task.taskId)
      throw new Error("This note is not a TaskRPG task.");

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
    const planned = scheduled === utils.today();

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
    const tableResult = utils.pickTableResult(result.outcome, dice.lootRoll);
    const lines =
      out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
    await files.write(
      LOG,
      `${previous.trimEnd()}${previous.trim() ? "\n" : ""}${lines}`,
    );
    committed = true;

    // Preserve the TaskNotes-owned status. Record only TaskRPG resolution metadata.
    await files.write(
      file.path,
      utils.updateTaskStatus(original, {
        status: task.status || "",
        completedDate: timestamp,
      }),
    );

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

    await showResultCard(app, card, `Task complete: ${result.outcome}`);
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

async function showResultCard(app, markdown, title) {
  try {
    const { Modal } = obsidian;
    const modal = new Modal(app);
    modal.contentEl.createEl("h2", { text: title });
    const pre = modal.contentEl.createEl("pre");
    pre.setText(markdown);
    const button = modal.contentEl.createEl("button", { text: "Dismiss" });
    button.onclick = () => modal.close();
    modal.open();
  } catch {
    new Notice(`Task complete.\n\n${markdown}`, 15000);
  }
}
