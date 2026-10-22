# Changelog

All notable changes to project documented here. Format follows Keep a Changelog (https://keepachangelog.com/). Invoke `changelog` skill to keep this file up-to-date. This file is change history only: current build status, done/not-done steps, and known gaps live in `docs/BUILD_PLAN.md`. Version numbers follow semver, one minor bump per release while 0.y.z: `0.1.0` = Step 1 (engine/tests), `0.2.0` = Step 2 (habit Done button), `0.3.0` = repo restructure, `0.4.0` = agent setup/docs skills.

## [UNRELEASED] - Step 3 (issue #3, draft PR #10)

### Documentation

- Fixed stale PRD v1 section references. `docs/BUILD_PLAN.md` ground rules no longer cite `PRD 4.15`, `4.23`, `4.35` or `4.39`, which do not exist in PRD v2; they now point to `ARCHITECTURE.md` §4, §5 and §10 plus PRD 3.23.1 and 3.25. `AGENTS.md` safety rule now points to the folder layout in `docs/ARCHITECTURE.md` §5 instead of `PRD 4.15`. Documentation only; no behavior changes.
- Made the AI agent host decision-agnostic across `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/PLUGINS.md`, `docs/DECISIONS.md`, `docs/BUILD_PLAN.md`, `docs/TESTING.md`, `README.md` and the `gm_bridge.py` docstring. Docs now say "AI agent host" and list Obsidian Copilot, Text Generator and Vault Operator as undecided candidates. Added `PLUGINS.md` section 5 capability requirements and decision D-032; D-005 superseded. No behavior changes; only the `gm_bridge.py` module docstring changed.
- Added a **User stories** block to every subsection 3.1–3.25 of `docs/PRD.md`. Each of the 50 stories is a blockquote followed by two numbered acceptance criteria. Each story and criterion restates an existing settled bullet and introduces no new behavior.
- Moved the six `hasUnresolvedTaskDone` guard tests from `undo.test.js` to `task-utils.test.js`, where the helper lives, and renamed one that claimed the guard "accepts" a case it actually blocks. `docs/TESTING.md` and `docs/BUILD_PLAN.md` now separate guard coverage from undo coverage and state that five of the undo script tests remain, two of them missing-note notices. Test-only change; no behavior changes.
- Rewrote the `docs/BUILD_PLAN.md` 3.2 undo checklist as acceptance criteria grouped by PRD 3.17: eligibility and stack, correcting event and write order, derived state and rules in force, note writes, story rollback, gift cascade, messages, and regression tests. Added the missing criteria for timestamp ties, skipped ineligible actions, write-failure ordering, full replay-derived state, story tag matching and CRLF, and the daily-note regeneration. Documented that story rollback, the gift cascade, and the mid-day day-boundary change are unbuilt or undecided. Documentation only; no code changed.

### Step 3 redesign

TaskNotes = task creation, planning, user fields, while TaskRPG = task resolution, undo, and the `done`/`open` status writes. `Task done` resolves open TaskNotes task through engine. `Undo last` appends correcting engine event.

#### Added

**Task resolution feature**: `task-done.js`

    - `Task done` reads scheduled date for planned-day MP rule. Today-scheduled task avoids unplanned MP surcharge.

- resolves the active TaskNotes task
- validates its skill/size
- prevents duplicate resolution
- rolls dice
- appends a `task_done` event to `Engine/Events.md`
- updates resolution metadata and sets `status: done`
- shows the result card as a single 15-second Notice

**Undo feature**: `undo.js`

    - `Undo last` appends correcting RPG event, writes `status: open` and clears `completedDate` on matching task note; habit undo deletes the habit note's history line.

- finds newest same-day action
- appends undo correction
- preserves original event
- task undo: clears `completedDate`, restores TaskNotes default `open` status
- habit undo: deletes history line stamped with undone event's timestamp, other lines untouched
- missing task note, habit note or history line: undo still saves, notice says so

**Shared task helpers**: `task-utils.js`

- for TaskNotes frontmatter parsing
- scheduled-date lookup
- urgent/important tags
- placeholder outcome tables
- result-card formatting
- duplicate-resolution guard

**Tests**:

- Adds `task-utils.test.js`
  - TaskNotes frontmatter parsing,
  - scheduled-date mapping,
  - outcome-table selection,
  - result-card formatting,
  - completion-field updates
  - reopening a task after undo (`status: open`, empty `completedDate`)
- Adds `undo.test.js`
  - shared duplicate-resolution guard
  - `targetEventId` undo linkage
  - repeat resolution after undo
  - preserved original `task_done` event
  - end-to-end `Undo last` run against a stubbed vault adapter: the matching note gets `status: open` and `completedDate: ""`, and a second Done note is left untouched (test-only; behaviour already shipped)
  - habit undo deletes only the history line matching the undone event's timestamp and notices the removal; old "habit undo leaves task notes untouched" test replaced

#### Undo requirements settled (documentation only)

No code changed. PRD 3.17 replaced the six-line undo rule with testable requirements; `docs/BUILD_PLAN.md` undo substeps rewritten; decisions D-027 to D-031 recorded.

- Eligibility: tasks and habits only; boss challenges, gifts, rest days, pause/resume, focus project, arc completion, settings change, and missed deadlines are never targets and do not block an older eligible action.
- Stacking: each press reverses one action, newest first, same game day by configured boundary; undo events are never targets.
- Correcting event written before note changes; log write failure changes nothing, later note failure keeps the correction and says not to repeat.
- Derived state rebuilt by replay, including skill levels, habit cost tier, and rules in force at the original action; a level gained by the undone action is reversed.
- Story rollback: narrator tags lines with `<!-- evt:<eventId> -->` in `Story/`, `Campaign/`, `World/`, `Characters/`; undo removes only matching lines. No backfill of existing prose.
- Gifted loot: undoing the source task removes the item from the recipient and reduces the affinity that gift raised; the gift line replays as void. Blocked until gifts, inventory, and companions exist.
- No confirmation step; undo cost has no performance target yet.

#### Changed

- `Task done` now always writes `status: done` to the resolved task note, overwriting any prior value; TaskNotes detects the written status. Prior behaviour preserved the note's status. New test `Task done writes status done over the note's current status` starts the note at `open` and asserts `done`. Docs split changed: TaskRPG owns the `done`/`open` status writes (PRD 3.9, D-024).
- `Task done` shows the result card in one 15-second Notice; the unverified `obsidian.Modal` path and its silent `try`/`catch` fallback are removed (D-025). `task-done.test.js` asserts a single Notice carrying the outcome. PRD 3.15 and `BUILD_PLAN.md` updated; the "result modal untested" gap closes, mobile Notice stays unverified.
- `task-undo.js`/`task-undo.test.js` renamed `undo.js`/`undo.test.js` because the script handles habits, not tasks only. `removeHabitLogLine` added to `task-utils.js`; habit undo removes its own history line (D-026). PRD 3.17, `ARCHITECTURE.md`, `TESTING.md`, `PLUGINS.md`, `AGENTS.md` and `BUILD_PLAN.md` updated.
- `hasUnresolvedTaskDone` moved to `task-utils.js`, used by `task-done.js`; follows `undo.targetEventId` to original `task_done`.
- Post-valid-undo allows later `Task done`; engine marks repeat.
- Documentation updated for the ownership split and undo flow: `STEP3.md`, `TESTING.md`, `PLUGINS.md`, `AGENTS.md`, `BUILD_PLAN.md`, `README.md`.
- Scripts and tests derive urgency/importance from TaskNotes tags.
- `Journal/` folder moved outside of `TaskRPG`/ folder - user-owned content, agents should not touch it.
- Moves the game content from repository root into `TaskRPG/`: `Engine/`, `Scripts/`, `Story/`, `World/`, `Characters/`, `Campaign/`, `Backlog/`, and assets.
- Categorize tests with describe blocks to improve terminal readabilty. See `docs/TESTING.md`.
- `AGENTS.md` owns _where_ existing information lives; `docs/DOCUMENTATION.md` owns _how_ to write documentation and where _new_ documentation goes. No rule was removed, only relocated or dropped where it duplicated `AGENTS.md`.

#### Fixed

- Fixed outdate file paths for Scripts/ and Engine/ after moving both folders to TaskRPG/ folder
- TaskNotes block-list `tags` (`tags:` then `  - important`) now parse as a list, so `urgent`/`important` XP bonuses apply. Quoted flow-list tags (`["urgent", "important"]`) lose their quotes.
- `parseFrontmatter` strips matching quotes from scalar values (`taskId: "1"` reads as `1`) and ignores a leading BOM. Tests cover double-, single- and unquoted `type`/`taskId`/`skill`/`size`, empty quoted values, and values containing a colon or quote (issue #17). Test-only: the behaviour already shipped with the quoted-`taskId` fix.
- Scheduled date property uses `scheduled`, not `scheduledDate`.
- Duplicate-resolution guard follows `undo.targetEventId`, allowing re-resolution after valid undo.
- `updateTaskStatus` now edits only the frontmatter block, inserts `status`/`completedDate` when missing, writes `$&`/`$1` literally, preserves CRLF, and throws a clear error when there is no frontmatter (issue #14). This fixes `Task done` silently logging an event without marking the note.
- `task-done.js`/`undo.js` rewrite only the `status` and `completedDate` lines; other frontmatter untouched. `task-done.js` always writes `status: done` (D-024); `undo.js` writes `open`.
- `Undo last` now restores the TaskNotes status to `open` and clears `completedDate`, so the note no longer stays Done after an undo (issue #19). The status value is defined once as `OPEN_TASK_STATUS` in `task-utils.js`; TaskNotes 4.13.8 uses `open` as `defaultTaskStatus`.
- Task notes identified via the `tasksFolder` in TaskNotes' `data.json` (fallback `TaskNotes/Tasks`) instead of assuming notes sit directly in `TaskNotes/`.
- Identifies a note is a task by `taskTag` (read from `data.json`, fallback `task`) instead of requiring a `type: task` frontmatter field. Adds `taskTag` to `task-utils.js` and tests that a note without the tag is refused.
- Task identity: Adds `taskId` as the stable identity (decision D-023), a TaskNotes body template (`TaskNotes/Templates/template.md`: `taskId: {{nano}}`) for new notes. Template verified manually on 2026-10-21 (taskId written, tags/status preserved).
- `Task done` now treats `taskId: null`, `taskId: ~` and `taskId: undefined` as missing instead of accepting the literal word as an ID. `task-done.test.js` adds negative cases for missing, empty and `null` `taskId`, `skill` and `size`: no event is logged and the note is untouched (test-only coverage for the skill/size checks, which the engine also enforces).
- `Task done` now rewrites the derived `Engine/Hero.md` after resolution, so HP, MP and skill XP in the Meta Bind panels match the new event (previously only `Habit Done` refreshed it). The hero template moved to `renderHero()` in `task-utils.js` and both wrappers use it, so the two copies cannot drift. `task-done.test.js` asserts the written hero state; `habit-done.test.js` covers the shared helper.
- `Undo last` also rewrites `Engine/Hero.md` from the corrected state, for task and habit undos. `undo.test.js` asserts the restored MP and skill XP.
- `Undo last`'s Notice now matches what happened: "TaskNotes status restored to open" only after a task note was actually rewritten; a task undo with no matching note says so instead; a habit undo does not mention TaskNotes. Tests cover all three paths.
- `Undo last` now removes the habit-note history line added by the undone habit press, matched by its timestamp, instead of leaving the note claiming a reversed completion (D-026). Adds `removeHabitLogLine()` in `task-utils.js` and habit lookup by `habitId` in `TaskRPG/Engine/Habits/`; the Notice reports whether a line was removed. `undo.test.js` covers removal, other habit/task notes staying untouched, and a missing habit note.

#### Removed

- `new-task.js` and `New task` QuickAdd flow.
- `plan-task.js` and `Plan task` QuickAdd flow.
- Task-note creation, slug generation, size-suggestion helpers from `task-utils.js`.
- Hard-coded planned/backlog restoration from `undo.js`.

---

## [0.4.1] - 2026-10-18

Docs-only release. Refactor all doc content, structure, strategy: kill verbosity, staleness, redundancy, drift. Each doc one job, clear split. No engine, script, or runtime change.

### Added

- `docs/ARCHITECTURE.md`—system structure, data model, engine ownership, module boundaries, storage, invariants.
- `docs/DECISIONS.md`—decision log: accepted/provisional/superseded, rationale, alternatives, implications.
- `docs/BUILD_PLAN.md`—roadmap, milestones, build order, acceptance criteria, build status (done/not-done, gaps, validation).
- `docs/DOCUMENTATION.md`—doc structure, per-file responsibility, separation, starter templates.

### Changed

- Repo layout: `CHANGELOG.md` moved `docs/` to repo root.
- `docs/PRD.md` restructured: single "Settled decisions" §3, subsections renumbered; scope, leaning, build-default reorganized.
- `AGENTS.md` rewritten: authority order, session skills, safety, before coding, coding rules, documentation; no more PRD duplication.
- `README.md` rewritten: first-time-reader landing page (purpose, value, features, requirements, setup, doc links), not spec.
- `docs/PLUGINS.md`, `docs/TESTING.md` updated to new doc set, single-responsibility split.
- Build status, known gaps moved out of `CHANGELOG.md`, `docs/TESTING.md` into `docs/BUILD_PLAN.md`.
- `TaskRPG/Journal/AGENTS.md` moved to `Journal/README.md`; `TaskRPG/Journal/Templates/Daily.md` moved to `TaskRPG/Templates/Daily.md`.
- `TaskRPG/Engine/Habits/Morning routine.md` now links `[[BUILD_PLAN.md]]`, not removed `[[STEP2]]`.
- `TaskNotes` base views: labels normalized, `sort` keys `column` to `property`, `columnOrder` added, project filter added to default task list.
- `.gitignore` adds local `/Clippings/`, `/TaskNotes/` ignores.

### Removed

- `docs/BUILD_PROMPT.md`, `docs/STEP3.md`.
- `TaskRPG/Campaign/AGENTS.md`, `TaskRPG/World/AGENTS.md`.

---

## [0.4.0] - 2026-10-16

### Agent setup + Documentation skills

> Branch: `repo-structure` - Merged.
> Process/docs only; no engine/rule/runtime behavior changed.

#### Decisions

- Code documentation skills can now use caveman-style prose to cut verbosity.
- Use `/tdd` and `/ponytail` skills for each coding session from now on to improve outputs.

#### Added

- TDD rules in `AGENTS.md`: test-first default, no vanity tests, failing tests as to-do, never weaken test, layout/commands/checks. Matching ground rule in `BUILD_PLAN.md`; pointer and order in `TESTING.md`.
- Session skills in `AGENTS.md`: load `caveman` at start of every session, `ponytail` at start of coding sessions only; skip `ponytail` for story/canon/prose/settings/research. Compression never overrides TDD reporting, doc sync, confirm-before-implementing.
- `tdd` workflow referenced in `AGENTS.md`; changelog-at-commit, doc sync, confirm risky assumptions/design decisions.
- Made new local `/changelog` skill (`.agents/skills/changelog/SKILL.md`, gitignored/untracked) with reference guide doc to run on each commit.
- Added new user flow diagram section to PRD. Has only habit done flow for now.

#### Changed

- `AGENTS.md` TDD section cut ~89 lines/1,824 words to short section; file ~3,340 → ~1,980 words.
- Docs point at skill; `TESTING.md` and `BUILD_PLAN.md` drop removed heading reference; caveman precedence names skill Report step.

---

## [0.3.0] - 2026-10-16

Minor repo restructuring. All tests passing.

### Added

- `docs` folder for project documentation.
- `TaskRPG` folder for game-related content (story, characters, events).

### Removed

- `.gitignore` ignores local dev files (`.agents/`, `./claude`, `todo.md`).

---

## [0.2.0] - 2026-10-14

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
