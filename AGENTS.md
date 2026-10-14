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

## Test-driven development workflow

Default to test-driven development for anything with engine behavior. The order is the point: write the check first, watch it fail for the right reason, then make it pass. This section is the working rule; `TESTING.md` is the how-to.

TDD earns its place here for three reasons, in order of value:

1. **It writes the acceptance criterion down.** The test is the rule in executable form, so "done" has a definition before any code exists. A rule you cannot state as a test is a rule you have not finished deciding.
2. **It checks the design before you build it.** Writing the test first forces the interface, the data and the edge cases to be chosen early, and surfaces a wrong design while it is still cheap. If the test is awkward to write, that is information about the design, not a reason to skip the test.
3. **It keeps the rule fixed afterwards.** The test catches the later change that quietly breaks something.

Test quality matters far more than commit shape. Failing tests are not a problem to hide: a failing test is the clearest to-do item you can leave yourself.

### The loop

1. **Red.** Write the smallest test that states the rule, bug or requirement. Run it and read the output.
2. **Confirm the failure.** It must fail on the assertion you intended, not on a typo, a wrong path, a missing import or a syntax error. A test that has never failed has not been shown to test anything.
3. **Green.** Write the least code that makes it pass. Do not add behavior the test does not cover.
4. **Reprove.** Confirm the test fails again if the implementation breaks (see "No vanity tests").
5. **Refactor.** With the test green, tidy the code and keep the test green. Do not refactor and change behavior in one step.
6. **Report.** In your reply, state the failing result you saw, the command you ran, and the passing result.

If writing the test exposes an ambiguity, or a design decision the PRD and the rest of the docs do not answer, stop and confirm with the user before implementing rather than baking a guess into the test.

### Tests and commits

Commit shape is not the goal, and history is not the artefact — the tests are. Where it is cheap and honest, land the test as its own `test:` commit before the implementation, then the `feat:`, `fix:` or `refactor:` commit that makes it pass. That ordering removes any doubt about whether a test was shaped to fit finished code. When the split is awkward, commit them together; ceremony serves nobody. Squash the branch before merge if that is your habit.

Two things do still matter:

- **A commit holding failing tests must say so.** If a commit contains tests for a feature that is not built yet, the commit message and the `CHANGELOG.md` line describe the tests as pending. Never let a commit message claim behaviour that does not exist.
- **Do not settle a disagreement by editing the assertion.** If a test is wrong, say what is wrong with it and why, then change it. Reaching for the expected value to end a red run is the failure mode this whole workflow exists to prevent.

### No vanity tests

A test earns its place only if it can fail for the right reason. A suite of tests that would pass against a broken engine is worse than no suite, because it buys false confidence.

- **Assert behaviour, not current output.** Expected values come from the PRD rule or from a worked example you can compute by hand — never from whatever the code happens to print today. Copying actual output into `expected` locks in the bug.
- **Prove the test bites.** Once it passes, break the implementation deliberately: flip the boundary, move a threshold by one, change a constant, return early. Confirm the test fails, then restore the code. A test that survives a broken implementation is a vanity test. Do this for every new rule, every new test file, and any test whose subject you cannot reason about confidently.
- **Name the rule, and keep one behaviour per test.** The name should tell a reader which PRD rule is being protected. `task MP cost` protects a rule; `works correctly` protects nothing.
- **Cover the boundaries, not the middle.** The rules live at the edges: success at 9 versus 8, the level 5 and 10 MP discount, the minimum cost of 1, the HP cap of 2 lost per day, the empty log, the invalid setting, the day boundary at 4:00 AM. A happy-path test alone rarely catches a real regression.
- **Assert the outcome, not the implementation.** Test what the engine returns and logs, not the private helper it happens to call. A test that breaks when you rename an internal function is testing the wrong thing.
- **No tautologies.** Do not assert a value against itself, re-implement the rule inside the test to compute the expectation, or assert a constant the test itself just defined.
- **Keep fixtures independent.** No order dependence, no shared mutable state between tests, no state leaking from one test into the next. Fixed dates and fixed dice, so the result is identical on any machine and time zone.
- **Make failures legible.** A failure should show the rule, the input and the expectation without needing a debugger. Prefer asserting a whole result object or explicit fields over a bare truthiness check.
- **Treat an instantly-passing test with suspicion.** Either it covers behaviour that already works — fine, but say so — or it is not testing what you meant. Work out which before moving on.
- **Coverage is not the target.** Catching a real break is. One boundary test that bites beats ten that assert the code equals itself.

### Failing tests are the to-do list

Unfinished work should be visible in the suite rather than in your head.

- **Failing tests for unbuilt or half-built features are welcome on a feature branch.** They document the acceptance criteria, confirm the intended design, and list what is left. Keep them clear enough that the failure message alone tells you what to build.
- **The one hard line is the merge to `main`.** A PR to `main` does not merge with failing tests for the feature it delivers. Either the tests pass, or the unfinished ones are moved out — into the backlog or an issue — with the reason recorded. Failing tests elsewhere on the branch are fine.
- **Do not silence a red test to make a run green.** Converting a failing test to `skip` or `todo` deletes the reminder and hides the gap. If a test genuinely must stand down (flaky, blocked by an unverified plugin), skip it with a comment naming the reason and the follow-up, and record it in `TESTING.md`. A skipped test with no reason is a deleted test.
- **When you work a red test, satisfy it.** Make the implementation meet the test, or openly record that the expectation was wrong and why. Never quietly rewrite the test to match the code.
- **Keep the list readable from outside the code.** `TESTING.md` and the relevant `STEP*.md` say what is failing, what it is for and what remains. When you add a test for a rule, add its row to the rule-to-test table in `TESTING.md` so the acceptance criteria stay in one place.

### Rules that keep it honest

- **Do not weaken a test to get a pass.** No deleting, skipping, loosening or inverting assertions, and no widening tolerances to match current output. If the expected value is genuinely wrong, say so and why before changing it.
- **A rule change starts with the test.** When the PRD or the user changes a rule, change the test first, then the implementation, and record the change in `CHANGELOG.md`.
- **Read the whole failing run.** Fix the cause, not the symptom. If a change breaks an unrelated test, chase it before moving on.
- **Bugs get a failing regression test first.** Reproduce the reported behaviour as a test that fails, then fix it. Do not fix from a description alone when the behavior is reachable from the engine.
- **Keep tests deterministic.** Fixed dates and fixed dice, following the existing test files, so results are identical on any machine and time zone.
- **Keep tests out of the way of live data.** Tests use frozen settings and fixture logs; they never write to `Engine/Events.md` or other live records.
- **Report honestly what is proven.** Separate "automated test passes" from "verified inside Obsidian" from "assumed". Do not let a green unit test stand in as proof of plugin or mobile behavior.

### Where to put tests and how to run them

- Engine and script tests live beside the code as `Scripts/*.test.js` and use Node's built-in test runner with no dependencies. Add to the matching file, or add a new `*.test.js` for a new module.
- Run one file at a time: `node --test Scripts/engine.test.js`. On Node 22, passing a directory fails with "Cannot find module".
- Add the new file to the command lists in `TESTING.md` so a fresh reader runs the same suite.

### Where TDD cannot reach

QuickAdd, Meta Bind, TaskNotes, Vault Operator, Dice Roller and the phone cannot be unit tested here. The equivalent of a test-first step is still available: write the acceptance criteria down before building, then check against them.

1. Before coding, write the steps, the exact command or button, and the expected notice, log line and file change into `TESTING.md` or the relevant `STEP*.md`. This is the acceptance criterion; it is what makes the slice "done".
2. Build the slice, then run that manual check and record the real result, including the exact error when it fails.
3. Until it is run, describe the integration as unverified. A described manual check is not evidence.
4. Humility applies more here, not less: this is the part you cannot prove with a test, so report it as assumed rather than letting a green unit-test run imply that the integration works.

`Scripts/engine-smoke.js` and the throwaway test log (`Engine/Test Events.md`) exist for this kind of check; never point a first integration test at the live log or an important real task.

### When not to test first

- Prose, story, canon and documentation changes, and settings edits the user makes by hand. Nothing to assert; get the docs in sync instead.
- Exploratory spikes where you genuinely do not know the shape of the answer yet. Spike, throw the spike away, then write the test and the real implementation. Say that you are spiking rather than quietly skipping the test.
- One-line mechanical edits with a directly related existing test that already covers them. No new test is needed; the existing test is the check.

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
