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
- **TaskNotes owns task creation, planning, statuses, and the task user fields (skill, size, urgent and important). TaskRPG owns only task resolution (`Task done`) and undo.**
- `Task done` reads the open TaskNotes task and its scheduled date, rolls through the engine, appends to `Engine/Events.md`, applies XP and MP, shows the result, and updates only resolution-related completion fields.
- `Undo last` appends a correcting engine event; it never deletes history or enables a re-roll.
- TaskNotes Workflows may later invoke `/task-done` automatically on an In Progress → Done change. Treat that as optional phase 2 and do not assume it is implemented.
- Vault Operator agents are for narration and character conversations, not building or testing code. They may write only to their designated Story, Campaigns, World and Characters areas, with approval where required. They must not write Engine-owned state, task records or user-authored journal content. These boundaries protect data integrity, not privacy.
- Engine files (event log, derived hero state and habit records) are written by macros. The hero profile contains stable identity only. Journal notes are the user's journal plus the generated "Today's turns" view.
- Shared hero progression belongs to the player and applies across campaigns. Each campaign keeps separate arcs, quests and story history; shared-world canon is updated only with approval.
- Treat every vault file as potentially model-visible. Provide an agent only the context needed for its task, but do not store content in the vault that you would not consent to sending to the configured model provider. No file or folder is private by guarantee.

## Game behavior

- MP is an in-game budget capped at 10 and refilled each morning. Planning, task and habit costs, XP, HP, dice, skills, projects, rewards and recovery follow the PRD; do not infer new mechanics or change formulas casually.
- A task Done action rolls using the engine and shows an immediate result from the random tables. The next morning briefing narrates the day's results and recaps prior events; do not require a separate story beat after every task.
- Habit Done actions show their short status feedback and do not generate a dice roll or story beat.
- The event log, story log, hero state, habit notes and character memory are the durable records. Daily notes are a journal view with "Today's turns", not the game-state source of truth; only daily notes are pruned, after backup.
- Maintain continuity from the shared world canon, the selected campaign's story log and relevant character memory. Do not mix campaign histories, invent conflicting canon or advance unrelated/new plot threads without the user's direction.
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
- Never expose API keys or credentials. Do not imply that any vault content is private from an AI provider.
