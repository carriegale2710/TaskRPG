# TaskRPG: Testing guide

Two checks: automated terminal tests (every rule) and a short manual run inside Obsidian (engine loading and working in the real app, including phone).

## Task resolution and undo tests

TaskNotes owns task creation, planning and user fields. TaskRPG owns only `Task done` and `Undo last`, including the `done`/`open` status writes.

`task-utils.test.js` covers pure helpers: planned-today game-day checks, and completion-field updates (missing-field insertion, frontmatter-only edits, literal `$`, undo reopening with `status: open`, CRLF), and habit history-line removal matched by timestamp (other lines untouched, CRLF).

`task-utils.test.js` also covers the planned-task check used by `task-done.js`:

- `isPlannedToday()` matches date-only, datetime and quoted `scheduled` values; missing or empty values are unplanned. `scheduledDate()` has no direct test.
- `isPlannedToday()` compares the date with `engine.gameDay(timestamp, settings.dayRolloverHour)`, so the engine owns the rollover rule.
- At 01:00 with a 04:00 rollover, the previous calendar date is still the current game day; at 04:00, the game day flips.

`task-utils.test.js` also covers result presentation:

- `pickTableResult()` returns the table entry for rolls 1 to 6. Any other roll (0, 7, negative, non-integer, string, `NaN`, `Infinity`, `null`, `undefined`, array) throws `Table roll must be 1 to 6.` An unknown outcome, including inherited names such as `constructor` and `__proto__`, throws `Unknown outcome` before the roll is checked.
- Every outcome table has six non-empty entries. Sweeping all 36 dice pairs through `engine.recordAction` returns exactly the outcomes that have a table, so no outcome lacks a table and no table is unreachable.
- `formatResultCard()` is checked line by line, with the Tired line before the loot line and both after the MP line. A paid cost shows `MP: -3`; a free action shows `MP: 0`, not `-0`.

`task-done.test.js` runs the real `TaskRPG/Scripts/task-done.js` against an in-memory vault whose note sits in `TaskNotes/Tasks/…` (folder from TaskNotes `data.json`).

- Checks the `task_done` event, completion fields, and rewritten `TaskRPG/Engine/Hero.md` (derived HP, MP, skill XP).
- One test starts at `status: open` and asserts the script overwrites it with `done`. Another asserts the result card is exactly one Notice containing `**Outcome:**` (D-025).
- Proves the script refuses a note whose `skill` or `size` is absent or empty, or whose `taskId` is absent, empty, `""`, `null`, YAML `~` or the word `undefined`, leaving log and note untouched.
- A second task note sharing the pressed note's `taskId` makes the script stop with "Change taskID to prevent duplicate id, nothing was saved." and write nothing (D-033); a note with a different `taskId` does not block it.
- `event log shapes` seeds `Events.md` empty, with trailing blank lines and with CRLF, and asserts the earlier events parse unchanged and exactly the expected events are appended. CRLF lines are not rewritten; the new line is LF.

`habit-done.test.js` runs the real `TaskRPG/Scripts/habit-done.js`: quoted, CRLF and BOM-prefixed habit notes are read, and notes without a valid `habitId` or `skill` are rejected.

A note is a task only when it carries TaskNotes' configured `taskTag`.

`undo.test.js` also covers the shared duplicate-resolution guard (`hasUnresolvedTaskDone`, the same helper `task-done.js` calls). Its `engine round trip` tests build the log with the real engine: `engine.recordAction`, serialised as JSON lines, read back with `engine.parseEvents`, then passed to the guard. Assertions use event types and ids, not event counts.

- Unresolved task can be resolved.
- Second resolution blocked while the latest relevant event is an unresolved `task_done`.
- `undo` releases the guard by following `targetEventId`, not `taskId`.
- Undo of another task does not release this task's guard; with interleaved tasks, each undo releases only the task it targets.
- A fresh resolution after an undo stays blocked until that new `task_done` is itself undone; done, undo, done, undo ends unblocked.
- `habit_done` events never affect the guard, and an undo that targets a habit does not release a task.
- Hand-built logs the engine rejects (an undo with a dangling `targetEventId`, an undo listed before its target): `recalculate` throws, and the guard, which reads the log in file order, keeps the task blocked.
- An empty, `null` or `undefined` id never matches a real task's events.

Undo reaches only the current game day (PRD 3.17). `undo.test.js` proves what happens when the only action is from an earlier game day: `recordAction` throws `Nothing to undo for this game day.`, nothing is appended, and the guard keeps blocking `Task done` for that `taskId`. `engine.test.js` covers an explicit target from an earlier action or day. Before the 4:00 AM rollover the previous calendar day is still the current game day, so undo still works then. There is no supported way yet to re-resolve a task whose resolution is from an earlier game day; that is an open question, not tested behavior.

`task-utils.test.js` (`findTaskNote` suite) covers the shared `findTaskNote()` lookup that both scripts use: one match is `found` with its path, no match is `not_found`, a missing folder is `folder_missing`, several matches are `ambiguous` with no path, and non-`.md` files are ignored.

`undo.test.js` covers undo itself against the real script; `engine.test.js` and `task-done.test.js` cover the repeat flag and the preserved original `task_done`:

- Real `TaskRPG/Scripts/undo.js` against an in-memory adapter writes `status: open` and `completedDate: ""`, leaves a second Done note untouched, appends `undo`, rewrites `TaskRPG/Engine/Hero.md`.
- Habit undo removes the history line the undone press added (matched by timestamp), leaves other habit lines and task notes untouched, and the Notice says the line was removed.
- Four error paths: a task undo and a habit undo with no matching note still append the correction and say so in the Notice; a missing TaskNotes tasks folder does the same with its own message; two task notes sharing the target's `taskId` write nothing (no `undo` event, no note or `Hero.md` change) and the Notice says to change the `taskID` (D-033). Seven script-level tests run the real `undo.js`, four of them error paths.

The guard tests import `hasUnresolvedTaskDone` from `TaskRPG/Scripts/task-utils.js`, the same implementation `task-done.js` uses. The stubbed-vault tests run the real `undo.js` path, but prove nothing about QuickAdd inside Obsidian or TaskNotes field preservation. For that: create and schedule a task, mark it Done, run `Task done`, inspect, run `Undo last`; check desktop and phone. Never point this at an important task or concurrent synced devices: Step 3 writes the live `TaskRPG/Engine/Events.md`.

Story rollback is specified in PRD 3.17 and has no tests yet: a line-tag helper must prove matching lines are removed, untagged neighbours and malformed tags survive, tags outside the four story folders are ignored, and CRLF is preserved. Until that helper exists, an undo removes no story prose, and no test may claim it does.

Run from the vault folder, Node.js 22+:

```sh
node --test
```

Each test file wraps tests in a `describe()` named after the file, so output groups by file (spec reporter prints `▶ engine.test.js`; TAP nests the same name). Keep a file's tests in its one `describe()` block; do not rename it.

Record manual results in `docs/BUILD_PLAN.md` (Known gaps and validation status). Never mark validated without a real test.

## 1. Automated tests

Node.js 22+. Nothing to install; Node's built-in runner.

```powershell
node --test TaskRPG/Scripts/engine.test.js
```

A good run ends `# fail 0`. Passing a directory to `--test` fails on Node 22 with "Cannot find module"; always give the file path.

| To do this                   | Run                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Run one test by name         | `node --test --test-name-pattern="undo" TaskRPG/Scripts/engine.test.js`                 |
| Re-run on every file change  | `node --test --watch "**/*.test.js"`                                                    |
| Rebuild the saved hero state | `node TaskRPG/Scripts/engine.js recalc`                                                 |
| Use other files              | `node TaskRPG/Scripts/engine.js recalc <events file> <settings note> <state file>`      |
| See MP at a given moment     | add `--now=2026-10-14T09:00:00+11:00` (4:00 AM refill, so this shows the next day's MP) |

`recalc` reads `TaskRPG/Engine/Events.jsonl` (none = fresh hero) and `TaskRPG/Engine/Settings.md`, writes `TaskRPG/Engine/State.json`, prints it. Same inputs, same output. Since Step 2 the live log is `TaskRPG/Engine/Events.md`, so pass it explicitly: `node TaskRPG/Scripts/engine.js recalc TaskRPG/Engine/Events.md TaskRPG/Engine/Settings.md TaskRPG/Engine/State.json`. It does not rebuild the Meta Bind `TaskRPG/Engine/Hero.md`.

### What the tests cover

| Rule                                                                             | Test name starts with                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 4:00 AM day rollover                                                             | `day rolls over`                                                                                                                                                                                                         |
| MP max 10 and morning refill                                                     | `MP is 10`                                                                                                                                                                                                               |
| Task MP by size, unplanned, Wounded                                              | `task MP cost`                                                                                                                                                                                                           |
| Planned task uses game day; datetime/quoted `scheduled`; missing/empty unplanned | `planned today`, `uses the engine rollover hour`, `matches a scheduled value`, `treats missing or empty scheduled`                                                                                                     |
| Level 5 and 10 MP discount, minimum 1                                            | `skill levels 5 and 10`                                                                                                                                                                                                  |
| Overdraft: half XP, Tired −1                                                     | `overdraft`                                                                                                                                                                                                              |
| Task XP and bonuses, weekly focus                                                | `task XP`, `weekly focus`                                                                                                                                                                                                |
| Habit XP, including at 0 MP                                                      | `habit XP`                                                                                                                                                                                                               |
| Levels and dice bonus                                                            | `levels at the XP thresholds`, `dice bonus stacks`                                                                                                                                                                       |
| Roll thresholds, threat, loot, no XP effect                                      | `roll outcomes`, `project threat`, `loot`, `a roll never`                                                                                                                                                                |
| HP gain, loss, penalties, Wounded                                                | `HP:`, `HP never`, `missed deadline`, `dice penalty`, `Wounded`                                                                                                                                                          |
| Habit MP cost and eligible days                                                  | `habit MP cost`, `habit measure`                                                                                                                                                                                         |
| Rest days and pause                                                              | `rest days`, `pause and resume`, `missed deadlines are exempt`                                                                                                                                                           |
| Settings changes (prospective, validated)                                        | `settings change`, `settings are validated`, `lowering max`, `the live Settings.md`                                                                                                                                      |
| Undo                                                                             | `undo`, `pressing Done again`                                                                                                                                                                                            |
| Undo-linked task resolution guard                                                | `engine round trip`, `undo for a previous game day`, `guard on hand-built log shapes`, `duplicate-resolution guard` (suite names in `undo.test.js`)                                                                       |
| Result card and outcome tables                                                   | `result presentation` (suite name in `task-utils.test.js`)                                                                                                                                                               |
| Duplicate `taskId` blocks Undo and Task done                                     | `refuses to resolve a task whose taskId is shared`, `undo with duplicate taskId`, `returns ambiguous`                                                                                                                    |
| `Events.md` empty, trailing blank lines, CRLF                                    | `appends to a log with`                                                                                                                                                                                                  |
| Task folder from TaskNotes data                                                  | `taskFolder`, `configured TaskNotes folder`                                                                                                                                                                              |
| Task tag from TaskNotes data                                                     | `taskTag`, `task tag`, `refuses a note`                                                                                                                                                                                  |
| `Task done` writes `done`                                                        | `status done over`                                                                                                                                                                                                       |
| Back-filling missed blocks                                                       | `back-fill`                                                                                                                                                                                                              |
| Bad logs, actions, log text, dice                                                | `bad logs`, `bad actions`, `event log text`, `localStamp`, `rollDice`, `an empty log`                                                                                                                                    |
| Terminal gives identical results                                                 | `recalc from the terminal`                                                                                                                                                                                               |
| Runs without `fs` (phone)                                                        | `the engine loads with no fs`                                                                                                                                                                                            |

Fixed dates and fixed dice, so results are machine- and time-zone-stable. Change a rule, change its test in the same edit. Add a rule, add a test.

### Write the test first

Steps:

1. Add the test to the matching `TaskRPG/Scripts/*.test.js` (or a new file for a new module), fixed dates and dice, inside that file's `describe()`.
2. Run it. It must fail on the intended assertion, not a typo, wrong path or missing import.
3. Change `TaskRPG/Scripts/engine.js` (or the script under test). Never delete, skip or loosen an assertion.
4. Re-run the file; read the whole run.
5. Prove it bites: break the implementation, confirm red, restore.
6. Bug: reproduce red first, then fix the cause.

Red tests for unbuilt features are the to-do list and document "done" before code exists. The hard line is the merge to `main`: a PR does not merge with tests failing for what it delivers. Unfinished work moves to the backlog in `BUILD_PLAN.md` with the reason. **Never** turn red into a skip for a green run.

Manual checks follow the same rule: write steps and expected notice, log line and file change before building the slice, then record the real result.

### If a test fails

Runner prints `expected` and `actual`. Decide which is wrong. Rule changed on purpose: update the test. It didn't: fix `TaskRPG/Scripts/engine.js`.

Rule tests run against a frozen copy of the starting settings at the top of `TaskRPG/Scripts/engine.test.js`, not the live `TaskRPG/Engine/Settings.md`, so tuning in Obsidian never breaks them. Only `the live Settings.md is present and valid` reads the live file. Change a default on purpose: update the frozen copy and dependent tests in the same edit. `undo.test.js` keeps its own copy of that frozen block because `engine.test.js` does not export it; update it too.

## 2. Manual test inside Obsidian

Checks QuickAdd runs the real macros (`Task done`, `Undo last`, the habit button) in the real app. Use disposable notes; never an important task or concurrent synced devices.

### Before you start

| Plugin                 | Check                                                                | Needed here        |
| ---------------------- | -------------------------------------------------------------------- | ------------------ |
| **QuickAdd**           | Enabled. Step 0 "hello" macro still shows its notice                 | Yes                |
| **Templater**          | Enabled                                                              | No                 |
| **Lazy Plugin Loader** | Enabled, Obsidian still starts quickly                               | No                 |
| **Dice Roller**        | Scratch note, `` `dice: 2d6` ``, Reading view: roll changes on click | No (Step 4 tables) |
| **Meta Bind**          | Enabled                                                              | No (Step 2)        |
| **TaskNotes**          | Enabled; core **Bases** plugin on (Settings → Core plugins)          | Yes for Step 3     |
| **Fit**                | Enabled and syncing the phone                                        | Phone check only   |
| **AI agent host**      | Chosen host enabled (desktop); record name and version               | No (Step 4)        |

Each row is an "is it installed and enabled" pass.

### Step 3 planned-task check

Uses the real `Task done` workflow and a disposable task note. Do not use the live `TaskRPG/Engine/Events.md` with an important task or concurrent synced devices.

| #   | Do this                                                                                          | You should see                                         |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1   | Create a task scheduled for the current game day, using `YYYY-MM-DDTHH:mm`, then run `Task done` | Task costs only its size MP: no unplanned surcharge    |
| 2   | Create a task with no `scheduled` field, then run `Task done`                                    | `planned` is false; the unplanned MP surcharge applies |
| 3   | Before `dayRolloverHour`, schedule a task for yesterday's calendar date, then run `Task done`    | It counts as the current game day and is planned       |

### On your phone

1. Wait for Fit to sync `TaskRPG/Scripts/`, `TaskRPG/Engine/Settings.md`.
2. QuickAdd settings do not sync by default. Opt in, or recreate the macros on the phone.
3. Run `Task done` on a disposable task, then `Undo last`.
4. Record what happened (works, missing notice, error) in your notes. Mobile QuickAdd support is unverified until you do.

The engine needs no Node features, so it should run on mobile. The check is whether QuickAdd runs the script there. If not, report it: Step 2 has a fallback (log on desktop, catch-up button).

### Known limits

- `.jsonl` files do not show in Obsidian's file list, hence the `.md` live log. The engine accepts either. The live log is `TaskRPG/Engine/Events.md`.
- The first log line is long because it saves the full settings, so later changes keep old days on old rules.
- Back-filling missed habit blocks, rest days, pause, weekly focus and project threat have no manual vault check. Automated tests cover them.
- The planned-task rollover boundary is tested through `isPlannedToday()` in `task-utils.test.js`. `task-done.test.js` uses the current game day but does not simulate a fixed pre- or post-rollover completion time, because `task-done.js` reads the current time through `engine.localStamp()`.
