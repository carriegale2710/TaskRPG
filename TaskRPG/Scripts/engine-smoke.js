// Throwaway Step 1 check: run the engine inside Obsidian (desktop or phone) against a TEST log.
// It never touches the real log. Delete this file when the Step 2 macros exist.
const LOG = "TaskRPG/Engine/Test Events.md";
const STATE = "TaskRPG/Engine/Test State.md";
const SETTINGS = "TaskRPG/Engine/Settings.md";
const ENGINE = "TaskRPG/Scripts/engine.js";

module.exports = async ({ app, quickAddApi }) => {
  const files = app.vault.adapter;
  try {
    const module = { exports: {} };
    new Function("module", "exports", await files.read(ENGINE))(
      module,
      module.exports,
    );
    const E = module.exports;
    const note = E.parseSettingsNote(await files.read(SETTINGS));
    const text = (await files.exists(LOG)) ? await files.read(LOG) : "";
    let events = E.parseEvents(text);

    const choice = await quickAddApi.suggester(
      ["Recalculate", "Log a test habit", "Log a test task", "Undo last"],
      ["recalc", "habit", "task", "undo"],
    );
    if (!choice) return;
    const timestamp = E.localStamp();
    const actions = {
      habit: {
        type: "habit_done",
        timestamp,
        habitId: "test-habit",
        skill: "vitality",
        onTime: true,
      },
      task: {
        type: "task_done",
        timestamp,
        skill: "craft",
        size: "small",
        planned: true,
        ...E.rollDice(),
      },
      undo: { type: "undo", timestamp },
    };

    let summary = "Recalculated.";
    if (choice !== "recalc") {
      const out = E.recordAction(events, actions[choice], note);
      events = out.events;
      await files.write(
        LOG,
        `${text.trimEnd()}${text.trim() ? "\n" : ""}${out.added.map((e) => JSON.stringify(e)).join("\n")}\n`,
      );
      summary =
        Object.entries(out.result)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ") || "Logged.";
    }
    const { state } = E.recalculate(events, note, timestamp);
    await files.write(
      STATE,
      `\`\`\`json\n${JSON.stringify(state, null, 2)}\n\`\`\`\n`,
    );
    new Notice(
      `${summary}\nHP ${state.HP}/${state.maxHP}, MP ${state.MP}/${state.maxMP}`,
      8000,
    );
  } catch (error) {
    new Notice(`TaskRPG engine: ${error.message}`, 12000);
  }
};
