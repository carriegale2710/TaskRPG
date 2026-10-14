# TaskRPG Agent Instructions

## Source of truth

- Follow [PRD.md](./PRD.md) for product behavior and implementation scope.
- The PRD's **Settled decisions** are requirements. **Leaning** items are not final; **Build defaults** are starting values, not immutable rules. Success metrics are aspirational, and items marked Later, Should-have or Future versions are not v1 requirements.
- If these instructions and the PRD conflict, follow the PRD. Keep this file focused on working rules rather than duplicating the full specification.
- Preserve existing behavior unless the PRD explicitly changes it. Make small, testable changes and verify the affected behavior.

## Session skills

Load both skills below at the start of every coding session, before the first code change or implementation plan. They live in `.agents/skills/`; load them by ID with the skill tool. If a skill cannot be loaded, say so rather than continuing silently without it.

1. **`ponytail`** — pragmatic, minimalist engineering. Reuse over rebuild, root cause over symptom, no speculative scaffolding. It governs *how much* gets built, not what must be proven.
2. **`caveman`** — compressed communication. Default level `full`; `/caveman lite|full|ultra|off` changes it mid-session.

**A coding session** is any session that reads, writes, reviews or plans engine, script, macro, test or configuration code. It is **not** a coding session when the work is story, canon, character voice, narration, journal content, PRD or prose drafting, hand-made settings or vault-data edits, or pure research and Q&A. Do not load either skill for that work, and drop `caveman` if a coding session turns into it.

Where these skills pull against the rules in this file, this file wins:

- **Compression never overrides the reporting rules here.** The `tdd` skill's *Report* step, the proven-versus-assumed distinction, failing-run output and the "state options clearly" contract in *Assumptions and risky decisions* stay in plain prose. The `caveman` skill's own Auto-Clarity rules already exempt security warnings, irreversible actions and multi-step sequences where compression risks misreading; treat a test-evidence report or a decision request as the same case.
- **Everything written to the vault or the repo stays normal prose.** Code, comments, commit messages, `CHANGELOG.md` entries and documentation are never written in caveman style — the `caveman` skill requires this too.
- **"Confirm before implementing" beats ponytail's "ship the lazy version and question it in the same response".** Cut unrequested scope freely, then ask; do not ship a design decision the docs do not settle.
- **Ponytail does not license skipping proof.** Tests, doc sync and changelog updates stay required exactly as described in *Build and test* and *Test-driven development* below.

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
- Engine and script tests live beside the code as `Scripts/*.test.js` and use Node's built-in test runner with no dependencies. Add to the matching file, or add a new `*.test.js` for a new module.
- Run one file at a time: `node --test Scripts/engine.test.js`. On Node 22, passing a directory fails with "Cannot find module".
- Add a new test file to the command lists in `TESTING.md`, and a row for a new rule to its rule-to-test table, so the acceptance criteria stay in one place.
- The rules that need a boundary test here are the edges: success at 9 versus 8, the level 5 and 10 MP discount, the minimum cost of 1, the HP cap of 2 lost per day, the empty log, the invalid setting, and the 4:00 AM day boundary.
- `Scripts/engine-smoke.js` and the throwaway test log (`Engine/Test Events.md`) exist for first integration checks and manual tests. Never point one at the live log or an important real task.

## Test-driven development

Default to test-driven development for anything with engine behavior: write the check first, watch it fail for the right reason, then make it pass. **Load the `tdd` skill before the first test or engine change in a coding session.** It holds the loop, the commit guidance, what makes a test worth keeping, the failing-test policy, and the manual-check substitute for work that cannot be unit tested. `TESTING.md` is this project's how-to: the practical order of operations, the run commands, the rule-to-test table and the manual checks.

These hold whether or not the skill is loaded:

- **Never weaken a test to get a pass.** No deleting, skipping, loosening or inverting assertions, and no editing or widening the expected value to end a red run. If the expectation is genuinely wrong, say what is wrong and why before changing it.
- **A commit holding failing tests must say so** in its message and its `CHANGELOG.md` line. Never let a commit message claim behaviour that does not exist.
- **Failing tests are the to-do list on a branch; `main` is the hard line.** A PR to `main` does not merge with failing tests for the feature it delivers. Move unfinished ones to the backlog with the reason recorded.
- **Report honestly what is proven.** "Automated test passes", "verified inside Obsidian" and "assumed" are different claims. Do not let a green unit test stand in as proof of plugin, mobile or vault integration.
- **Bug reports get a failing regression test first** when the behaviour is reachable from the engine.
- Where the `tdd` skill and this file disagree, this file wins and the skill is corrected.

Not for prose, story, canon, documentation or hand-made settings edits — nothing to assert; get the docs in sync instead.

## Documentation, changelog and doc drift

- **Update on every commit.** Every time you make a commit, update `CHANGELOG.md` to record what changed, why, files affected, and any behavioral or breaking changes. Follow the existing Keep a Changelog style. A commit that adds tests for a feature that is not built yet says so in its changelog line; do not claim behaviour that does not exist.
- **Keep docs in sync.** Update any other relevant documentation files affected by the change (`README.md`, `PRD.md`, `BUILD_PROMPT.md`, `AGENTS.md`, `TESTING.md`, `STEP*.md`, `PLUGINS.md`, etc.). Remove or correct outdated claims rather than leaving contradictory information.
- **Document decisions and limitations.** If you change a documented rule, behavior, architecture, public API, or plugin mapping, explicitly record it in docs. Note known limitations, validation status, and any follow-ups.
- **No silent drift.** If you're unsure whether a doc needs updating, update it or call it out in the commit/PR notes.

## Safety and care

- Ask before deleting or moving many files, pruning records, or making broad vault restructures.
- Do not delete or rewrite event history to correct an action; use the engine's undo/correction mechanism.
- Never expose API keys or credentials. Do not imply that any vault content is private from an AI provider.

## Assumptions and risky decisions

- **Confirm before implementing.** If you need to make any risky assumption or design/implementation decision that is not already answered by the repo's documentation (PRD, AGENTS, README, TESTING, etc.) or inline comments, stop and confirm with the user before implementing.
- **State options clearly.** When asking, include context, the assumption/decision, alternatives considered, tradeoffs, and your recommended approach.
- **Don't guess silently.** If the documentation is ambiguous or missing, ask rather than inventing behavior. Preserve existing behavior unless the PRD explicitly changes it.
- **Verify untested integrations.** Treat untested plugin behavior (QuickAdd, Meta Bind, TaskNotes, Vault Operator, Dice Roller, Templater) as assumptions to verify, not guarantees.
