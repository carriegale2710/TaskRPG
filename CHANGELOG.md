# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Nothing has been committed or tagged yet, so everything below sits under **Unreleased**. Once Step 1 is committed, rename the section to a version number (for example `0.1.0`) and add the date.

## [0.1.0] - 2026-10-14

### Added—Step 1: engine and tests

#### Engine (`Scripts/engine.js`)

- Dependency-free game engine with no Obsidian code. It takes the event log plus the settings note and returns the new state and the result of an action.
- The engine loads without `fs`, `path` or `require`, so it can run on the phone.
- Terminal command `node Scripts/engine.js recalc` rebuilds state from the log. It prints the same state on repeat runs. On bad usage it exits with code 1 and writes to stderr.
- **Time:** the day rolls over at 4:00 AM.
- **MP**
  - Maximum 10, refilled each morning.
  - Task cost by size: small 1, medium 3, large 5.
  - Surcharges: +1 for an unplanned task, +1 for every task while Wounded.
  - Discounts: −1 at skill levels 5 and 10 (in that skill only). A task never costs less than 1.
  - Overdraft: a task counts as overdraft when its cost is more than the remaining MP. Overdraft halves XP (rounded up) and adds a −1 "Tired" roll penalty. HP is unaffected.
  - Habit cost by the share of eligible days in the last 30 that were done on time: under ⅓ costs 2 MP, ⅓ to under ⅔ costs 1 MP, ⅔ or more costs 0 MP. A new habit starts at 2 MP.
  - Eligible days are weekdays that are not rest or pause days. A weekend, rest or pause day counts only if the habit was done.
- **XP and levels**
  - Task XP equals its size, plus 50% if important, plus 50% if urgent, plus 25% for the weekly focus project. The bonuses add together and the result is rounded up.
  - Habit XP is 1 per press, including at 0 MP.
  - Five skills with 10 levels each. The XP thresholds are placeholders held in the settings note (level 2 at 10 up to level 10 at 320).
  - Dice bonus of +1 at levels 2, 4, 6, 8 and 10.
- **Roll:** 2d6 plus the skill's dice bonus, minus the HP penalty and the Tired penalty.
  - Base thresholds: success at 9+, partial success at 6–8, setback at 5 or less.
  - Each project has a threat level of +1 per finished arc, capped at +4. It raises every threshold. Tasks outside a project use T = 0.
  - A success has a one-in-three chance of loot (a die roll where 5 or 6 drops). The engine only flags the drop. The narrator names it later.
  - A roll never changes the XP or MP of the real task.
- **HP**
  - Maximum 10. An on-time core habit restores 1 HP. A late press earns XP but no HP and doesn't count as an on-time day.
  - A missed block deadline costs 1 HP, capped at 2 HP lost per day. Rest days, pause and weekends are exempt.
  - Dice penalty: 7–10 HP is 0, 4–6 is −1, 1–3 is −2, 0 is −3.
  - At 0 HP you are Wounded: tasks cost +1 MP and boss challenges are blocked.
  - Missed blocks are back-filled when the vault opens.
- **Rest and pause**
  - Rest day: a one-day pass, 4 a month, with no HP loss and no plan needed.
  - Pause: freezes the game with no HP loss. Paused days are left out of every habit's measure.
- **Settings changes:** each change is logged with the time it was recorded. The engine uses the rules in force on each day and never rewrites the past. Editing the note without recording an action does not change the past.
- **Undo:** adds a correcting line to the log and nothing is deleted. It only reverses the newest task or habit action from the same game day, and it can't be used to re-roll. Pressing Done again after an undo gets a fresh roll, flagged `repeat`.

#### Data files

- **Event log:** one shared, append-only JSON Lines file with one line per action (date, time, type, skill, size, roll, outcome, XP, MP). Events are replayed in timestamp order, so a back-filled missed deadline is appended rather than inserted.
- `Engine/Settings.md` holds every tunable number in a JSON block. The engine rejects out-of-range values and names the setting that is wrong.
- `Engine/State.json` is written by `recalc`. It is the saved copy that the Step 2 hero note and Meta Bind panels will read.

#### Tests

- `Scripts/engine.test.js`, run with `node --test Scripts/engine.test.js`.
  - Covers one test per rule in the brief, plus settings changes, undo, the day boundary, back-filling and the terminal run.
  - The first build passed 30 of 30.
- Settings validation tests for `taskSizes`, `lootDropRolls`, `hpPenalties` and `habitTiers`.
- A table-driven test for invalid actions: unknown size, bad `planned` or `onTime`, bad `lootRoll`, missing `habitId` or `projectId`, and an invalid rest-day date.
- A test that the terminal command exits with code 1 and writes to stderr on bad usage.
- A test that the live `Settings.md` is valid.

### Changed

- **Test suite merged.** The original 30-test suite and a second 42-test suite were merged into one file of 43 tests, with no coverage lost.
  - The merged suite uses the second suite's frozen settings copy. When you change a default on purpose, update that copy.
  - Kept from the original suite: event log text parsing (including `line 2 is not valid JSON`), `localStamp`, and the check that the engine loads with no `fs`, `path` or `require`.
  - Folded together: Wounded at 1 HP now sits inside the task MP cost test, the own-skill MP discount is part of the skill level test, the rest-day monthly reset is part of the rest days test, and the two `rollDice` tests are now one.
  - Removed as duplicates: the extra `bonus(5)` dice check, the next-week focus lines in the XP test (the weekly-focus test covers them), and a repeated Wounded MP assertion.
  - The undo test now matches the full error message. Its two failing cases each break one rule. Both rules share one message, so the setup tells them apart, as a comment in the test explains.
- **Settings format:** the settings note is a JSON block instead of the PRD's table with min and max beside each value. This follows the choice of JSON Lines for the event log, and it will need revisiting when Step 2 adds Meta Bind fields.
- `TESTING.md` is updated: the test-name table is current, and the note that tests read the live `Settings.md` now says they use the frozen copy.
- The old suite is backed up at `files\engine.test.old.js` in the session folder. The test file is untracked in git.

### Quality checks

- 43 of 43 tests pass.
- `engine.js` coverage: 100% of lines, 96% of branches.
- Before the merge, the second suite left 5 chunks of `engine.js` uncovered.
- Mutation check: 12 deliberate engine breaks were run against the merged suite and all 12 were caught. Examples: the Wounded surcharge applying at 1 HP, MP discounts using the wrong skill, and the rest-day limit not resetting monthly. A 13th break changed no behaviour, so it was not counted.

### Known issues

- **Back-fill uses the wrong rules for old events.** An event dated before the first `settings_changed` entry gets today's rules instead of the rules in force on that day. `engine.js` was not changed, and there is no test for this yet because it would fail until the engine is fixed. A fix and a regression test are pending a decision.

### Open questions

1. **MP discount at levels 5 and 10:** treated as cumulative, so level 10 takes off 2 MP. If exactly 1 MP off at both levels was intended, it is a one-line change.
2. **Repeat press after an undo:** the PRD says it gets a fresh roll logged as a repeat, but not whether it earns full XP. It currently does.

### Not yet built

- Boss challenges and inventory. Loot is only flagged on the roll result.
- Macros and plugin wiring, which wait for Step 2 (hero note and Meta Bind panels).
