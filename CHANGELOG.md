# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers follow the build brief's steps: `0.1.0` is Step 1 (engine and tests) and `0.1.1` is Step 2 (habit Done button). Nothing is tagged yet, and `0.1.1` still lives on the `issue-2-habit-button` branch.

## [UNRELEASED]—Step 3 redesign (issue #3, draft PR #10)

### Added

- `Scripts/task-utils.js` now provides a TaskNotes scheduled-date helper used by task resolution and undo.
- `Scripts/task-utils.test.js` covers TaskNotes frontmatter parsing, scheduled-date mapping, outcome-table selection, result-card formatting, and completion-field updates.
- `STEP3.md`, `TESTING.md`, `README.md`, `PLUGINS.md`, `AGENTS.md`, and `BUILD_PROMPT.md` describe the TaskNotes-wrapped ownership model and validation gate.
- Documentation: Added commit-time changelog and doc-sync rules to `AGENTS.md` and `BUILD_PROMPT.md`, plus a requirement to confirm risky assumptions/design decisions with the user before implementing (not already answered by docs/comments).
- Documentation: Added a **test-driven development workflow** section to `AGENTS.md` — test-first order as the way to write acceptance criteria and confirm design before implementation; a **"No vanity tests"** rule set (assert behaviour over current output, prove a test bites by breaking the implementation, cover boundaries, no tautologies, independent fixtures); **failing tests as the to-do list** (allowed on a branch, never skipped to fake a green run, and the merge to `main` as the one hard line); rules against weakening tests; test layout and run commands; and the manual-check substitute for plugin/mobile work. A matching ground rule was added to `BUILD_PROMPT.md`, and a pointer plus the practical order of operations to `TESTING.md`. Process guidance only; no engine, rule or runtime behavior changed.
- Documentation: Added a **Session skills** section to `AGENTS.md` requiring the `ponytail` and `caveman` skills to be loaded at the start of every coding session and not for non-coding work (story, canon, narration, prose, hand-made settings edits, research), with explicit precedence so compression never overrides this file's TDD reporting, doc-sync or confirm-before-implementing rules. A matching ground rule was added to `BUILD_PROMPT.md`. Process guidance only; no engine, rule or runtime behavior changed.

### Changed

- **TaskNotes now owns task creation, planning, statuses, and the task user fields** (`skill`, `size`, `urgent`, and `important`).
- **TaskRPG now owns only task resolution and undo**: `Task done` resolves an open TaskNotes task through the engine; `Undo last` appends a correcting engine event.
- `Task done` reads the TaskNotes scheduled date for the planned-day MP rule. A task scheduled for today avoids the unplanned MP surcharge.
- `Undo last` appends a correcting RPG event and clears `completedDate` on a matching task note while preserving its status. The ownership of `completedDate` still needs verification; it is not proven to be TaskRPG-only metadata.
- TaskNotes Workflows may later invoke `/task-done` automatically on an In Progress → Done change. This optional phase 2 is not implemented or validated.

### Removed

- `Scripts/new-task.js` and the `New task` QuickAdd flow.
- `Scripts/plan-task.js` and the `Plan task` QuickAdd flow.
- Task-note creation, slug generation, and size-suggestion helpers from `Scripts/task-utils.js`.

### Documentation Consistency

| File            | Status                     | Findings                                                                                                                                                  |
| --------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| STEP3.md        | Needs sync                 | Describe preserved TaskNotes status after RPG undo; remove claims that Undo restores open/planned state. Record the duplicate-guard defect.               |
| CHANGELOG.md    | Revised draft              | Records status-related code changes separately from remaining defects and unverified behaviour.                                                           |
| TESTING.md      | Needs regression checks    | Test Done-then-resolve, duplicate blocking, undo linkage by targetEventId, and preservation of TaskNotes fields. Do not claim post-undo behaviour passes. |
| README.md       | Needs sync                 | Distinguish RPG undo from reopening a TaskNotes task; keep integration status unverified.                                                                 |
| PLUGINS.md      | Consistent                 | Correctly assigns task creation, planning, statuses, and fields to TaskNotes, and resolution/undo to TaskRPG.                                             |
| AGENTS.md       | Consistent                 | Correctly separates TaskNotes task ownership from TaskRPG resolution/undo.                                                                                |
| BUILD_PROMPT.md | Needs sync                 | Remove task-status restoration from Step 3 requirements; retain regression checks for resolution and undo.                                                |
| PRD.md          | Verify branch versus draft | An uploaded revised draft exists; compare it with current branch content before replacing the specification.                                              |

### Known issues and validation limitations

| Area                                 | Status                                   | Details                                                                                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TaskNotes Done versus RPG resolution | Status rejection removed; untested       | Commit `7f85ee4` removes rejection of `done`/`completed` TaskNotes statuses and adds an event-log duplicate guard. End-to-end validation is still pending.                                                                                                 |
| TaskNotes status restoration         | Hard-coded restoration removed; untested | Commit `60d00b9` preserves the existing status value instead of assigning planned/backlog. The helper still rewrites the status line and clears completedDate; field preservation requires testing.                                                        |
| Automated tests                      | Not run on this branch                   | Run `node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js` and record the result.                                                                                                                                      |
| TaskNotes field mapping              | Unverified                               | Confirm the installed TaskNotes version preserves `taskId`, `skill`, `size`, `urgent`, `important`, status, and the scheduled-date field.                                                                                                                  |
| Scheduled-date property              | To confirm                               | The scripts read `scheduledDate`, falling back to `scheduled`; adjust the mapping if the installed TaskNotes version uses another property.                                                                                                                |
| Desktop Obsidian                     | Unverified                               | `Task done`, result-card modal, event log, and task-note updates have not been tested.                                                                                                                                                                     |
| Mobile result card                   | Unverified                               | Phone result-card behaviour has not been tested.                                                                                                                                                                                                           |
| Engine/Hero.md                       | Not updated                              | Task Done and Undo last do not rewrite the derived hero note.                                                                                                                                                                                              |
| Habit undo                           | Not cleaned up                           | Undoing a habit does not remove its habit-note history.                                                                                                                                                                                                    |
| Result modal                         | Unverified                               | QuickAdd access to `obsidian.Modal` has not been tested; a Notice is the fallback.                                                                                                                                                                         |
| Undo / re-roll                       | Guard defect remains                     | The duplicate guard filters undo events by taskId, but engine undo events identify the action using targetEventId, not taskId. A valid undo will generally not release the guard. Do not claim post-undo resolution or no-re-roll enforcement is verified. |
| Outcome table                        | Placeholder                              | Uses the loot die rather than a separate recorded table draw.                                                                                                                                                                                              |
| Automatic Workflows trigger          | Not built                                | Phase 2 only; do not treat it as available.                                                                                                                                                                                                                |
| Existing gaps                        | Still apply                              | The Step 2 event-log/Hero repair gap and engine CLI default to `Engine/Events.jsonl` remain.                                                                                                                                                               |

#### Required follow-up fixes

- [x] Remove task-done.js rejection of TaskNotes done/completed statuses (implemented, not integration-tested).
- [ ] Correct the duplicate guard to match undo.targetEventId to task_done.id; add regression tests before claiming post-undo behaviour works.
- [x] Remove hard-coded planned/backlog restoration from undo-last.js (implemented, not integration-tested).
- [ ] Verify completedDate ownership and preserve TaskNotes status/frontmatter without rewriting plugin-owned completion data.
- [ ] STEP3.md, TESTING.md, README.md, BUILD_PROMPT.md: update wording after the code fix so the documented flow matches implementation.

## [0.1.1] - 2026-10-14

### Added—Step 2: the habit Done button

```txt
 [Done button: Meta Bind or QuickAdd]
                  |
                  v
 [Habit note] --> [habit-done.js] --> [engine.js]
 (habitId, skill)  QuickAdd script     (owns every rule)
                  |
                  v
 +-- Then writes, in this order ---------------------------+
 |                                                         |
 |  [Events.md] --> [Habit note] --> [Hero.md]             |
 |   log line        History line     HP, MP, XP           |
 |   appended        added            rewritten            |
 +---------------------------------------------------------+
                  |
                  v
 [Notice: 8s, or 12s if it fails]
```

#### Habit Done macro (`Scripts/habit-done.js`)

- A QuickAdd user script behind the macro `TaskRPG: Habit Done`. It runs only while a note in `Engine/Habits/` is open; otherwise it stops with a notice naming the folder.
- It reads the habit note's frontmatter: `habitId` (lowercase letters, digits and hyphens only) and `skill`. If either is missing or malformed, it stops and says what the note needs.
- A suggester asks whether the press was "Within my habit block" or "After my habit block", which sets `onTime` to true or false. Cancelling writes nothing.
- It loads `Scripts/engine.js` by reading and evaluating the file, so it needs no `require` and can run on the phone. The engine owns every rule; the macro only formats its numbers.
- Write order: event log line, then the habit note's History line, then the derived hero state. A notice follows for 8 seconds in the PRD 4.8 format, e.g. `Morning routine complete! +0 HP, +1 XP, -2 MP (MP 8/10)`.
- On failure, the notice lasts 12 seconds and says whether the event was saved. If the log line is already written, it says not to press again and to repair the habit note and hero state from the log. Nothing is deleted.
- Habits get no dice roll and no story beat (PRD 4.8), so the event has no `roll` field.

#### Habit note and its button

- `Engine/Habits/Morning routine.md` is the first habit. Frontmatter: `type: core-habit`, `habitId: morning-routine`, `skill: vitality`, `block: morning`.
- Its Done button is a Meta Bind `meta-bind-button` that runs the QuickAdd choice by command ID (copied with `Meta Bind: Select and copy command id`, never guessed). The QuickAdd command itself is the fallback button, so the habit still works if the Meta Bind button misbehaves.
- A `## History` section holds `timestamp | on time|late | status` lines, appended by the macro.

#### Hero note and Meta Bind fields (`Engine/Hero.md`)

- The macro recalculates HP, MP and skill XP from the log and rewrites this note. The frontmatter holds `hp`, `maxHP`, `mp`, `maxMP` and `xp_<skill>` for all five skills. The body shows HP, MP and each skill's XP as Meta Bind inline fields (`VIEW[{hp}][text]` and so on).
- The note says it is derived from the log and must not be edited by hand. Stable identity stays in `Campaign/00 Hero.md`.

#### The live event log is a note

- The live log is `Engine/Events.md`: a Markdown note Obsidian can display, with one JSON object per line. Step 1 left the extension open; `.jsonl` files are hidden in Obsidian's file list, so `.md` won.
- The engine skips blank lines and lines starting with `#` or a code fence, so the note can carry headings around the log.

#### Tests (`Scripts/habit-done.test.js`)

Two tests drive the real macro against a fake vault (an in-memory file map and a stubbed `Notice`):

- An on-time press and a late press each append `settings_changed` then `habit_done` to the log, add `| on time |` or `| late |` to the habit History, update `xp_vitality` in the hero note, and show a notice containing `+1 XP`. The event has no `roll` field.
- Cancelling the suggester, and pressing with no habit note open, write no event.

### Changed

- The live log is now `Engine/Events.md` instead of `Engine/Events.jsonl`, and it holds real presses instead of test data.
- `Engine/State.json` is still the output of `node Scripts/engine.js recalc`, but the panels no longer read it; the macro writes the hero note directly. It is unchanged since Step 1.
- Test count is now 45 (43 in `Scripts/engine.test.js`, 2 in `Scripts/habit-done.test.js`), up from 43.

### Quality checks

- `node --test Scripts/engine.test.js Scripts/habit-done.test.js`: 45 pass, 0 fail (Node 22.14.0, 2026-10-14).
- Coverage with `--experimental-test-coverage`:
  - `engine.js`: 100% lines, 96.3% branches, 100% functions.
  - `habit-done.js`: 95.7% lines, 81.5% branches, 100% functions. The only uncovered lines (21–22) are the invalid-frontmatter error.

### Known issues

- **No repair path inside the vault yet.** If a display write fails after the log line is saved, `STEP2.md` says to repair from the log, but nothing rewrites `Engine/Hero.md`. `node Scripts/engine.js recalc` still defaults to `Engine/Events.jsonl` (not the live `Engine/Events.md`) and writes `Engine/State.json`, which the panels no longer read. The PRD's recalculate button is not built.
- **Missed habit blocks are not back-filled in the vault.** The engine has `backfillMissedDeadlines` and tests for it, but no macro calls it. A closed habit block therefore leaves no `missed_deadline` line and no HP loss. Block times are also undefined: the habit note has `block: morning` but no deadline timestamp.
- **Each press rewrites the whole log note** (the vault adapter has no append), so a sync conflict mid-press can lose lines. The one-writer-at-a-time rule in `STEP2.md` is the guard.
- **The Meta Bind button hard-codes the QuickAdd choice's command ID.** Fit doesn't sync plugin settings by default, so the choice and its ID must also exist on the phone (see `PLUGINS.md`).
- **Carried over from `0.1.0`:** an event dated before the first `settings_changed` entry is back-filled with today's rules. `engine.js` was not changed in this version, so the bug and its missing regression test remain.

### Open questions

1. **Repeat presses of one habit in a day.** The engine allows them, and each press costs MP and earns 1 XP (the test log has seven presses of the same habit in one game day). Undecided: should the button stop after the first on-time press of the day, or ask whether this is a separate block?
2. **Habit deadline times.** Back-filling needs a timestamp per habit block (e.g. "morning closes at 10:00"). Undecided: does it live in habit frontmatter or in the settings note?

### Also on this branch (not Step 2)

- `gm_bridge.py` moved to `Scripts/gm_bridge.py` with `git mv`. The `README.md` usage lines and file table are updated to match.

## [0.1.0] - 2026-10-14

### Added—Step 1: engine and tests

#### Engine (`Scripts/engine.js`)

A dependency-free game engine with no Obsidian code. It takes an event log and settings note and returns the new state and the result of an action. It loads without `fs`, `path` or `require`, so it can run on the phone.

The command `node Scripts/engine.js recalc` rebuilds state from the log and prints the same state on repeat runs. On bad usage it exits with code 1 and writes to stderr.

| Game Feature         | Rules and Constraints                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time**             | - The day rolls over at 4:00 AM.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **MP**               | - Maximum 10, refilled each morning.<br>- Task cost by size: small 1, medium 3, large 5.<br>- Surcharges: +1 for an unplanned task, and +1 for every task while Wounded.<br>- Discounts: −1 at skill levels 5 and 10, in that skill only. A task never costs less than 1.<br>- Overdraft: a task is an overdraft when its cost exceeds the remaining MP. Overdraft halves XP (rounded up) and adds a −1 "Tired" roll penalty. HP is unaffected.<br>- Habit cost depends on the share of eligible days in the last 30 that were done on time:<br> - under ⅓: 2 MP<br> - ⅓ to under ⅔: 1 MP<br> - ⅔ or more: 0 MP<br> - A new habit starts at 2 MP.<br>- Eligible days are weekdays that are not rest or pause days. A weekend, rest or pause day counts only if the habit was done. |
| **XP and levels**    | - Task XP equals its size, plus 50% if important, plus 50% if urgent, plus 25% if it's in the weekly focus project. The bonuses add together, and the result is rounded up.<br>- Habit XP is 1 per press, including at 0 MP.<br>- Five skills, 10 levels each. The XP thresholds are placeholders in the settings note (level 2 at 10, up to level 10 at 320).<br>- Dice bonus of +1 at levels 2, 4, 6, 8 and 10.                                                                                                                                                                                                                                                                                                                                                                  |
| **Roll**             | - 2d6 plus the skill's dice bonus, minus the HP penalty and the Tired penalty.<br>- Base thresholds: success at 9+, partial success at 6–8, setback at 5 or less.<br>- Each project has a threat level of +1 per finished arc, capped at +4, which raises every threshold. Tasks outside a project use T = 0.<br>- A success has a one-in-three chance of loot (a die roll where 5 or 6 drops). The engine only flags the drop; the narrator names it later.<br>- A roll never changes the XP or MP of the real task.                                                                                                                                                                                                                                                              |
| **HP**               | - Maximum 10. An on-time core habit restores 1. A late press earns XP but no HP and doesn't count as an on-time day.<br>- A missed block deadline costs 1 HP, capped at 2 HP lost per day. Rest days, pause and weekends are exempt.<br>- Dice penalty: 7–10 HP is 0, 4–6 is −1, 1–3 is −2, 0 is −3.<br>- At 0 HP you are **Wounded**: tasks cost +1 MP, boss challenges are blocked.<br>- Missed blocks are back-filled when the vault opens.                                                                                                                                                                                                                                                                                                                                     |
| **Rest and pause**   | - Rest day: a one-day pass, 4 a month, with no HP loss and no plan needed.<br>- Pause: freezes the game with no HP loss. Paused days are left out of every habit's measure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Settings changes** | - Each change is logged with the time it was recorded. The engine uses the rules in force on each day and never rewrites the past. Editing the note without recording an action does not change the past.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Undo**             | - Adds a correcting line to the log; nothing is deleted.<br>- It only reverses the newest task or habit action from the same game day, and can't be used to re-roll.<br>- Pressing Done again after an undo gets a fresh roll, flagged `repeat`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

#### Data files

- **Event log:** one shared, append-only JSON Lines file with one line per action (date, time, type, skill, size, roll, outcome, XP, MP). Events replay in timestamp order, so a back-filled missed deadline is appended rather than inserted.
- **`Engine/Settings.md`:** holds every tunable number in a JSON block. The engine rejects out-of-range values and names the setting that is wrong.
- **`Engine/State.json`:** written by `recalc`. It is the saved copy that the Step 2 hero note and Meta Bind panels will read.

#### Tests

`Scripts/engine.test.js`, run with `node --test Scripts/engine.test.js`.

- One test per rule in the brief, plus settings changes, undo, the day boundary, back-filling and the terminal run. The first build passed 30 of 30.
- Settings validation tests for `taskSizes`, `lootDropRolls`, `hpPenalties` and `habitTiers`.
- A table-driven test for invalid actions: unknown size, bad `planned` or `onTime`, bad `lootRoll`, missing `habitId` or `projectId`, and an invalid rest-day date.
- A test that the terminal command exits with code 1 and writes to stderr on bad usage.
- A test that the live `Settings.md` is valid.

### Changed

- **Test suite merged.** The original 30-test suite and a second 42-test suite are now one file of 43 tests, with no coverage lost.
  - The merged suite uses the second suite's frozen settings copy. When you change a default on purpose, update that copy.
  - Kept from the original suite: event log text parsing (including `line 2 is not valid JSON`), `localStamp`, and the check that the engine loads with no `fs`, `path` or `require`.
  - Folded together: Wounded at 1 HP is now inside the task MP cost test, the own-skill MP discount is part of the skill level test, the rest-day monthly reset is part of the rest days test, and the two `rollDice` tests are one.
  - Removed as duplicates: the extra `bonus(5)` dice check, the next-week focus lines in the XP test (the weekly-focus test covers them), and a repeated Wounded MP assertion.
  - The undo test now matches the full error message. Its two failing cases each break one rule, and both rules share one message, so the setup tells them apart (a comment in the test explains).
- **Settings format:** the settings note is now a JSON block instead of the PRD's table with min and max beside each value. This follows the choice of JSON Lines for the event log and will need revisiting when Step 2 adds Meta Bind fields.
- `TESTING.md` is updated: the test-name table is current, and the note that tests read the live `Settings.md` now says they use the frozen copy.
- The old suite is backed up at `files\engine.test.old.js` in the session folder. The test file is untracked in git.

### Quality checks

- 43 of 43 tests pass.
- `engine.js` coverage: 100% of lines, 96% of branches. Before the merge, the second suite left 5 chunks of `engine.js` uncovered.
- Mutation check: 12 deliberate engine breaks were run against the merged suite, and all 12 were caught (e.g. the Wounded surcharge applying at 1 HP, MP discounts using the wrong skill, the rest-day limit not resetting monthly). A 13th break changed no behaviour, so it was not counted.

### Known issues

- **Back-fill uses the wrong rules for old events.** An event dated before the first `settings_changed` entry gets today's rules instead of the rules in force on that day. `engine.js` was not changed, and there is no test yet because it would fail until the engine is fixed. A fix and a regression test are pending a decision.

### Open questions

1. **MP discount at levels 5 and 10:** treated as cumulative, so level 10 takes off 2 MP. If exactly 1 MP off at both levels was intended, it is a one-line change.
2. **Repeat press after an undo:** the PRD says it gets a fresh roll logged as a repeat, but not whether it earns full XP. It currently does.

### Not yet built

- Boss challenges and inventory. Loot is only flagged on the roll result.
- Macros and plugin wiring, which wait for Step 2 (hero note and Meta Bind panels).
