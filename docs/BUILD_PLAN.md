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
| Step 3 — Task resolution and undo       | In progress (draft PR #10); 3.1 Task done and 3.2 Undo partially done, automated tests pass, Obsidian desktop and phone validation pending |
| Step 4 — Quiz, narrator, tables         | Not started                                                                                     |
| Step 5 — Companion and morning briefing | Not started                                                                                     |
| Trial week                              | Not started                                                                                     |
| After the trial week (expansion)        | Not started                                                                                     |


## Build order

## 1. Ground rules

`AGENTS.md` governs how to work. Build-specific rules:

- **Small steps.** Finish one step, say what to press, wait.
- **No rule changes without asking.** Items marked "Placeholder" are starting values, not final rules.
- **Tests:** test first, prove it fails. Workflow and manual-check format: `TESTING.md`.
- **Docs:** update `CHANGELOG.md` and affected docs on every commit.
- **Architecture:** standalone plain JavaScript engine, every number in the settings note, wrappers never restate a rule (`ARCHITECTURE.md` §4, §10; PRD 3.23.1, 3.25). Scripts in a visible folder (`ARCHITECTURE.md` §5, `PLUGINS.md`).
- **Folders:** layout in `ARCHITECTURE.md` §5.
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

**Known gaps and validation status**

- Engine CLI still defaults to `Engine/Events.jsonl`.
- Carried from 0.1.0: an event dated before the first `settings_changed` gets today's rules. Engine bug and missing regression test remain.
- Each press rewrites the whole log note; a sync conflict mid-press can lose lines.

## 4. ~~Step 2: The habit button~~

- [x] QuickAdd macro for habit "Done", one note per habit, hero note and Meta Bind panels showing HP, MP and skill XP.
- [x] Done stamps the time, adds an event log line and a habit note line, shows a one-line toast: "Morning routine complete! +1 HP, +1 XP, −2 MP (MP 8/10)".
- [x] Habits get no dice roll and no story beat.
- [x] **Done when:** Done shows the toast, log line and changed HP. Repeat **on the phone** and record the result. If it fails, log on desktop, use a catch-up button, tell the user.

**Known gaps and validation status**

- Event-log/Hero repair gap: no in-vault repair path if a display write fails after the log line is saved.
- Missed habit blocks are not back-filled in the vault; block times undefined.
- Meta Bind button hard-codes the QuickAdd choice command ID; the phone needs the choice and ID present.

## 5. Step 3: TaskNotes-wrapped task resolution and undo (Issue #3)

> Issue #3 redesign: **TaskNotes owns task creation, planning and task fields. TaskRPG owns task resolution (`Task done`), undo, and the `done`/`open` status writes.** Old `New task` and `Plan task` QuickAdd macros removed.

### Prerequisite: TaskNotes setup and QuickAdd macros

**TaskNotes setup**

- [x] Configure TaskNotes fields: `taskId`, `skill`, `size`, `urgent`, `important`, status, scheduled date. Verify the installed version preserves them.

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

**QuickAdd macros**

Two **Macro** choices, one **User Script** action each. Enable the lightning-bolt commands. QuickAdd configuration is device-local unless synced.

| Choice    | Script                 | Action                                                                                                                   |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Task done | `Scripts/task-done.js` | With a task open: `task_done` event, 2d6 + loot die, XP/MP, note marked done, result card                                |
| Undo last | `Scripts/undo.js`      | Correcting event for today's newest task or habit; reopens a matching task note, removes the matching habit history line |

**Blocking setup checks**

1. Confirm Step 2 desktop/phone validation.
2. Configure TaskNotes fields; create a disposable task.
3. Create and schedule with TaskNotes only. Verify `taskId`, `skill`, `size`, `urgent`, `important`, status, scheduled date survive.

Resolved setup facts:

- ~~Task folder read from TaskNotes `data.json` (`tasksFolder`, fallback `TaskNotes/Tasks`), not hard-coded.~~ Fixed: `task-utils.js` reads the configured folder; `taskFolder` / `configured TaskNotes folder` tests pass.
- ~~Task identity: TaskNotes 4.13.8 identifies tasks by tag (`taskIdentificationMethod: "tag"`, `taskTag: "task"`) and writes no ID. Body template (`TaskNotes/Templates/template.md`, `taskId: {{nano}}`) verified manually 2026-10-21: new task got `taskId`, kept `tags` and `status`.~~ Fixed: the template supplies `taskId`, and `task-done.js` now requires it.

### 3.1 Task done feature (`Scripts/task-done.js`)

With a TaskNotes task open:

- [ ] Read mapped fields and scheduled date.
- [ ] Deduct MP.
- [ ] Roll 2d6.
- [ ] Pick from the placeholder table.
- [ ] Apply XP.
- [x] Append the engine event to `Engine/Events.md`.
- [x] Show the result card as one Notice (roll, outcome, table result, XP/MP, loot); clicking the Notice dismisses it.
- [x] Always write `status: done` and `completedDate`.
- [ ] A task scheduled for today avoids the unplanned surcharge.

**Trigger:** manual only. Create and plan the task in TaskNotes, mark it Done, then run **Task done** with that note open. TaskRPG does not create or plan tasks in this phase.

Optional phase 2: TaskNotes Workflows may call `/task-done` on In Progress → Done. Not built, claimed or validated. Use manual **Task done** until then.

**What the script does**

- **Task done** requires an open note in `TaskNotes/`. Reads mapped fields, validates skill and size, checks whether the scheduled date is today, rolls through the engine, appends to `Engine/Events.md`, then sets `status: done` and `completedDate`.
- Today-scheduled tasks avoid the unplanned surcharge.
- The result card uses the same loot die for a six-entry placeholder table. Not a Dice Roller integration.

**Automated checks**

From the vault root, Node.js 22+:

```sh
node --test
```

`task-utils.test.js`: frontmatter parsing (block-list tags, quoted/unquoted values, empty quoted, colon/quote values, CRLF, BOM), scheduled-date mapping, outcome table, result card, completion fields (missing-field insert, frontmatter-only edit, literal `$&`/`$1`, undo case, CRLF, no-frontmatter error), quoted `taskId`/`skill`/`size` pass `task-done.js`, `taskTag` configured tag with `task` fallback.

**Manual validation**

1. Mark the disposable task Done, run **Task done**, inspect `Engine/Events.md`, XP/MP, the result Notice, the note.
2. Run **Task done** again without undo. Confirm the duplicate guard blocks it.

**Known gaps and validation status**

- `completedDate` ownership unverified. Missing-field insertion, frontmatter-only edits, literal `$` and CRLF are covered by `task-utils.test.js` (issue #14); TaskNotes manual check pending.
- Task note completion write: `Task done` always writes `status: done` and `completedDate` (D-024). Field preservation pending the manual check.
- `Task done` needs `skill` and `size` on the note. The template reserves both empty; TaskRPG rejects empty values.
- TaskNotes field mapping unverified for the installed version.
- Desktop Obsidian unverified: `Task done`, event log, task updates.
- Mobile result Notice unverified.
- Result card is a single Obsidian Notice (D-025), not a modal; QuickAdd's `obsidian.Modal` is not used.
- Outcome table uses the loot die, not a separate table draw.
- Automatic TaskNotes Workflows trigger not built (phase 2 only).

**Done when:**

- [ ] Create and schedule a task in TaskNotes.
- [ ] Mark it Done.
- [ ] Run **Task done**, get the Notice card.
- [ ] Record field mapping and limitations.

### 3.2 Undo feature (`Scripts/undo.js`)

Acceptance criteria map to PRD 3.17. Section numbers in brackets are PRD references.

**Eligibility and stack** [3.17.1]

- [ ] Append one correcting `undo` event for the newest eligible task or habit action of the current game day. Nothing else changes in the log.
- [ ] Eligible targets are `task_done` and `habit_done` only. A boss challenge, gift, rest day, pause, resume, focus project, arc completion, settings change, or missed deadline is never a target, and skipping one does not block an older eligible action.
- [ ] Replay rejects an `undo` whose `targetEventId` is missing, is not the newest eligible action, or belongs to an earlier game day.
- [ ] An `undo` is never a target. Repeated presses unwind that game day's stack newest first until it is empty.
- [ ] When two actions share a timestamp, the later line in the event log is newer.
- [ ] "Same game day" uses the configured day boundary, not the calendar date.
- [ ] No confirmation step before undo, matching **Task done** (D-031).

**Correcting event** [3.17.1]

- [ ] The event records `type: undo`, `targetEventId`, and its own timestamp.
- [ ] The original action line, including its dice, stays unchanged and readable. Event history is never edited, deleted, or reordered.
- [ ] The correcting event is written before any note, story, or `Hero.md` write. If the log write fails, nothing changes. If a later write fails, the correction stands and the Notice says it was saved and must not be pressed again.

**Derived state** [3.17.2]

- [ ] Replay excludes the target, then `Hero.md` is rewritten from the result: MP, HP, skill XP, skill levels, habit cost tier, Wounded, Tired, focus effect, inventory, loot, and companion XP and affinity return to their pre-action values.
- [ ] Rules in force when the target action was logged apply, not current settings (D-028), including an undo after a settings change.
- [ ] A level gained by the undone action is reversed, including its MP discount or perk.
- [ ] Inventory, loot, companion XP and affinity hooks: blocked until those systems exist.

**Task and habit notes** [3.17.2]

- [ ] On the matching task note, write `status: open` and clear the completion field, frontmatter only; leave other fields and the body alone; no previous-status lookup.
- [x] On the matching habit note, remove the history line stamped with the undone event.

**Story rollback** [3.17.3]

- [ ] The narrator tags each line written in response to a resolved action with a trailing `<!-- evt:<eventId> -->` comment in `Story/`, `Campaign/`, `World/`, and `Characters/`.
- [ ] Undo removes every line in those four folders carrying the target event ID and collapses the blank-line gap it leaves.
- [ ] Match the event ID exactly; ignore malformed and unknown tags, and ignore tags outside the four folders.
- [ ] Untagged prose, tables, and links stay untouched, even when they mention the undone action. No backfill of existing prose.
- [ ] CRLF line endings survive the edit.
- [ ] The daily note's "Today's turns" section regenerates from the event log, so it corrects itself without a separate story write.

**Gift cascade** [3.17.2, D-030]

- [ ] Undoing a task whose loot was gifted removes that item from the recipient and reduces the affinity that gift raised by the same amount.
- [ ] The gift line stays in the event log and replays as void; a gift is never an undo target.
- [ ] Blocked until gifts, inventory, and companions exist.

**Messages** [3.17.1, 3.17.3]

- [ ] No eligible action in the current game day: nothing is written, and the Notice says there is nothing to undo.
- [ ] Missing task note, habit history line, or story tag: the correction still applies, and one Notice reports what was reversed, how many story lines were removed, and what was not found.
- [ ] Note write failure after the log write: the correction stands, and the Notice says it was saved and must not be pressed again.

**Regression tests**

- [ ] Duplicate guard follows `undo.targetEventId`; an undo for another task does not release this guard.
- [ ] A valid undo allows a repeat resolution, marked `repeat`; the original `task_done` stays.
- [ ] Undo never enables a re-roll.
- [ ] Level-up reversal, and undo after a settings change, both replay with the original rules.
- [ ] Story line-tag helper: matching lines removed, untagged neighbours and malformed tags survive, tags outside the four story folders ignored, CRLF preserved.

**Trigger:** after a resolution, run **Undo last** to reverse the RPG event. A second **Task done** then gives a fresh resolution; the engine marks it a repeat.

**What the script does**

- **Undo last** uses the newest same-day action rule. Appends an `undo` event; original roll stays. For a task: clears `completedDate`, sets `open`. For a habit: removes the history line stamped with the undone event's timestamp.
- Removes story lines tagged with the target event ID and leaves untagged prose alone.
- Duplicate guard follows `undo.targetEventId`. After a valid undo the task can be resolved again; engine marks it a repeat. An undo for another task does not release this guard.
- Undo never enables a re-roll. **Do not use undo to re-roll.**

**Automated checks**

Same command as 3.1 (`node --test`).

`task-utils.test.js`: `hasUnresolvedTaskDone`, `targetEventId` linkage, and the guard staying closed after a fresh resolution. `undo.test.js`: repeat after undo, original event preserved, real-script task reopen and habit history-line removal, plus the two missing-note notices. Neither file exercises QuickAdd, TaskNotes compatibility, the result Notice or hero-state updates. Story rollback, level-up reversal, and undo after a settings change have no tests yet.

**Manual validation**

1. Run **Undo last**. Confirm an `undo` line, the open state, original dice intact.
2. Run **Task done** again. Confirm a fresh `task_done` marked repeat.
3. With a tagged story line present, run **Undo last** and confirm only the tagged line and its blank-line gap go.
4. Repeat the result-Notice check on phone. Record device and plugin versions, exact Notice text, exact errors.

**Known gaps and validation status**

- Duplicate-resolution guard end-to-end pending.
- Task note status write: undo writes the plugin default `open` and clears `completedDate`. Verified against TaskNotes 4.13.8 (`defaultTaskStatus: "open"`, `done` configured `isCompleted: true`); field preservation pending the manual check.
- Task lookup covers only the configured `tasksFolder`, not subfolders or notes moved elsewhere. An undo then corrects the log, leaves the note Done, and the Notice says no matching note was found.
- Story rollback is specified but unbuilt: no tag parser exists in `Scripts/`, so undo currently removes no story prose.
- Gifted-loot cascade is specified but unbuilt: no gift event, inventory, or companion affinity code exists.
- Which day boundary decides "same game day" when a settings change moves the rollover during the day is undecided; ask before implementing.
- ~~Habit undo does not remove habit-note history.~~

**Done when:**

- [ ] Undo the task resolved in 3.1.
- [ ] Confirm a tagged story line is removed and untagged prose survives.
- [ ] Repeat on phone; record what the Notice shows.

Record observations in `TESTING.md`. PR #10 stays draft until blockers and validation resolve. A script's existence does not check an issue box.

## 6. Step 4: Quiz, narrator and tables

Set up in the chosen AI agent host as agents, personas and prompts. The host is undecided: Obsidian Copilot, Text Generator or Vault Operator. Pick one before this step and record the choice in `TESTING.md`.

- [ ] Confirm the host meets the required capabilities in `PLUGINS.md` section 5, or document the workaround.
- [ ] Pausable **onboarding quiz**, the narrator's first interaction.
- [ ] **Narrator persona** and GM-only preferences note.
- [ ] **Hero persona** (narrator proposes, user edits) with a portrait.
- [ ] About 5 **starter random tables** from quiz answers, one note per table, one weighted line per entry. User approves before live. "Not for me" adds to a retired list.
- [ ] **Done when:** quiz finished, hero proposed and edited, Dice Roller draws from the tables on task completion.

## 7. Step 5: One companion and the morning briefing

- [ ] One **companion** as an agent in the chosen AI host, opened in its chat panel ("talk to Elara"). Loads persona, character-scoped memory and the selected campaign log. Session end: summary plus extracted changes. Core facts note under about a page. Verify character/campaign context separation and write approvals limited to Story, Campaign, World and Characters.
- [ ] **Morning briefing** button: QuickAdd macro plus Obsidian command starts the AI agent host, writes a briefing note and "Today's quests" note with each quest linked to its task. Fallback: paste the prompt into the narrator chat or save it as a reusable prompt or skill where the host supports one.
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
- [ ] Game works without AI. If the AI agent host or the provider is down, buttons, dice and stats still run; narration catches up later.
