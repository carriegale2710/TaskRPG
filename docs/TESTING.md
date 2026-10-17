# TaskRPG: Testing guide

Two ways to check the engine: automated tests in a terminal (every rule), and a short manual run inside Obsidian (the engine loading and working in the real app, including your phone).

## Task resolution and undo tests

TaskNotes owns task creation, planning, statuses, and the skill, size, urgent and important user fields. TaskRPG owns only `Task done` and `Undo last`. The old `New task` and `Plan task` macros have been removed.

`task-utils.test.js` tests pure helpers, including the TaskNotes scheduled-date mapping.

`task-undo-resolution.test.js` tests the shared duplicate-resolution guard:

- A task with no RPG resolution can be resolved.
- A second resolution is blocked while the latest relevant event is an unresolved `task_done`.
- An `undo` event releases the guard by following `targetEventId` to the original `task_done` event.
- An undo targeting another task does not release this task’s guard.
- Resolve → undo → resolve produces a fresh resolution marked `repeat` by the engine.
- The original `task_done` event remains in the log; undo appends a correction.

These tests import `hasUnresolvedTaskDone` from `Scripts/task-utils.js`, the same implementation used by `Scripts/task-done.js`. They are not evidence that the QuickAdd scripts work inside Obsidian or that TaskNotes preserves the required fields. To verify the integration, create and schedule a task in TaskNotes, mark it Done, run `Task done`, inspect the result, then run `Undo last`; check the result card or Notice on desktop and phone. Never point this check at an important task or concurrent synced devices: the Step 3 QuickAdd scripts write the live `Engine/Events.md`, while the Step 1 smoke test below uses `Engine/Test Events.md`.

Run from the vault folder with Node.js 22 or newer:

```sh
node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js Scripts/task-undo-resolution.test.js
```

Record manual check results and validation status in `docs/BUILD_PLAN.md` (Build status → Known gaps and validation status). Do not mark anything validated without a real test.

## 1. Automated tests

You need [Node.js](https://nodejs.org) 22 or newer. There is nothing to install: the tests use Node's built-in test runner.

Run these from the vault folder (the one containing `Scripts/` and `Engine/`).

```powershell
node --test Scripts/engine.test.js
```

A good run ends with `# fail 0`. Pass a directory to `--test` and Node 22 fails with "Cannot find module", so always give the file path.

| To do this                   | Run                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Run one test by name         | `node --test --test-name-pattern="undo" Scripts/engine.test.js`                                |
| Re-run on every file change  | `node --test --watch "Scripts/**/*.test.js"`                                                   |
| Rebuild the saved hero state | `node Scripts/engine.js recalc`                                                                |
| Use other files              | `node Scripts/engine.js recalc <events file> <settings note> <state file>`                     |
| See MP as of a given moment  | add `--now=2026-10-14T09:00:00+11:00` (MP refills at 4:00 AM, so this shows the next day's MP) |

`recalc` reads `Engine/Events.jsonl` (no file means a fresh hero) and `Engine/Settings.md`, then writes `Engine/State.json` and prints it. The same inputs always give the same output. Since Step 2 the live log is `Engine/Events.md`, so pass it explicitly when checking live data: `node Scripts/engine.js recalc Engine/Events.md Engine/Settings.md Engine/State.json`. This still does not rebuild the Meta Bind `Engine/Hero.md` note.

### What the tests cover

| Rule in the brief                           | Test name starts with                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| 4:00 AM day rollover                        | `day rolls over`                                                                      |
| MP max 10 and morning refill                | `MP is 10`                                                                            |
| Task MP by size, unplanned, Wounded         | `task MP cost`                                                                        |
| Level 5 and 10 MP discount, minimum 1       | `skill levels 5 and 10`                                                               |
| Overdraft: half XP, Tired −1                | `overdraft`                                                                           |
| Task XP and bonuses, weekly focus           | `task XP`, `weekly focus`                                                             |
| Habit XP, including at 0 MP                 | `habit XP`                                                                            |
| Levels and dice bonus                       | `levels at the XP thresholds`, `dice bonus stacks`                                    |
| Roll thresholds, threat, loot, no XP effect | `roll outcomes`, `project threat`, `loot`, `a roll never`                             |
| HP gain, loss, penalties, Wounded           | `HP:`, `HP never`, `missed deadline`, `dice penalty`, `Wounded`                       |
| Habit MP cost and eligible days             | `habit MP cost`, `habit measure`                                                      |
| Rest days and pause                         | `rest days`, `pause and resume`, `missed deadlines are exempt`                        |
| Settings changes (prospective, validated)   | `settings change`, `settings are validated`, `lowering max`, `the live Settings.md`   |
| Undo                                        | `undo`, `pressing Done again`                                                         |
| Undo-linked task resolution guard           | `task resolution`, `undo is linked`, `duplicate resolution guard`                     |
| Back-filling missed blocks                  | `back-fill`                                                                           |
| Bad logs, bad actions, log text, dice       | `bad logs`, `bad actions`, `event log text`, `localStamp`, `rollDice`, `an empty log` |
| Terminal gives identical results            | `recalc from the terminal`                                                            |
| Runs where there is no `fs` (phone)         | `the engine loads with no fs`                                                         |

Tests use fixed dates and fixed dice, so they give the same result on any machine and time zone. When you change a rule, change its test in the same edit. When you add a rule, add a test.

### Write the test first

The working rule is the `write-tests` skill — load it before the first test or engine change. The repo-specific default, the invariants that hold whether or not it is loaded, and the file layout and run commands below are in `AGENTS.md` (_Coding rules_). In practice, for this vault:

1. Add the test to the matching `Scripts/*.test.js`, or a new `*.test.js` for a new module, using fixed dates and fixed dice.
2. Run it and read the output: it must fail on the assertion you intended, not on a typo, a wrong path or a missing import. The test is the written acceptance criterion for the rule.
3. Change `Scripts/engine.js` (or the script under test) to make it pass. Do not delete, skip or loosen the assertion to get green.
4. Re-run the file and read the whole run. A change that was never seen failing is not yet evidence.
5. Prove the test bites: break the implementation on purpose (flip a boundary, move a threshold), confirm the test fails, then restore it. A test that survives a broken implementation is a vanity test.
6. For a bug, reproduce it as a failing test first, then fix the cause.

Failing tests for a feature that is not built yet are fine and useful — they are the to-do list, and they document what "done" means before any code exists. The one hard line is the merge to `main`: a PR doesn't merge while the tests for the feature it delivers are failing. Anything still unfinished moves to the backlog in `BUILD_PLAN.md` with the reason recorded. **Never** convert a red test to a skip just to get a green run.

The same idea applies to the manual checks below: write the steps and the expected notice, log line and file change before building the slice, then run it and record the real result.

### If a test fails

The runner prints `expected` and `actual`. Decide which is wrong. If the rule changed on purpose, update the test. If it didn't, fix `Scripts/engine.js`.

The rule tests run against a frozen copy of the starting settings at the top of `Scripts/engine.test.js`, not your live `Engine/Settings.md`, so tuning numbers in Obsidian never breaks them. Only `the live Settings.md is present and valid` reads the live file. If you change a default on purpose, update the frozen copy and the tests that depend on it in the same edit.

## 2. Manual test inside Obsidian

This checks that QuickAdd can run the engine and that it behaves in the real app. It uses a **test log** (`Engine/Test Events.md`), never your real log. This is the Step 1 smoke test, not the Step 3 workflow. Step 2 has a real habit button; `Scripts/engine-smoke.js` remains an isolated engine check.

### Before you start

| Plugin                 | Check                                                                                                        | Needed for this test                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **QuickAdd**           | Enabled. The Step 0 "hello" macro still shows its notice                                                     | Yes                                        |
| **Templater**          | Enabled                                                                                                      | No                                         |
| **Lazy Plugin Loader** | Enabled, and Obsidian still starts quickly                                                                   | No                                         |
| **Dice Roller**        | In a scratch note, type `` `dice: 2d6` `` and view it in Reading view: it shows a roll that changes on click | No (needed in Step 4 for generated tables) |
| **Meta Bind**          | Enabled                                                                                                      | No (needed in Step 2)                      |
| **TaskNotes**          | Enabled, and the built-in **Bases** core plugin is on (Settings → Core plugins)                              | Yes for Step 3                             |
| **Fit**                | Enabled, and it syncs your phone                                                                             | Only for the phone check                   |
| **Vault Operator**     | Enabled (desktop)                                                                                            | No (needed in Step 4)                      |

Step 1 itself only uses QuickAdd. The other rows are a quick "is it installed and enabled" pass.

### Set up the macro (once)

1. Settings → **QuickAdd** → **Add Choice**. Name it `TaskRPG: engine check`, choose **Macro**, and click **Add Choice**.
2. Click the **gear** beside it to open the macro. Under _User scripts_ (or **Add user script** in the command bar), pick `Scripts/engine-smoke.js`, then close it.
3. Click the **lightning bolt** beside the choice so it appears in the command palette.
4. Run it: command palette → `QuickAdd: TaskRPG: engine check`. A list opens with **Recalculate**, **Log a test habit**, **Log a test task** and **Undo last**.

Each run ends with a notice showing the result and `HP x/10, MP x/10`, and rewrites `Engine/Test State.md` (the saved state).

If QuickAdd says the script isn't found, the script isn't in a visible, non-hidden folder or the path is wrong. If you see `TaskRPG engine: …`, that's the engine reporting a problem; read the message.

### Checks

Do these in order. Open `Engine/Test Events.md` and `Engine/Test State.md` in a pane beside the note to watch them change.

| #   | Do this                                                                                                            | You should see                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Recalculate** with no test log                                                                                   | Notice `Recalculated. HP 10/10, MP 10/10`. `Test State.md` is created with all skills at level 1. No `Test Events.md` yet                                                                      |
| 2   | **Log a test habit**                                                                                               | Notice includes `mpCost: 2, mp: 8, xp: 1` and `MP 8/10`. A new habit costs 2 MP. `Test Events.md` has two lines: a long `settings_changed` line, then `habit_done`. `vitality` XP is 1         |
| 3   | **Log a test task**                                                                                                | Notice shows the roll `total`, an `outcome` (success, partial or setback), `mpCost: 1`, `xp: 1`, `loot`. MP is now 7. Press it a few times: the outcome and `loot` vary, the cost and XP don't |
| 4   | **Undo last**                                                                                                      | MP goes back up by the task's cost. A new `undo` line is added. **No line is removed or changed**                                                                                              |
| 5   | **Undo last** again, then once more                                                                                | The habit is undone (MP 10). The third press shows `Nothing to undo for this game day.` and adds nothing                                                                                       |
| 6   | Edit `Engine/Settings.md`: change `"small": { "mp": 1` to `"mp": 2`, then **Log a test task**                      | Notice shows `mpCost: 2`. `Test Events.md` gains a second `settings_changed` line before the task. The earlier lines are untouched. Set it back to 1 afterwards                                |
| 7   | In `Settings.md`, set `"maxMP": 0`, then run any option                                                            | Notice names the setting: `Settings: maxMP must be a whole number from 1 to 100.` Nothing is added to the log. Put it back to 10                                                               |
| 8   | Add the line `not json` to the end of `Test Events.md`, then **Recalculate**                                       | Notice `Event log line N is not valid JSON`, with the right line number. Remove the line                                                                                                       |
| 9   | Change a habit or task line's date to yesterday (keep the format), then **Recalculate**                            | MP shows 10/10 (a new game day refills it). Undo no longer works on yesterday's actions                                                                                                        |
| 10  | Change a line's time to `03:59` today, then **Recalculate**                                                        | In `Test State.md`, `"day"` is yesterday's date. At `04:00` it is today's date                                                                                                                 |
| 11  | In a terminal: `node Scripts/engine.js recalc "Engine/Test Events.md" Engine/Settings.md "Engine/Test State.json"` | The printed state matches the JSON in `Test State.md` (when both are on the same game day). Delete `Test State.json` afterwards                                                                |

Checks 9 and 10 edit the test log by hand. That is the one time you should: the real log is append-only.

### On your phone

1. Wait for Fit to sync the `Scripts/` folder, `Engine/Settings.md` and the test notes.
2. QuickAdd settings aren't synced by default. Opt them in, or recreate the macro from the steps above on the phone.
3. Run **Recalculate**, then **Log a test habit**.
4. Record what happened (works, notice missing, error text) in your notes. Mobile support for QuickAdd macros is unverified until you do this.

The engine needs no Node features, so it should run on mobile. The check is whether QuickAdd runs the script there. If it doesn't, tell the coding agent: Step 2 has a fallback plan (log on desktop, use a catch-up button).

### Clean up

Delete `Engine/Test Events.md`, `Engine/Test State.md` and any `Engine/Test State.json`. The real log and state are never touched by this test.

### Known limits of this test

- `.jsonl` files don't show in Obsidian's file list, which is why the test log is a `.md` note. The engine accepts either. The live log selected in Step 2 is `Engine/Events.md`.
- The first log line is long because it saves a full copy of the settings. That is how a later settings change keeps old days on old rules.
- Back-filling missed habit blocks, rest days, pause, the weekly focus project and project threat aren't exposed in this test script. They're covered by the automated tests; no vault UI for these actions is verified here.
