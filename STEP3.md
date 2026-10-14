# Step 3: Task creation, planning, completion and undo

This implements issue #3. It uses the existing settings-driven engine and event log; no game rules have been changed.

## QuickAdd macros to create

Create four QuickAdd macros, each with one **User Script** action:

| Macro | Script | Use |
|---|---|---|
| New task | `Scripts/new-task.js` | Create a backlog TaskNote |
| Plan task | `Scripts/plan-task.js` | Add the open TaskNote to today |
| Task done | `Scripts/task-done.js` | Complete the open TaskNote |
| Undo last | `Scripts/undo-last.js` | Undo today’s newest task/habit action |

## How to try it

1. Run **New task**.
2. Enter a name, choose a skill and size, then set urgent/important.
3. Confirm that a note is created in `TaskNotes/` with `status: backlog`.
4. Open the new task note and run **Plan task**. Confirm `status: planned` and today’s `plannedDate`.
5. With the task still open, run **Task done**.
6. Check the result card, then confirm the event was appended to `Engine/Events.md` and the task is `completed`.
7. Run **Undo last**. Confirm the task returns to `planned` for today, its `completedDate` clears, and no new roll occurs.
8. Test the result card on your phone. If the modal misbehaves, TaskRPG falls back to a long Notice.

## Stop here

Stop for user validation before starting issue #4. Do not connect Dice Roller tables, the narrator, onboarding quiz, or companion features yet.
