# Step 3: Task creation, planning, completion and undo

Issue #3 implementation is on `feat/3-task-creation-planning-completion-undo` (draft PR #10). This document describes the current code, not a verified Obsidian integration. No Step 3 desktop or phone test result has been recorded. Do not start Step 4 until Step 3 has been validated.

## Set up in Obsidian

Pull the feature branch into the vault and configure four QuickAdd **Macro** choices with one **User Script** action each. Enable their lightning-bolt commands; QuickAdd configuration is device-local unless explicitly synced. Use the QuickAdd commands directly as the initial controls; a Meta Bind button beside backlog tasks has **not** been added.

| QuickAdd choice | Script | Current action |
| --- | --- | --- |
| New task | `Scripts/new-task.js` | Prompts for name, a skill from `Engine/Settings.md`, a size from `taskSizes`, then urgent and important; writes `TaskNotes/<slug>.md` |
| Plan task | `Scripts/plan-task.js` | With a `TaskNotes/*.md` task open, sets its status to `planned` and `plannedDate` to the device's current calendar date |
| Task done | `Scripts/task-done.js` | With a task open, records an engine `task_done` event, marks the note completed and attempts to display the result |
| Undo last | `Scripts/undo-last.js` | Appends a correcting engine event for today's newest task or habit action; restores a matching task note if found |

`Backlog/` is currently empty; New task creates notes directly under `TaskNotes/`. There is no built-in today-list view or per-backlog-task button in this branch. To try planning, open the task note and invoke the QuickAdd command.

## What the scripts currently do

- New task derives the skill and size choices from settings. It counts existing `TaskNotes/*.md` notes to label the most-used size for that skill as `(usual)`; when there is no history, it labels `medium`. This is a label only: the size suggester is not preselected. The task note has `type: task`, `taskId`, `name`, `skill`, `size`, urgent/important booleans, `status: backlog`, and planning/completion dates. Verify that your installed TaskNotes version recognises these direct-written fields; it has not been checked.
- Planning writes the task note only. It does not emit an engine event. The script regards a task as planned for completion only if `status` is `planned` and `plannedDate` matches the current calendar date; otherwise the engine applies the unplanned MP cost.
- Completion uses the standalone engine to roll 2d6 and a loot die, apply settings-driven MP/XP and determine success, partial success or setback. A six-entry placeholder message per outcome is selected using the same loot die; this is not a Dice Roller table integration. The event is written to `Engine/Events.md` before the task note changes. The card shows the dice, total, outcome, placeholder text, XP/MP and loot flag. The current `obsidian.Modal` access has not been verified in QuickAdd on desktop or phone; a 15-second Notice is the attempted fallback. Result text is not separately persisted in the task note. The macro does not rebuild `Engine/Hero.md` after completing a task.
- Undo uses the engine's same-game-day newest-action rule (the game day rolls over at 4:00 AM). It appends a correcting line without removing a prior roll. For a task, it tries to restore the note's status and clear `completedDate`. It does not rebuild `Engine/Hero.md`; undoing a habit also does not remove its habit-note history line. The current code does not prevent pressing Task done again after undo; the engine can flag such a later action as a repeat with a new roll. **Do not use undo to re-roll.**

The scripts use the vault adapter to rewrite the event log when recording an action. Use only one writer/device at a time and resolve Fit conflicts before the next press. If the log was saved but a later note/display write failed, do not press again: inspect the log and repair the derived note from it. `node Scripts/engine.js recalc` still defaults to `Engine/Events.jsonl`, not the live `Engine/Events.md`, and writes `Engine/State.json`, not the Meta Bind hero display.

## Automated checks

From the vault root with Node.js 22 or newer:

```sh
node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js
```

`Scripts/task-utils.test.js` contains unit tests for frontmatter helpers, note generation, size counts, table selection, card text and status replacement. It does **not** exercise the four QuickAdd macros end to end, TaskNotes compatibility, Obsidian's modal, the phone fallback, or hero-state updates. Do not report a pass until the command has actually been run; no run result is recorded for this branch.

## Manual validation gate

1. Confirm issue #2's habit-button desktop/phone validation first; `STEP2.md` still records that as pending.
2. Configure the four QuickAdd choices and open a disposable test task in Obsidian. Avoid testing against important real tasks or unsynced live history.
3. Run New task and inspect the new file and TaskNotes views. Verify all fields, default `medium` label and most-used-size label with test examples.
4. Open the backlog task, run Plan task, and check the note's status/date and whether the installed TaskNotes views show it on today's list. Report if no such view exists.
5. Run Task done once. Compare `Engine/Events.md` with the task note, inspect MP/XP against engine rules, and check the card/Notice text and dismissal. Check whether `Engine/Hero.md` reflects the result; it currently is not rewritten by this macro.
6. Run Undo last once. Confirm an `undo` line was appended, the task note returned to an open state, and the event log retained the original dice. Check the hero display; it currently is not refreshed. Do not press Done again to seek a new result.
7. Repeat the result-card check on the phone after syncing scripts and QuickAdd configuration. Record device, Obsidian/QuickAdd/TaskNotes versions, whether the modal or Notice appeared, and any exact error. Do not claim mobile support until observed.

Record observations in `TESTING.md`. Leave PR #10 draft until blockers and manual validation are resolved. An issue checkbox should not be checked just because a script exists.
