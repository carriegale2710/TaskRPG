// QuickAdd user script: run while an TaskRPG/Engine/Habits/ note is active.
const LOG = "TaskRPG/Engine/Events.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const HERO = "TaskRPG/Engine/Hero.md";
const ENGINE = "TaskRPG/Scripts/engine.js";

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
    const habitText = await files.read(file.path);
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(habitText)?.[1];
    const field = (name) =>
      new RegExp(`^${name}:\\s*([^\\r\\n]+)`, "m")
        .exec(frontmatter || "")?.[1]
        ?.trim();
    const habitId = field("habitId");
    const skill = field("skill");
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
    const m = { exports: {} };
    new Function("module", "exports", await files.read(ENGINE))(m, m.exports);
    const E = m.exports;
    const settings = E.parseSettingsNote(await files.read(SETTINGS));
    const previous = (await files.exists(LOG)) ? await files.read(LOG) : "";
    const events = E.parseEvents(previous);
    const timestamp = E.localStamp();
    const action = {
      id: `habit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: "habit_done",
      timestamp,
      habitId,
      skill,
      onTime,
    };
    const out = E.recordAction(events, action, settings, timestamp);
    const state = E.recalculate(out.events, settings, timestamp).state;
    const lines = out.added.map((e) => JSON.stringify(e)).join("\n") + "\n";
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
    const xp = Object.entries(state.skillXP)
      .map(([name, value]) => `xp_${name}: ${value}`)
      .join("\n");
    await files.write(
      HERO,
      `---\ntype: hero-state\nhp: ${state.HP}\nmaxHP: ${state.maxHP}\nmp: ${state.MP}\nmaxMP: ${state.maxMP}\n${xp}\n---\n# Hero state\n\nDerived from [[Events]]; do not edit these numbers by hand.\n\nHP: \`VIEW[{hp}][text]\` / \`VIEW[{maxHP}][text]\`  \nMP: \`VIEW[{mp}][text]\` / \`VIEW[{maxMP}][text]\`\n\n## Skill XP\n\n${Object.keys(
        state.skillXP,
      )
        .map((name) => `- ${name}: \`VIEW[{xp_${name}}][text]\``)
        .join("\n")}\n`,
    );
    new Notice(status, 8000);
  } catch (error) {
    new Notice(
      `TaskRPG: ${error.message}${committed ? " Event was saved; do not press again. Repair the habit note and hero state from the event log." : " Nothing was logged."}`,
      12000,
    );
  }
};
