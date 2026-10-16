# Changelog

All notable changes to project documented here. Format follows Keep a Changelog. Version numbers follow build brief steps: `0.1.0` = Step 1 (engine/tests), `0.1.1` = Step 2 (habit Done button). Nothing tagged yet; `0.1.1` lives on `issue-2-habit-button` branch.

## [UNRELEASED] - Step 3 (issue #3, draft PR #10)

### Step 3 redesign

#### Decisions

- TaskNotes owns task creation, planning, statuses, and task user fields (`skill`, `size`, `urgent`, `important`).
- TaskRPG owns only task resolution and undo. `Task done` resolves open TaskNotes task through engine;
- `Undo last` appends correcting engine event. `completedDate` ownership still unverified.

#### Added

- TaskNotes scheduled-date helper in `task-utils.js`, used by resolution and undo.
- Tests: TaskNotes frontmatter parsing, scheduled-date mapping, outcome-table selection, result-card formatting, completion-field updates (`task-utils.test.js`).
- Tests: shared duplicate-resolution guard, `targetEventId` undo linkage, repeat resolution after undo, preserved original `task_done` event (`task-undo-resolution.test.js`).

#### Changed

- `Task done` reads scheduled date for planned-day MP rule. Today-scheduled task avoids unplanned MP surcharge.
- `Undo last` appends correcting RPG event, clears `completedDate` on matching task note, preserves status.
- `hasUnresolvedTaskDone` moved to `task-utils.js`, used by `task-done.js`; follows `undo.targetEventId` to original `task_done`.
- Post-valid-undo allows later `Task done`; engine marks repeat.
- TaskNotes Workflows may later auto-invoke `/task-done` on In Progress → Done. Phase 2 optional, unbuilt/unverified.
- Docs updated: `STEP3.md`, `TESTING.md`, `README.md` for corrected undo flow and expanded test command.
- Scripts/tests Derive urgency/importance from TaskNotes tags.

#### Fixed

- Scheduled date property uses `scheduled`, not `scheduledDate`.
- Duplicate-resolution guard follows `undo.targetEventId`, allowing re-resolution after valid undo.
- Removed `task-done.js` rejection of TaskNotes done/completed statuses. Implemented, not integration-tested.
- Preserved completedDate ownership, status/frontmatter; no rewrite of plugin-owned completion data.

#### Removed

- `new-task.js` and `New task` QuickAdd flow.
- `plan-task.js` and `Plan task` QuickAdd flow.
- Task-note creation, slug generation, size-suggestion helpers from `task-utils.js`.
- Hard-coded planned/backlog restoration from `undo-last.js`. Implemented, not integration-tested.

#### Pending

- `completedDate` ownership verification pending.

#### Known issues and validation limitations

- Duplicate guard follows `undo.targetEventId`; end-to-end pending.
- Status restoration: commit `60d00b9` preserves status, rewrites status line, clears completedDate. Field preservation needs testing.
- Tests pass: `node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js Scripts/task-undo-resolution.test.js`.
- TaskNotes field mapping unverified for installed version.
- Desktop Obsidian unverified (`Task done`, result modal, event log, task updates).
- Mobile result card unverified.
- `Hero.md` not rewritten by Task Done/Undo.
- Habit undo doesn't remove habit-note history.
- Result modal QuickAdd `obsidian.Modal` untested; Notice fallback.
- Undo/releases guard via `targetEventId`; no-reroll policy unchanged; valid undo then Task done is fresh repeat-marked resolution. Do not use undo to seek better roll.
- Outcome table uses loot die, not separate table draw.
- Automatic Workflows trigger not built (Phase 2 only).
- Step 2 event-log/Hero repair gap and engine CLI default to `Engine/Events.jsonl` remain.

#### Documentation consistency

- `STEP3.md`: updated for preserved status, targetEventId guard, repeat resolution, test command, urgent/important-as-tags decided but unbuilt.
- `CHANGELOG.md`: records guard fix, regression tests, shared helper, doc sync, tag decision, validation gaps.
- Still to sync: `PLUGINS.md` line 112, `TESTING.md` line 7, `BUILD_PROMPT.md` lines 84/86, `PRD.md` still describe urgent/important as TaskNotes user fields.
- `TESTING.md`: passing tests recorded, `task-undo-resolution.test.js` added, Obsidian validation gate retained.
- `README.md`: distinguishes RPG undo from reopening TaskNotes task; documents targetEventId and repeat resolution; integration unverified.
- `PLUGINS.md`: consistent. Task creation/planning/statuses/fields to TaskNotes, resolution/undo to TaskRPG.
- `AGENTS.md`: consistent. Ownership split correct.
- `BUILD_PROMPT.md`: updated. Undo preserves status and clears completion metadata; regression-test bullet added.
- `PRD.md`: compare uploaded revised draft before replacing spec.

---

## [0.1.3] - 2026-10-16

### Agent setup + Documentation skills

Process/docs only; no engine/rule/runtime behavior changed.

#### Decisions

- Code documentation skills can now use caveman-style prose to cut verbosity.
- Use `/tdd` and `/ponytail` skills for each coding session from now on to improve outputs.

#### Added

- TDD rules in `AGENTS.md`: test-first default, no vanity tests, failing tests as to-do, never weaken test, layout/commands/checks. Matching ground rule in `BUILD_PROMPT.md`; pointer and order in `TESTING.md`.
- Session skills in `AGENTS.md`: load `ponytail` (minimal engineering) and `caveman` (compressed comms) at start of coding sessions; skip for story/canon/prose/settings/research. Compression never overrides TDD reporting, doc sync, confirm-before-implementing.
- `tdd` skill at `.agents/skills/tdd/SKILL.md`.
- Commit hygiene in `AGENTS.md`/`BUILD_PROMPT.md`: changelog-at-commit, doc sync, confirm risky assumptions/design decisions.
- Made new `/update-changelog` skill with reference guide doc to run on each commit.
- Added new user flow diagram section to PRD. Has only habit done flow for now.

#### Changed

- `AGENTS.md` TDD section cut ~89 lines/1,824 words to short section; file ~3,340 → ~1,980 words.
- Docs point at skill; `TESTING.md` and `BUILD_PROMPT.md` drop removed heading reference; caveman precedence names skill Report step.

#### Pending

- Add user flow diagram to PRD for each QuickAdd script or feature.

---

## [0.1.2] - 2026-10-16

Minor repo restructuring. All tests passing.

### Added

- `docs` folder for project documentation.
- `TaskRPG` folder for game-related content (story, characters, events).

### Removed

- `.gitignore` ignores local dev files (`.agents/`, `./claude`, `todo.md`).

---

## [0.1.1] - 2026-10-14

### Added - Step 2: habit Done button

- Habit Done macro (`Scripts/habit-done.js`): QuickAdd user script behind `TaskRPG: Habit Done`. Runs only while note in `Engine/Habits/` open; else notice naming folder. Reads habit frontmatter (`habitId`, lowercase letters/digits/hyphens; `skill`). Suggester asks within habit block vs after; sets `onTime` true/false. Cancelling writes nothing. Loads `Scripts/engine.js` by read/eval, no require, phone-capable. Write order: event log, habit History, derived hero state. Notice 8s (12s on failure) in PRD 4.8 format. No dice roll or story beat; event has no `roll`.
- Habit note and button: `Engine/Habits/Morning routine.md` first habit. Frontmatter `type: core-habit`, `habitId: morning-routine`, `skill: vitality`, `block: morning`. Done button is Meta Bind `meta-bind-button` running QuickAdd choice by command ID (copied, never guessed); QuickAdd command is fallback. `## History` holds `timestamp | on time/late | status` lines.
- Hero note and Meta Bind fields: `Engine/Hero.md` derived from log; must not hand-edit. Frontmatter `hp`, `maxHP`, `mp`, `maxMP`, `xp_<skill>` for five skills. Body shows Meta Bind inline fields. Stable identity stays in `Campaign/00 Hero.md`.
- Live event log is note: `Engine/Events.md` (Markdown, one JSON object per line). Step 1 left extension open; `.jsonl` hidden in Obsidian file list, so `.md` wins. Engine skips blank lines and `#`/code-fence lines.
- Tests (`Scripts/habit-done.test.js`): two tests with fake vault and stub Notice:
- On-time and late press each append `settings_changed` then `habit_done`, add `| on time |`/`| late |` to History, update `xp_vitality`, notice contains `+1 XP`. No `roll` field.
- Cancelling suggester or no habit open writes no event.

### Changed

- Live log now `Engine/Events.md` instead of `Engine/Events.jsonl`; holds real presses.
- `Engine/State.json` still output of `node Scripts/engine.js recalc`, but panels no longer read it; macro writes hero note directly. Unchanged since Step 2.
- Test count 45 (43 engine, 2 habit), up from 43.

### Quality checks

- `node --test Scripts/engine.test.js Scripts/habit-done.test.js`: 45 pass, 0 fail (Node 22.14.0, 2026-10-14).
- Coverage `--experimental-test-coverage`:
  - `engine.js`: 100% lines, 96.3% branches, 100% functions.
  - `habit-done.js`: 95.7% lines, 81.5% branches, 100% functions. Uncovered lines 21-22 are invalid-frontmatter error.

### Known issues

- No in-vault repair path. If display write fails after log saved, repair from log; nothing rewrites Hero. CLI default still `Engine/Events.jsonl` (not live `Engine/Events.md`) and writes `Engine/State.json`, panels no longer read. PRD recalculate button not built.
- Missed habit blocks not back-filled in vault. Engine has `backfillMissedDeadlines` + tests, but no macro calls it. Closed block leaves no `missed_deadline`/HP loss. Block times undefined (`block: morning`, no deadline).
- Each press rewrites whole log note (vault adapter no append), sync conflict mid-press can lose lines. One-writer rule guards.
- Meta Bind button hard-codes QuickAdd choice command ID. Fit doesn't sync plugin settings by default; choice/ID must exist on phone.
- Carried from `0.1.0`: event dated before first `settings_changed` gets today's rules. `engine.js` unchanged, bug and missing regression test remain.

### Open questions

1. Repeat presses of one habit/day: engine allows, each costs MP/earns 1 XP. Decide whether button stops after first on-time press or asks if separate block.
2. Habit deadline times: needs timestamp per block. Decide frontmatter vs settings note.

### Also on this branch (not Step 2)

- `gm_bridge.py` moved to `Scripts/gm_bridge.py` via `git mv`. `README.md` usage/table updated.

---

## [0.1.0] - 2026-10-14

### Added - Step 1: engine and tests

Engine (`Scripts/engine.js`): dependency-free game engine, no Obsidian. Takes event log + settings note, returns state and action result. Loads without `fs`, `path`, `require`; phone-capable. `node Scripts/engine.js recalc` rebuilds state, deterministic repeat runs. Bad usage exits code 1, stderr.

Game features:

- Time: day rolls over 4:00 AM.
- MP: max 10, refill each morning. Task cost by size small 1/medium 3/large 5. Surcharge +1 unplanned, +1 per task while Wounded. Discounts -1 at skill levels 5 and 10 in that skill. Never below 1. Overdraft if cost > remaining MP halves XP (round up) and adds -1 Tired penalty; HP unaffected. Habit cost by on-time share last 30 eligible days: under 1/3 = 2 MP, 1/3 to under 2/3 = 1 MP, 2/3+ = 0 MP. New habit starts 2 MP. Eligible days are weekdays not rest/pause; weekend/rest/pause counts only if habit done.
- XP/levels: task XP size plus 50% important, 50% urgent, 25% weekly focus project; bonuses stack, round up. Habit XP 1 per press even at 0 MP. Five skills, 10 levels. XP thresholds placeholder in settings (level 2 at 10 through level 10 at 320). Dice bonus +1 at levels 2,4,6,8,10.
- Roll: 2d6 + skill dice bonus - HP penalty - Tired penalty. Success 9+, partial 6-8, setback <=5. Project threat +1 per finished arc, cap +4, raises thresholds. Tasks outside project T=0. Success has 1/3 loot chance (die 5/6 drops); engine flags drop, narrator names later. Roll never changes task XP/MP.
- HP: max 10. On-time core habit restores 1. Late press earns XP, no HP, not on-time day. Missed block deadline costs 1 HP, cap 2/day. Rest/pause/weekends exempt. Dice penalty: 7-10 HP = 0, 4-6 = -1, 1-3 = -2, 0 = -3. At 0 HP Wounded: tasks +1 MP, boss blocked. Missed blocks back-filled when vault opens.
- Rest/pause: rest day one-day pass, 4/month, no HP loss/no plan. Pause freezes game, no HP loss; paused days excluded from habit measure.
- Settings changes: each logged with recorded time; engine uses rules in force each day, never rewrites past. Editing note without recording action doesn't change past.
- Undo: adds correcting log line; nothing deleted. Only newest task/habit action same game day, can't reroll. Pressing Done after undo gets fresh roll, flagged `repeat`.
- Event log: shared append-only JSON Lines, one line/action with date/time/type/skill/size/roll/outcome/XP/MP. Events replay timestamp order, back-filled missed deadline appended not inserted.
- Settings note: `EngineSettings.md` holds tunable numbers in JSON block. Engine rejects out-of-range values and names wrong setting.
- State file: `EngineState.json` written by recalc. Saved copy later hero note/Meta Bind panels read.

Tests (`Scripts/engine.test.js`): one test per rule plus settings changes, undo, day boundary, backfill, terminal run. Validation tests for taskSizes, lootDropRolls, hpPenalties, habitTiers. Table-driven invalid actions test. Bad usage exit code 1/stderr test. Live Settings.md validity test.
