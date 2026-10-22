# TaskRPG Build Plan

## Roadmap

1. **Engine foundation** — event log, state derivation, undo, terminal tests
2. **Core task loop** — tasks, habits, rewards, macros
3. **Progression** — hero, skills, projects, arcs, quests
4. **Visibility** — morning briefing, quest board, reminders
5. **Polish and release** — settings, edge cases, documentation, validation

Build order below is the source of truth for implementation sequence.

## Objective

Build TaskRPG v1 per `docs/PRD.md`, `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`.

## Build status

Single home for build status. Change history: `CHANGELOG.md`. Test procedures: `docs/TESTING.md`.

| Step                                    | Status                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Step 0 — Setup                          | Done                                                                                            |
| Step 1 — Engine and tests               | Done                                                                                            |
| Step 2 — Habit Done button              | Done on `issue-2-habit-button`; desktop and phone validation pending                            |
| Step 3 — Task resolution and undo       | In progress (draft PR #10); automated tests pass, Obsidian desktop and phone validation pending |
| Step 4 — Quiz, narrator, tables         | Not started                                                                                     |
| Step 5 — Companion and morning briefing | Not started                                                                                     |
| Trial week                              | Not started                                                                                     |
| After the trial week (expansion)        | Not started                                                                                     |

### Known gaps and validation status

- `completedDate` ownership unverified. Missing-field insertion, frontmatter-only edits, literal `$` and CRLF are covered by `task-utils.test.js` (issue #14); TaskNotes manual check pending.
- Duplicate-resolution guard end-to-end pending.
- Task note status writes: `Task done` always writes `status: done` (D-024); undo writes the plugin default `open` and clears `completedDate`. Verified against TaskNotes 4.13.8 (`defaultTaskStatus: "open"`, `done` configured `isCompleted: true`); field preservation pending the manual check.
- Task folder read from TaskNotes `data.json` (`tasksFolder`, fallback `TaskNotes/Tasks`), not hard-coded.
- Task lookup covers only the configured `tasksFolder`, not subfolders or notes moved elsewhere. An undo then corrects the log, leaves the note Done, and the Notice says no matching note was found.
- Task identity: TaskNotes 4.13.8 identifies tasks by tag (`taskIdentificationMethod: "tag"`, `taskTag: "task"`) and writes no ID. Body template (`TaskNotes/Templates/template.md`, `taskId: {{nano}}`) verified manually 2026-10-21: new task got `taskId`, kept `tags` and `status`.
- `Task done` needs `skill` and `size` on the note. The template reserves both empty; TaskRPG rejects empty values.
- TaskNotes field mapping unverified for the installed version.
- Desktop Obsidian unverified: `Task done`, event log, task updates.
- Mobile result Notice unverified.
- Habit undo does not remove habit-note history.
- Result card is a single Obsidian Notice (D-025), not a modal; QuickAdd's `obsidian.Modal` is not used.
- Outcome table uses the loot die, not a separate table draw.
- Automatic TaskNotes Workflows trigger not built (phase 2 only).
- Step 2 event-log/Hero repair gap and engine CLI default to `Engine/Events.jsonl` remain.
- Carried from 0.1.0: an event dated before the first `settings_changed` gets today's rules. Engine bug and missing regression test remain.
- Missed habit blocks not back-filled in the vault; block times undefined.
- Each press rewrites the whole log note; a sync conflict mid-press can lose lines.
- Meta Bind button hard-codes the QuickAdd choice command ID; the phone needs the choice and ID present.
- No in-vault repair path if a display write fails after the log line is saved.

## Build order

## 1. Ground rules

`AGENTS.md` governs how to work. Build-specific rules:

- **Small steps.** Finish one step, say what to press, wait.
- **No rule changes without asking.** Items marked "Placeholder" are starting values, not final rules.
- **Tests:** test first, prove it fails. Workflow and manual-check format: `TESTING.md`.
- **Docs:** update `CHANGELOG.md` and affected docs on every commit.
- **Architecture:** standalone plain JavaScript engine, every number in the settings note, wrappers never restate a rule (PRD 4.23, 4.35, 4.39). Scripts in a visible folder (PRD 4.15, `PLUGINS.md`).
- **Folders:** layout in PRD 4.15.
- **Plugins:** confirm each before its step, per `PLUGINS.md` §2.

## 2. ~~Step 0: Setup~~

- [x] Create folders, stub settings note, confirm plugins, check QuickAdd runs a script.
- [x] **Done when:** a QuickAdd macro runs a "hello" script on desktop.

## 3. ~~Step 1: The engine and its tests~~

The engine takes event log plus settings note and returns new state and action result.

- [x] **Time:** day rolls over at 4:00 AM.

**MP**

- [x] Max 10, refilled each morning.
- [x] Task cost by size: small 1, medium 3, large 5. Unplanned +1. Wounded +1. Skill levels 5 and 10: 1 less each. Never below 1.
- [x] Past 0 MP: XP halved (rounded up), roll −1 "Tired". HP unaffected.
- [x] Habit cost from on-time share of last 30 eligible days: under one third 2 MP, one third to under two thirds 1 MP, two thirds or more 0 MP. New habit starts at 2 MP.
- [x] Eligible days are weekdays not rest or pause days. A weekend, rest or pause day counts only if the habit was done.

**XP and levels**

- [x] Task XP = size (1, 3 or 5) + 50% important + 50% urgent + 25% weekly focus project. Bonuses add. Placeholder: round up.
- [x] Habit XP 1 per press, including at 0 MP.
- [x] Five skills, 10 levels each. Placeholder thresholds: 10, 25, 45, 70, 100, 140, 190, 250, 320. Kept in settings.
- [x] Dice bonus +1 at levels 2, 4, 6, 8, 10.

**The roll**

- [x] 2d6 + skill dice bonus − HP penalty − Tired penalty. Project threat raises every threshold: +1 per finished arc, cap +4.
- [x] Base thresholds: success 9+, partial 6–8, setback 5 or less. With threat T: 9+T+, 6+T–8+T, 5+T or less. Non-project tasks use T = 0.
- [x] Success has one-in-three loot chance (loot die 5 or 6). Engine only flags the drop; narrator names it later.
- [x] A roll never changes the task's XP or MP.

**HP**

- [x] Max 10. On-time core habit +1. Late press earns XP, no HP, not an on-time day.
- [x] Missed block: −1 HP, cap 2 HP lost per day. Rest days, pause and weekends exempt.
- [x] Dice penalty by HP: 7–10 = 0, 4–6 = −1, 1–3 = −2, 0 = −3. At 0 HP (Wounded): tasks +1 MP, boss challenges blocked.
- [x] Missed blocks back-filled when the vault opens.

**Rest and pause**

- [x] Rest day: one-day pass, 4 a month, no HP loss, no plan needed.
- [x] Pause: freezes the game, no HP loss. Paused days excluded from every habit measure.

**Settings changes and undo**

- [x] Settings change logged with its date. Rules in force on each day; the past is never rewritten.
- [x] Undo reverses the last same-day action with a correcting line. Nothing deleted; no re-roll.
- [x] **Event log:** one shared plain-text file, one line per action (date, time, type, skill, size, roll, outcome, XP, MP). Hero note is a saved copy that recalculate rebuilds.
- [x] **Tests:** one automated test per rule, plus settings changes, undo, day boundary, back-filling.
- [x] **Done when:** all tests pass and terminal replay gives identical results, e.g. `node engine.js recalc`.

## 4. ~~Step 2: The habit button~~

- [x] QuickAdd macro for habit "Done", one note per habit, hero note and Meta Bind panels showing HP, MP and skill XP.
- [x] Done stamps the time, adds an event log line and a habit note line, shows a one-line toast: "Morning routine complete! +1 HP, +1 XP, −2 MP (MP 8/10)".
- [x] Habits get no dice roll and no story beat.
- [x] **Done when:** Done shows the toast, log line and changed HP. Repeat **on the phone** and record the result. If it fails, log on desktop, use a catch-up button, tell the user.

## 5. Step 3: TaskNotes-wrapped task resolution and undo (Issue #3)

> Issue #3 redesign: **TaskNotes owns task creation, planning and task fields. TaskRPG owns task resolution (`Task done`), undo, and the `done`/`open` status writes.** Old `New task` and `Plan task` QuickAdd macros removed.

Substeps:

- [ ] Configure TaskNotes fields: `taskId`, `skill`, `size`, `urgent`, `important`, status, scheduled date. Verify the installed version preserves them.
- [ ] **Task done** (`Scripts/task-done.js`): with a TaskNotes task open, read mapped fields and scheduled date, deduct MP, roll 2d6, pick from the placeholder table, apply XP, append the engine event to `Engine/Events.md`, show the result card as one Notice (roll, outcome, table result, XP/MP, loot); clicking the Notice dismisses it. Always writes `status: done` and `completedDate`.
- [ ] A task scheduled for today avoids the unplanned surcharge.
- [ ] **Undo last** (`Scripts/undo.js`): append a correcting event for the newest same-game-day task or habit action. On the matching task note, write `status: open` and clear the completion field, frontmatter only; leave other fields alone. Never delete history or enable a re-roll.
- [ ] Regression tests: duplicate guard follows `undo.targetEventId`, valid undo allows a repeat resolution, original `task_done` stays.
- [ ] Optional phase 2: TaskNotes Workflows fires `/task-done` on In Progress → Done. Not built or claimed.
- [ ] **Done when:** create and schedule a task in TaskNotes, mark it Done, run **Task done**, get the Notice card, undo it. Repeat on phone; record what the Notice shows. Record field mapping and limitations.

## TaskNotes setup

Each task note:

- [x] Stable `taskId`.
- [x] `skill` matching `Engine/Settings.md`.
- [x] `size` matching `taskSizes`.
- [x] `urgent` and `important` tags.
- [x] Scheduled date for planning.
- [x] Status values for open/planned and completed. TaskNotes 4.13.8 uses `open` (`defaultTaskStatus`), `in-progress`, `done`.

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

## QuickAdd macros

Two **Macro** choices, one **User Script** action each. Enable the lightning-bolt commands. QuickAdd configuration is device-local unless synced.

| Choice    | Script                 | Action                                                                                    |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| Task done | `Scripts/task-done.js` | With a task open: `task_done` event, 2d6 + loot die, XP/MP, note marked done, result card |
| Undo last | `Scripts/undo.js`      | Correcting event for today's newest task or habit; restores a matching task note if found |

## Phase 1 trigger

1. Create and plan the task in TaskNotes.
2. Mark it Done in TaskNotes.
3. Run **Task done** with that note open.
4. **Undo last** to reverse the RPG event.
5. Run **Task done** again for a fresh resolution; the engine marks it a repeat.

TaskRPG does not create or plan tasks in this phase.

## Phase 2 trigger: optional

TaskNotes Workflows may call `/task-done` on In Progress → Done. Not implemented or validated. Use manual **Task done** until then.

## What the scripts do

- **Task done** requires an open note in `TaskNotes/`. Reads mapped fields, validates skill and size, checks whether the scheduled date is today, rolls through the engine, appends to `Engine/Events.md`, then sets `status: done` and `completedDate`.
- Today-scheduled tasks avoid the unplanned surcharge.
- The result card uses the same loot die for a six-entry placeholder table. Not a Dice Roller integration.
- **Undo last** uses the newest same-day action rule. Appends an `undo` event; original roll stays. For a task: clears `completedDate`, sets `open`. Habit undo leaves task notes alone.
- Duplicate guard follows `undo.targetEventId`. After a valid undo the task can be resolved again; engine marks it a repeat. An undo for another task does not release this guard.
- Undo does not remove habit-note history. **Do not use undo to re-roll.**

## Automated checks

From the vault root, Node.js 22+:

```sh
node --test
```

`task-utils.test.js`: frontmatter parsing (block-list tags, quoted/unquoted values, empty quoted, colon/quote values, CRLF, BOM), scheduled-date mapping, outcome table, result card, completion fields (missing-field insert, frontmatter-only edit, literal `$&`/`$1`, undo case, CRLF, no-frontmatter error), quoted `taskId`/`skill`/`size` pass `task-done.js`, `taskTag` configured tag with `task` fallback.

`undo.test.js`: `hasUnresolvedTaskDone`, `targetEventId` linkage, repeat after undo, original event preserved. It does not exercise QuickAdd, TaskNotes compatibility, the result Notice or hero-state updates.

## Manual validation gate

1. Confirm Step 2 desktop/phone validation.
2. Configure TaskNotes fields; create a disposable task.
3. Create and schedule with TaskNotes only. Verify `taskId`, `skill`, `size`, `urgent`, `important`, status, scheduled date survive.
4. Mark Done, run **Task done**, inspect `Engine/Events.md`, XP/MP, the result Notice, the note.
5. Run **Task done** again without undo. Confirm the duplicate guard blocks it.
6. Run **Undo last**. Confirm an `undo` line, the open state, original dice intact.
7. Run **Task done** again. Confirm a fresh `task_done` marked repeat.
8. Repeat the result-Notice check on phone. Record device and plugin versions, exact Notice text, exact errors.

Record observations in `TESTING.md`. PR #10 stays draft until blockers and validation resolve. A script's existence does not check an issue box.

## 6. Step 4: Quiz, narrator and tables

Set up in Vault Operator as agents and skills:

- [ ] Pausable **onboarding quiz**, the narrator's first interaction.
- [ ] **Narrator persona** and GM-only preferences note.
- [ ] **Hero persona** (narrator proposes, user edits) with a portrait.
- [ ] About 5 **starter random tables** from quiz answers, one note per table, one weighted line per entry. User approves before live. "Not for me" adds to a retired list.
- [ ] **Done when:** quiz finished, hero proposed and edited, Dice Roller draws from the tables on task completion.

## 7. Step 5: One companion and the morning briefing

- [ ] One **companion** as a Vault Operator agent opened in the sidebar ("talk to Elara"). Loads persona, character-scoped memory and the selected campaign log. Session end: summary plus extracted changes. Core facts note under about a page. Verify character/campaign context separation and write approvals limited to Story, Campaign, World and Characters.
- [ ] **Morning briefing** button: QuickAdd macro plus Obsidian command starts Vault Operator, writes a briefing note and "Today's quests" note with each quest linked to its task. Fallback: paste the prompt into narrator chat or save it as a Vault Operator skill.
- [ ] **Done when:** plan a day, press the button, get quests, have a first conversation remembered in the next.

## 8. The trial week

- [ ] One habit, a few tasks and the narrator; current routines run alongside.
- [ ] One-minute check at week end (want to open it, anything a chore, anything missed), written to the event log.
- [ ] User decides continue, adjust or stop. Widen nothing before that.

## 9. After the trial week

- [ ] Widen one thing at a time: more habits and skills, then projects and arcs (up to 3 open, weekly focus, threat), companion team-ups and perks, loot and inventory, boss challenges. Follow the PRD.

## 10. Rules for agent characters

- [ ] Narrator and characters write only to Story, Campaign, World and Characters. Never task records, Engine state or user journal content.
- [ ] Only the journal context needed for the current interaction.
- [ ] Treat every vault file as potentially model-visible. No Private folder, ignore file or plugin permission is confidentiality. Do not store content you would not send to the provider.
- [ ] Campaigns share world canon and hero progression; each keeps its own story log, arcs, quests and board. Campaign events become canon only with approval.
- [ ] Only narrator or game system gives real-talk lines (at most one a day, kind and neutral). Characters stay in fiction and advise only when asked.
- [ ] Stronger model for chats, narrator and briefing; smaller model for summaries and housekeeping.
- [ ] Game works without AI. If Vault Operator or the provider is down, buttons, dice and stats still run; narration catches up later.
