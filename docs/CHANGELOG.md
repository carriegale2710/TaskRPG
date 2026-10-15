# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Version numbers follow the build brief's steps: `0.1.0` is Step 1 (engine and tests) and `0.1.1` is Step 2 (habit Done button). Nothing is tagged yet, and `0.1.1` still lives on the `issue-2-habit-button` branch.

## [UNRELEASED]—Step 3 (issue #3, draft PR #10)

### Step 3 redesign

#### Summary

- Fixed the task duplicate-resolution guard to follow `undo.targetEventId`, so a valid undo allows the same task to be resolved again.
- Added `Scripts/task-undo-resolution.test.js`, covering guard behaviour, undo linkage, repeat resolution, and preservation of the original `task_done` event.
- Moved `hasUnresolvedTaskDone` into `Scripts/task-utils.js`; `task-done.js` now uses the shared implementation.
- Updated `STEP3.md`, `TESTING.md`, and `README.md` for the corrected undo flow and expanded automated test command.
- Automated tests pass; Obsidian desktop/phone integration remains unvalidated.

#### Required follow-up fixes

- [x] Remove task-done.js rejection of TaskNotes done/completed statuses (implemented, not integration-tested).
- [x] Correct the duplicate guard to match undo.targetEventId to task_done.id; add regression tests before claiming post-undo behaviour works.
- [x] Remove hard-coded planned/backlog restoration from undo-last.js (implemented, not integration-tested).
- [x] STEP3.md, TESTING.md, README.md, BUILD_PROMPT.md: update wording after the code fix so the documented flow matches implementation.
- [ ] Verify completedDate ownership and preserve TaskNotes status/frontmatter without rewriting plugin-owned completion data.

---

#### Added

- `Scripts/task-utils.js` now provides a TaskNotes scheduled-date helper used by task resolution and undo.
- `Scripts/task-utils.test.js` covers TaskNotes frontmatter parsing, scheduled-date mapping, outcome-table selection, result-card formatting, and completion-field updates.
- `Scripts/task-undo-resolution.test.js` covers the shared duplicate-resolution guard, `targetEventId` undo linkage, repeat resolution after undo, and preservation of the original `task_done` event.
- `STEP3.md`, `TESTING.md`, `README.md`, `PLUGINS.md`, `AGENTS.md`, and `BUILD_PROMPT.md` describe the TaskNotes-wrapped ownership model and validation gate.

#### Changed

- **TaskNotes now owns task creation, planning, statuses, and the task user fields** (`skill`, `size`, `urgent`, and `important`).
- **TaskRPG now owns only task resolution and undo**: `Task done` resolves an open TaskNotes task through the engine; `Undo last` appends a correcting engine event.
- `Task done` reads the TaskNotes scheduled date for the planned-day MP rule. A task scheduled for today avoids the unplanned MP surcharge.
- `Undo last` appends a correcting RPG event and clears `completedDate` on a matching task note while preserving its status. The ownership of `completedDate` still needs verification; it is not proven to be TaskRPG-only metadata.
- `hasUnresolvedTaskDone` moved to `Scripts/task-utils.js` and is now used by `Scripts/task-done.js`; it follows `undo.targetEventId` to the original `task_done` event.
- After a valid undo, a later `Task done` resolution is allowed and the engine marks it as a repeat.
- TaskNotes Workflows may later invoke `/task-done` automatically on an In Progress → Done change. This optional phase 2 is not implemented or validated.

#### Removed

- `Scripts/new-task.js` and the `New task` QuickAdd flow.
- `Scripts/plan-task.js` and the `Plan task` QuickAdd flow.
- Task-note creation, slug generation, and size-suggestion helpers from `Scripts/task-utils.js`.

---

#### Known issues and validation limitations

| Area                                 | Status                                   | Details                                                                                                                                                                                             |
| ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TaskNotes Done versus RPG resolution | Guard fixed; integration untested        | The duplicate guard follows `undo.targetEventId` to the original `task_done` event. End-to-end validation is still pending.                                                                         |
| TaskNotes status restoration         | Hard-coded restoration removed; untested | Commit `60d00b9` preserves the existing status value instead of assigning planned/backlog. The helper still rewrites the status line and clears completedDate; field preservation requires testing. |
| Automated tests                      | Pass on this branch                      | `node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js Scripts/task-undo-resolution.test.js` passes.                                                             |
| TaskNotes field mapping              | Unverified                               | Confirm the installed TaskNotes version preserves `taskId`, `skill`, `size`, `urgent`, `important`, status, and the scheduled-date field.                                                           |
| Scheduled-date property              | To confirm                               | The scripts read `scheduledDate`, falling back to `scheduled`; adjust the mapping if the installed TaskNotes version uses another property.                                                         |
| Desktop Obsidian                     | Unverified                               | `Task done`, result-card modal, event log, and task-note updates have not been tested.                                                                                                              |
| Mobile result card                   | Unverified                               | Phone result-card behaviour has not been tested.                                                                                                                                                    |
| Engine/Hero.md                       | Not updated                              | Task Done and Undo last do not rewrite the derived hero note.                                                                                                                                       |
| Habit undo                           | Not cleaned up                           | Undoing a habit does not remove its habit-note history.                                                                                                                                             |
| Result modal                         | Unverified                               | QuickAdd access to `obsidian.Modal` has not been tested; a Notice is the fallback.                                                                                                                  |
| Undo / re-roll                       | Guard fixed; no-re-roll policy unchanged | A valid undo releases the duplicate-resolution guard through `targetEventId`; a later Task done is a fresh, repeat-marked resolution. Do not use undo to seek a better roll.                        |
| Outcome table                        | Placeholder                              | Uses the loot die rather than a separate recorded table draw.                                                                                                                                       |
| Automatic Workflows trigger          | Not built                                | Phase 2 only; do not treat it as available.                                                                                                                                                         |
| Existing gaps                        | Still apply                              | The Step 2 event-log/Hero repair gap and engine CLI default to `Engine/Events.jsonl` remain.                                                                                                        |

---

### Documentation Consistency

| File            | Status                     | Findings                                                                                                                                                                                                                                               |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| STEP3.md        | Updated                    | Documents preserved TaskNotes status after RPG undo, the `targetEventId` duplicate guard, repeat resolution after undo, the expanded test command, and the urgent/important-as-tags decision (recorded as **not yet implemented**).                    |
| CHANGELOG.md    | Updated                    | Records the guard fix, regression tests, shared helper, documentation sync, the urgent/important-as-tags decision, and remaining integration-validation gaps.                                                                                          |
| STILL TO SYNC   | —                          | `PLUGINS.md` (line 112), `TESTING.md` (line 7), `BUILD_PROMPT.md` (lines 84, 86) and `PRD.md` still describe `urgent`/`important` as TaskNotes user fields. Update them the same way as STEP3.md, or state that the tag change is decided-but-unbuilt. |
| TESTING.md      | Updated                    | Records passing automated tests, adds `task-undo-resolution.test.js`, and retains the Obsidian desktop/phone validation gate.                                                                                                                          |
| README.md       | Updated                    | Distinguishes RPG undo from reopening a TaskNotes task; documents `targetEventId` linkage and repeat resolution; keeps integration status unverified.                                                                                                  |
| PLUGINS.md      | Consistent                 | Correctly assigns task creation, planning, statuses, and fields to TaskNotes, and resolution/undo to TaskRPG.                                                                                                                                          |
| AGENTS.md       | Consistent                 | Correctly separates TaskNotes task ownership from TaskRPG resolution/undo.                                                                                                                                                                             |
| BUILD_PROMPT.md | Updated                    | Step 3 undo no longer requires restoring the task's open/planned status; it preserves status and clears completion metadata, and a regression-test bullet for resolution/undo was added.                                                               |
| PRD.md          | Verify branch versus draft | An uploaded revised draft exists; compare it with current branch content before replacing the specification.                                                                                                                                           |

---

### Other updates: agent setup

Process and documentation only—no engine, rule or runtime behaviour changed.

#### Added

- **TDD rules in `AGENTS.md`**—test-first default, "no vanity tests", failing tests as the to-do list, never weaken a test, test layout and run commands, manual checks for plugin/mobile work. Matching ground rule in `BUILD_PROMPT.md`; pointer and order of operations in `TESTING.md`.
- **Session skills**—`AGENTS.md` requires loading `ponytail` (minimal engineering) and `caveman` (compressed comms) at the start of coding sessions, and not for story/canon/prose/settings/research work. Compression never overrides TDD reporting, doc sync or confirm-before-implementing. Matching ground rule in `BUILD_PROMPT.md`.
- **`tdd` skill**—new repo-agnostic skill at `.agents/skills/tdd/SKILL.md`: red-green loop, testing at seams, no vanity tests, failing-test policy and the merge-to-`main` line, where tests go and how to run them, when not to test first. Absorbs the orphaned `.agents/skills/write-tests/references/tdd-rules.md` (its folder has no `SKILL.md`, so it never loaded); the redundant folder still needs a decision.
- **Commit hygiene**—changelog-at-commit and doc-sync rules for `AGENTS.md` and `BUILD_PROMPT.md`, plus confirm risky assumptions and design decisions with the user before implementing.

#### Changed

- `AGENTS.md` **TDD section cut** from 89 lines / 1,824 words to a short section keeping the test-first default, the `tdd` skill trigger, the invariants and the TaskRPG specifics (test layout, run commands, boundary cases, throwaway-log note). File drops ~3,340 → ~1,980 words.
- Docs now point at the skill: `TESTING.md` and `BUILD_PROMPT.md` drop the removed heading reference, and the `caveman` precedence rule names the skill's _Report_ step.

---

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
- `Engine/State.json` is still the output of `node Scripts/engine.js recalc`, but the panels no longer read it; the macro writes the hero note directly. It is unchanged since Step 2.
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
| **Rest and pause**   | - Rest day: a one-day pass, 4 a month, with no HP loss, no plan needed.<br>- Pause: freezes the game with no HP loss. Paused days are left out of every habit's measure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Settings changes** | - Each change is logged with the time it was recorded. The engine uses the rules in force on each day and never rewrites the past. Editing the note without recording an action does not change the past.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Undo**             | - Adds a correcting line to the log; nothing is deleted.<br>- It only reverses the newest task or habit action from the same game day, and can't be used to re-roll.<br>- Pressing Done again after an undo gets a fresh roll, flagged `repeat`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Event log**        | - One shared, append-only JSON Lines file with one line per action: date, time, type, skill, size, roll, outcome, XP, MP.<br>- Events replay in timestamp order, so a back-filled missed deadline is appended rather than inserted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Settings note**    | - `EngineSettings.md` holds every tunable number in a JSON block.<br>- The engine rejects out-of-range values and names the setting that is wrong.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **State file**       | - `EngineState.json` is written by `recalc`.<br>- It is the saved copy that the Step 2 hero note and Meta Bind panels will read.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

#### Tests (`Scripts/engine.test.js`)

- One test per rule in the brief, plus settings changes, undo, the day boundary, back-filling and the terminal run.
- Settings validation tests for taskSizes, lootDropRolls, hpPenalties and habitTiers.
- A table-driven test for invalid actions: unknown size, bad planned or onTime, bad lootRoll, missing habitId or projectId, and an invalid rest-day date.
- A test that the terminal command exits with code 1 and writes to stderr on bad usage.
- A test that the live Settings.md is valid.
