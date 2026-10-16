# Step 3: TaskNotes-wrapped task resolution and undo

Issue #3 has been redesigned: **TaskNotes owns task creation, planning, statuses, and task fields. TaskRPG owns only task resolution (`Task done`) and undo.** The old `New task` and `Plan task` QuickAdd macros have been removed.

This documentation describes the current code. The automated regression suite passes, including the undo-linked duplicate-resolution guard. It is **not** a verified Obsidian integration: no Step 3 desktop or phone test result has been recorded. Do not start Step 4 until Step 3 has been validated in Obsidian.

## Ownership

| Concern                               | Owner                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Create a task                         | TaskNotes                                                                 |
| Plan or schedule a task               | TaskNotes                                                                 |
| Task status                           | TaskNotes, with TaskRPG writing only its resolution-related status change |
| Skill, size, urgent, important        | TaskNotes custom user fields                                              |
| urgent / important filters            | TaskNotes `tags` user field                                               |
| Dice, XP, MP, event log, result card  | TaskRPG engine and `Scripts/task-done.js`                                 |
| Undo the RPG event                    | TaskRPG engine and `Scripts/undo-last.js`                                 |
| Automatic resolution on status change | Optional phase 2: TaskNotes Workflows                                     |

## ~~TaskNotes setup~~

Configure TaskNotes so each task note has:

- [x] A stable `taskId`.
- [x] A `skill` user field matching `Engine/Settings.md`.
- [x] A `size` user field matching `taskSizes` in settings.
- [x] Uses `urgent` and `important` tags.
- [x] A scheduled date field used for planning.
- [x] Status values that include an open/planned state and a completed state.

Example TaskNotes note configuration:

```yaml
status: open
priority: normal
due: 2026-10-17
scheduled: 2026-10-16
dateCreated: 2026-10-16T06:51:46.992+11:00
dateModified: 2026-10-16T06:51:46.992+11:00
tags:
  - task
  - important
  - urgent
skill: vitality
size: small
taskId: "1"
```

## ~~QuickAdd macros~~

Configure two QuickAdd **Macro** choices, each with one **User Script** action. Enable their lightning-bolt commands. QuickAdd configuration is device-local unless explicitly synced.

| QuickAdd choice | Script                 | Action                                                                                                                                                   |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task done       | `Scripts/task-done.js` | With a TaskNotes task open, records an engine `task_done` event, rolls 2d6 and a loot die, applies XP/MP, marks the note completed, and shows the result |
| Undo last       | `Scripts/undo-last.js` | Appends a correcting engine event for today’s newest task or habit action and restores a matching task note if found                                     |

## Phase 1 trigger

~~1. Create and plan the task in TaskNotes.~~
~~2. When the work is finished, mark it Done in TaskNotes.~~ 3. Run **Task done** while that task note is open. #FIXME 4. If needed, run **Undo last** to reverse the RPG event. 5. If the undo was intentional, run **Task done** again to make a fresh resolution. The engine records it as a repeat.

TaskRPG does not create tasks or plan them in this phase.

## Phase 2 trigger: optional

Later, TaskNotes Workflows may invoke `/task-done` automatically when a task moves from In Progress to Done. This is not implemented or validated in this branch. Until then, use the manual **Task done** command.

## What the scripts do

- **Task done** requires an open note in `TaskNotes/`. It reads the task’s mapped fields, validates skill and size against settings, determines whether the TaskNotes scheduled date is today, rolls through the engine, appends the event to `Engine/Events.md`, then updates the note’s completion fields.
- A task scheduled for today avoids the unplanned MP surcharge. A task without today’s scheduled date receives the engine’s unplanned cost.
- The result card uses the same loot die to select from a six-entry placeholder outcome table. This is not a Dice Roller table integration.
- **Undo last** uses the engine’s same-game-day newest-action rule. It appends an `undo` event without removing the original roll. For a task, it clears `completedDate` and restores an open/planned status based on the TaskNotes scheduled date.
- The duplicate-resolution guard follows `undo.targetEventId` back to the original `task_done` event. After a valid undo, the same task can be resolved again; the engine marks that later resolution as a repeat. An undo for a different task does not release this task’s guard.
- Undo does not rebuild `Engine/Hero.md` and does not remove habit-note history. **Do not use undo to re-roll.**

## Automated checks

From the vault root with Node.js 22 or newer:

```sh
node --test Scripts/engine.test.js Scripts/habit-done.test.js Scripts/task-utils.test.js Scripts/task-undo-resolution.test.js
```

All of these tests pass on this branch.

`Scripts/task-utils.test.js` covers frontmatter parsing, scheduled-date mapping, outcome-table selection, result-card formatting, and completion-field updates.

`Scripts/task-undo-resolution.test.js` covers the shared `hasUnresolvedTaskDone` guard, `targetEventId` undo linkage, repeat resolution after undo, and preservation of the original `task_done` event. It does **not** exercise the QuickAdd macros end to end, TaskNotes compatibility, Obsidian’s modal, the phone fallback, or hero-state updates.

## Manual validation gate

1. Confirm issue #2’s habit-button desktop/phone validation first.
2. Configure TaskNotes fields and create a disposable test task.
3. Create and schedule the task using TaskNotes only. Verify that TaskNotes preserves the `taskId`, `skill`, `size`, `urgent`, `important`, status, and scheduled-date fields.
4. Mark the task Done in TaskNotes, run **Task done**, and inspect `Engine/Events.md`, XP/MP, the result card or Notice, and the task note.
5. Run **Task done** again without undo. Confirm the duplicate-resolution guard blocks it.
6. Run **Undo last** once. Confirm an `undo` line was appended, the task note returned to an open state, and the original dice remained in the log.
7. Run **Task done** again. Confirm a fresh `task_done` event is appended and marked as a repeat.
8. Repeat the result-card check on phone after syncing scripts and QuickAdd configuration. Record device and plugin versions, whether the modal or Notice appeared, and any exact error.

Record observations in `TESTING.md`. Leave PR #10 draft until blockers and manual validation are resolved. An issue checkbox should not be checked just because a script exists.
