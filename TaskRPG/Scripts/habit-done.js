// QuickAdd user script: run while an TaskRPG/Engine/Habits/ note is active.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const HERO = "TaskRPG/Engine/Hero.md";
const ENGINE = "TaskRPG/Scripts/engine.js";
const UTILS = "TaskRPG/Scripts/task-utils.js";

module.exports = async ({ app, quickAddApi }) => {
  const files = app.vault.adapter;
  let committed = false;
  try {
    const file = app.workspace.getActiveFile();
    if (!file || !/^TaskRPG\/Engine\/Habits\/[^/]+\.md$/.test(file.path)) {
      throw new Error(
        "Open a note in TaskRPG/Engine/Habits/ before pressing Done.",
      );
    }
    const utils = await loadModule(files, UTILS);
    const engine = await loadModule(files, ENGINE);
    const habitText = await files.read(file.path);
    const { habitId, skill } = utils.parseFrontmatter(habitText);
    if (!habitId || !skill || !/^[a-z0-9-]+$/.test(habitId)) {
      throw new Error(
        "Habit note needs habitId (lowercase letters, digits, hyphens) and skill in frontmatter.",
      );
    }
    const onTime = await quickAddApi.suggester(
      ["Within my habit block", "After my habit block"],
      [true, false],
    );
    if (onTime !== true && onTime !== false) return;
    const settings = engine.parseSettingsNote(await files.read(SETTINGS));
    const previous = (await files.exists(LOG)) ? await files.read(LOG) : "";
    const events = engine.parseEvents(previous);
    const timestamp = engine.localStamp();
    const action = {
      id: `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "habit_done",
      timestamp,
      habitId,
      skill,
      onTime,
    };
    const out = engine.recordAction(events, action, settings, timestamp);
    const state = engine.recalculate(out.events, settings, timestamp).state;
    const lines =
      out.added.map((event) => JSON.stringify(event)).join("\n") + "\n";
    await files.write(
      LOG,
      `${previous.trimEnd()}${previous.trim() ? "\n" : ""}${lines}`,
    );
    committed = true;
    const label = file.basename;
    const status = `${label} complete! +${out.result.hp} HP, +${out.result.xp} XP, -${out.result.mpCost} MP (MP ${state.MP}/${state.maxMP})`;
    await files.write(
      file.path,
      `${habitText.trimEnd()}\n- ${timestamp} | ${onTime ? "on time" : "late"} | ${status}\n`,
    );
    await files.write(HERO, utils.renderHero(state));
    new Notice(status, 8000);
  } catch (error) {
    new Notice(
      `TaskRPG: ${error.message}${committed ? " Event was saved; do not press again. Repair the habit note and hero state from the event log." : " Nothing was logged."}`,
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
