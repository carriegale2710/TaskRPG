# TaskRPG Agent Instructions

## Source of truth

- Follow [PRD.md](./PRD.md) for product behavior and implementation scope.
- The PRD's **Settled decisions** are requirements. **Leaning** items are not final; **Build defaults** are starting values, not immutable rules. Success metrics are aspirational, and items marked Later, Should-have or Future versions are not v1 requirements.
- If these instructions and the PRD conflict, follow the PRD. Keep this file focused on working rules rather than duplicating the full specification.
- Preserve existing behavior unless the PRD explicitly changes it. Make small, testable changes and verify the affected behavior.

## Product principles

- Build an immersive, character-driven RPG layer that makes real tasks and habits rewarding through novelty and visible progression.
- Keep randomness real: dice and engine-owned tables determine what happens; AI agents narrate it. Do not let AI invent or alter game-state outcomes.
- Stats are game state, not measurements of real-world energy or health. Never bring back capacity-based MP, guilt, death, punishment, or proactive distress check-ins.
- Every task or habit Done action should give its specified immediate feedback. Keep story consequences moving forward; setbacks must not create dead ends.
- Keep characters, preferences and story personal, continuous, kind, and consistent with the user's established world and quiz hard limits.

## Architecture and ownership

- Obsidian is the interface. QuickAdd macros call one plain JavaScript engine with no dependencies; keep game rules in the engine and macros thin.
- The event log is the source of truth. Recalculate derived HP, MP, XP, levels and results from it. Do not silently overwrite or discard history; undo is a correcting event.
- Keep tunable values in the settings note and make rule changes prospective as specified in the PRD. Validate setting ranges and report invalid data clearly.
- Vault Operator agents are for narration and character conversations, not building or testing code. Their permitted write areas are Story and Characters only. They must not write to Engine-owned state, backlog task lines, or the Private folder.
- Engine files (event log, hero state and habit records) are written by macros. Journal notes are the user's journal plus the generated "Today's turns" section. Backlog tasks are managed by the user and TaskNotes. Follow the actual vault layout; these ownership areas need not be literal folder names.
- Treat daily notes and character memory as model-visible. Keep anything the user does not want sent to a model provider in the excluded Private area; never expose secrets or private content in generated outputs.

## Game behavior

- MP is an in-game budget capped at 10 and refilled each morning. Planning, task and habit costs, XP, HP, dice, skills, projects, rewards and recovery follow the PRD; do not infer new mechanics or change formulas casually.
- A task Done action rolls using the engine and shows an immediate result from the random tables. The next morning briefing narrates the day's results and recaps prior events; do not require a separate story beat after every task.
- Habit Done actions show their short status feedback and do not generate a dice roll or story beat.
- The event log, story log, hero state, habit notes and character memory are the durable records. Daily notes are a journal view with "Today's turns", not the game-state source of truth; only daily notes are pruned, after backup.
- Maintain continuity from the shared story log, relevant character memory and the current project/arc. Do not invent conflicting canon or advance unrelated/new plot threads without the user's direction.
- Characters stay in fiction and give advice only when asked. Only the narrator or game system may provide brief real-talk, in the PRD's neutral, kind, no-guilt style.
- A missed day is handled by the PRD's rest, pause, weekend and recovery rules. Never shame the user or create catch-up work as punishment.

## Build and test

- Work in small, end-to-end pieces, following the PRD's build order and thin-slice requirements. Each step should leave something testable and observable.
- Keep engine behavior runnable from the terminal without Obsidian. Add or update automated tests for each engine rule changed, including relevant settings, event replay and undo behavior.
- Test macros and Obsidian/mobile integration at the relevant slice; treat untested plugin behavior as an assumption to verify, not a guaranteed capability.
- Keep changes scoped. Update directly related documentation, preserve readable vault data and formatting, and report validation results and unresolved limitations.

## Safety and care

- Ask before deleting or moving many files, pruning records, or making broad vault restructures.
- Do not delete or rewrite event history to correct an action; use the engine's undo/correction mechanism.
- Never expose API keys, credentials, or content from the Private area.
