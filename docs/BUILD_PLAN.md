# TaskRPG Build Plan

## Roadmap

1. **Engine foundation** — event log, state derivation, undo, terminal tests
2. **Core task loop** — tasks, habits, rewards, macros
3. **Progression** — hero, skills
4. **Visibility** — morning briefing
5. **Polish and release** — settings, edge cases, documentation, validation

Build order below is the source of truth for implementation sequence.

## Objective

Build TaskRPG v1 per `docs/PRD.md`, `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`.

## Build status

Single home for build status. Change history: `CHANGELOG.md`. Test procedures: `docs/TESTING.md`.

| Step                              | Status                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Step 0 — Setup                    | Done                                                                                                                                       |
| Step 1 — Engine and tests         | Done                                                                                                                                       |
| Step 2 — Habit Done button        | Done on `issue-2-habit-button`; desktop and phone validation pending                                                                       |
| Step 3 — Task resolution and undo | In progress (draft PR #10); 3.1 Task done and 3.2 Undo partially done, automated tests pass, Obsidian desktop and phone validation pending |
| Step 4 — Quiz, narrator, hero     | Not started                                                                                                                                |
| Step 5 — Morning briefing         | Not started                                                                                                                                |
| Trial week                        | Not started                                                                                                                                |

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

### ~~Prerequisite: TaskNotes setup and QuickAdd macros~~

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

~~**QuickAdd macros**~~

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

#### **What the script does**

- **Task done** requires an open note in `TaskNotes/`. Reads mapped fields, validates skill and size, checks whether the scheduled date is today, rolls through the engine, appends to `Engine/Events.md`, then sets `status: done` and `completedDate`.
- Today-scheduled tasks avoid the unplanned surcharge.
- The result card uses the same loot die for a six-entry placeholder table. Not a Dice Roller integration.

**Trigger:** manual only. Create and plan the task in TaskNotes, mark it Done, then run **Task done** with that note open. TaskRPG does not create or plan tasks in this phase.

With a TaskNotes task open:

- [x] Read mapped fields and scheduled date.
- [x] Deduct MP.
- [x] Roll 2d6.
- [x] Pick from the placeholder table.
- [x] Apply XP.
- [x] Append the engine event to `Engine/Events.md`.
- [x] Show the result card as one Notice (roll, outcome, table result, XP/MP, loot); clicking the Notice dismisses it.
- [x] Always write `status: done` and `completedDate`.
- [x] A task scheduled for today avoids the unplanned surcharge.

**Acceptance criteria**

Each criterion is testable from the event log, the task note, `Hero.md`, or the Notice.

v1 is the closed daily loop in PRD §7: plan in TaskNotes, resolve one task, see the card, undo. These criteria test only v1 behavior. Out of v1 scope, so untested and unclaimed here: focus-project XP (3.11), project threat (3.18), Dice Roller and narrator-built tables (3.1), story lines (3.2), companion XP and affinity (3.12), inventory and gifts (3.14), and the daily note's "Today's turns" (3.9).

1. [ ] **AC-1 Trigger and scope (PRD 3.4, 3.9.5).** Manual only. The active note is a TaskNotes note inside the configured tasks folder. No active note, a note outside that folder, or a TaskNotes status change on its own starts nothing: the script stops with a Notice and writes nothing.
2. [x] **AC-2 Task identity (PRD 3.9.3; D-022, D-023).** The note carries the configured task tag and a non-empty `taskId`; empty, quoted-empty, `null`, `~`, and missing all count as absent. A note failing either check is rejected before any write.
3. [ ] **AC-3 Mapped fields (PRD 3.9.3, 3.25).** `skill` and `size` are present, non-empty, and listed in `Engine/Settings.md`; an unknown skill or size is rejected before any write. Absent `urgent` and `important` tags read as false. Project and companion fields are not read in v1.
4. [ ] **AC-4 Planned status (PRD 3.5.3, 3.9.1).** `planned` is `true` only when `scheduled` equals the local calendar date; a missing, past, or future scheduled date makes it `false`. The engine adds the unplanned MP surcharge when `planned` is false.
5. [x] **AC-5 MP (PRD 3.5.1–3.5.3, 3.7, 3.8.3–3.8.4).** The engine charges the size cost plus unplanned and Wounded surcharges, minus level discounts, never below `minTaskMP`. When the cost exceeds the remaining MP, the task still resolves: XP is halved rounded up, the roll takes the Tired penalty, and HP is unchanged.
6. [x] **AC-6 Roll (PRD 3.6.1–3.6.3, 3.7).** The result is 2d6 plus the skill's dice bonus, minus the HP penalty and Tired penalty. Outcome follows the base thresholds. No project threat applies: projects are out of v1 scope (PRD §7), so non-project thresholds are used (3.18.5).
7. [ ] **AC-7 XP (PRD 3.5.4, 3.6.6).** Task XP equals size XP plus 50% for important and 50% for urgent, rounded up. No focus-project bonus in v1. The roll never changes XP or MP.
8. [ ] **AC-8 Table (PRD 3.15.1, §7; D-025).** v1 has no Dice Roller or narrator table: one die result from 1 to 6 selects a line from the built-in six-entry placeholder table for the outcome. The same die is the engine's loot die; there is no separate draw. Results 0 and 7 are rejected.
9. [ ] **AC-9 Result card (PRD 3.15).** Exactly one dismissible Notice shows both dice and total, outcome, table line, XP gained, MP spent and remaining, a Tired note on overdraft, and a loot line only when the engine flags a drop. No story beat, companion reaction, or "Today's turns" write in v1.
10. [ ] **AC-10 Event log (PRD 3.4.1–3.4.2, 3.23.4).** A `settings_changed` line is appended first when the log has none or settings changed, then one `task_done` line stamped with its own timestamp. Existing lines are never edited or reordered, and a missing log note is created.
11. [x] **AC-11 Task note completion (PRD 3.9.2; D-024).** Only after the log write, the note gets `status: done` and `completedDate` set to the event timestamp. Only the frontmatter changes; all other fields and the body stay byte-identical.
12. [x] **AC-12 Duplicate guard (PRD 3.9.6).** A second **Task done** for the same `taskId` is blocked while the latest relevant event is an unresolved `task_done`. An `undo` releases the guard only when its `targetEventId` is that task's event; an undo for another task does not.
13. [ ] **AC-13 Failure handling (PRD 3.15, 3.17.7).** A failure before the log write leaves the log, task note, and `Hero.md` unchanged and says nothing was logged. A failure after the log write leaves the correction standing and says the event was saved and **Task done** must not be pressed again.
14. [x] **AC-14 Hero display (PRD 5).** After a successful resolution, `Hero.md` shows the state recalculated from the log, including new MP, HP, skill XP, and levels. Inventory, companion, and focus state are not shown in v1.

#### Testing

**Automated checks**

From the vault root, Node.js 22+:

```sh
node --test
```

> `task-utils.test.js`: frontmatter parsing (block-list tags, quoted/unquoted values, empty quoted, colon/quote values, CRLF, BOM), scheduled-date mapping, outcome table, result card, completion fields (missing-field insert, frontmatter-only edit, literal `$&`/`$1`, undo case, CRLF, no-frontmatter error), quoted `taskId`/`skill`/`size` pass `task-done.js`, `taskTag` configured tag with `task` fallback.

Legend: **Automated** is covered by `node --test`. **Not covered** means no automated test exists yet. **Manual** means an Obsidian check. **Gap** means the behavior is absent or undecided.

### 3.1 Task done feature (`Scripts/task-done.js`)

#### Testing

**Automated checks**

From the vault root, Node.js 22+:

```sh
node --test
```

**Test cases**

Legend: **Automated** is covered by `node --test`. **Not covered** means no automated test exists yet. **Manual** means an Obsidian check. **Gap** means the behavior is absent or undecided.

**Happy path**

| ID    | Case                                                                              | Expected                                                                                                                           | Status                                                   |
| ----- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| TC-1  | Task in the configured folder, all fields valid                                   | One `task_done` event, note Done, `completedDate` set to the event timestamp, `Hero.md` rewritten, one Notice                      | ✅ Automated (`task-done.test.js`)                       |
| TC-2  | Note status is `open` before the press                                            | Status becomes `done`; prior status is not preserved                                                                               | ✅ Automated (`task-done.test.js`)                       |
| TC-11 | `scheduled` equals today                                                          | `planned: true`; size cost only, no unplanned surcharge                                                                            | ✅ Automated (`task-done.test.js`)                       |
| TC-19 | Small, medium, large; unplanned; Wounded; level 5 or 10 discount                  | Expected MP cost, floor `minTaskMP`; Wounded surcharge and level discount applied                                                  | ✅ Automated (`engine.test.js`)                          |
| TC-21 | Roll totals around each threshold, with dice bonus, HP penalty, and Tired penalty | Success, partial, and setback at the base thresholds; no project threat                                                            | ✅ Automated (`engine.test.js`)                          |
| TC-22 | Loot die 1–4, 5–6, and non-success outcomes                                       | Loot flagged only on success with 5 or 6                                                                                           | ✅ Automated (`engine.test.js`)                          |
| TC-23 | Every outcome with table rolls 1–6, plus roll 0 and 7                             | Correct built-in placeholder line per outcome from the loot die; 0 and 7 rejected                                                  | ✅ Automated (`task-utils.test.js`)                      |
| TC-24 | Card with overdraft and with loot; card without either                            | One dismissible Notice with both dice, total, outcome, table line, XP, MP spent and remaining; Tired and loot lines only when true | ✅ Automated (`task-utils.test.js`, `task-done.test.js`) |
| TC-76 | `important` and `urgent` tags, alone and together, plus neither                   | XP = size XP plus 50% per tag, rounded up; no focus-project bonus                                                                  | ✅ Automated (`engine.test.js`, `task-done.test.js`)     |
| TC-77 | Any outcome, success through setback                                              | XP and MP unchanged by the roll                                                                                                    | ✅ Automated (`engine.test.js`)                          |
| TC-29 | Successful resolution                                                             | `Hero.md` reflects recalculated HP, MP, XP, and levels                                                                             | ✅ Automated (`task-done.test.js`, `engine.test.js`)     |
| TC-30 | TaskNotes re-reads a completed note                                               | Keeps `status: done`, `completedDate`, and all other fields and body                                                               | 🔲 Manual, pending                                       |
| TC-31 | Full run on desktop Obsidian                                                      | Event, note, Notice, and Hero update as above                                                                                      | 🔲 Manual, pending                                       |
| TC-32 | Full run on phone                                                                 | Same result; Notice is readable and dismissible                                                                                    | 🔲 Manual, pending                                       |
| TC-33 | Record device, plugin versions, exact Notice text, any error                      | Recorded in `TESTING.md`                                                                                                           | 🔲 Manual, pending                                       |

**Edge cases and failure paths**

| ID    | Case                                                               | Expected                                                                                                           | Status                                               |
| ----- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| TC-3  | Log note absent                                                    | Log created with `settings_changed` then `task_done`                                                               | ✅ Automated (`task-done.test.js`)                   |
| TC-4  | Note has no task tag                                               | Rejected; no log, note, or Hero write                                                                              | ✅ Automated (`task-done.test.js`)                   |
| TC-5  | `taskId` missing, empty, quoted-empty, `null`, `~`, or `undefined` | Rejected; nothing written                                                                                          | ✅ Automated (`task-done.test.js`)                   |
| TC-6  | `skill` missing, empty, or null                                    | Rejected; nothing written                                                                                          | ✅ Automated (`task-done.test.js`)                   |
| TC-7  | `size` missing, empty, or null                                     | Rejected; nothing written                                                                                          | ✅ Automated (`task-done.test.js`)                   |
| TC-8  | `skill` not listed in Settings                                     | Rejected with an unknown-skill Notice; nothing written                                                             | ✅ Automated (`task-done.test.js`)                   |
| TC-9  | `size` not listed in `taskSizes`                                   | Rejected with an unknown-size Notice; nothing written                                                              | ✅ Automated (`task-done.test.js`)                   |
| TC-10 | No active note, or active note outside the TaskNotes folder        | Rejected with a Notice; nothing written                                                                            | ✅ Automated (`task-done.test.js`)                   |
| TC-12 | `scheduled` is yesterday, tomorrow, absent, or not a date          | `planned: false`; +1 MP unplanned surcharge                                                                        | ✅ Automated (`task-done.test.js`)                   |
| TC-13 | `taskId`, `skill`, `size` written in double or single quotes       | Values parse and resolve as unquoted                                                                               | ✅ Automated (`task-utils.test.js`)                  |
| TC-14 | Tags as a block list, flow list, mixed case, or `#task`            | Configured tag matched case-insensitively                                                                          | ✅ Automated (`task-utils.test.js`)                  |
| TC-15 | Frontmatter with CRLF or a BOM                                     | Parses correctly; a CRLF edit keeps CRLF line endings                                                              | ✅ Automated (`task-utils.test.js`)                  |
| TC-16 | `status:` line also appears in the body                            | Only the frontmatter field changes; other fields and body stay unchanged                                           | ✅ Automated (`task-utils.test.js`)                  |
| TC-17 | A value contains `$&` or `$1`                                      | Written literally                                                                                                  | ✅ Automated (`task-utils.test.js`)                  |
| TC-18 | Note has no frontmatter                                            | Clear error; nothing written                                                                                       | ✅ Automated (`task-utils.test.js`)                  |
| TC-20 | Cost exceeds remaining MP                                          | XP halved rounded up, Tired penalty applied, HP unchanged                                                          | ✅ Automated (`engine.test.js`)                      |
| TC-25 | Second **Task done** on the same task without undo                 | Blocked by the duplicate guard; nothing written                                                                    | ✅ Automated (`task-done.test.js`)                   |
| TC-26 | Undo the task, then run **Task done** again                        | New resolution allowed and marked `repeat`; original event intact                                                  | ✅ Automated (`task-done.test.js`, `engine.test.js`) |
| TC-27 | Log write fails                                                    | No note or Hero change; Notice says nothing was logged                                                             | ✅ Automated (`task-done.test.js`)                   |
| TC-28 | Task note or `Hero.md` write fails after the log write             | Event stands; Notice says it was saved and not to press again                                                      | ✅ Automated (`task-done.test.js`)                   |
| TC-78 | `Settings.md` changed since the last event                         | `settings_changed` appended before the `task_done`; event stamped with its own timestamp; existing lines untouched | ✅ Automated (`task-done.test.js`, `engine.test.js`) |
| TC-79 | `urgent` and `important` tags absent                               | Both read as false; no XP bonus                                                                                    | ✅ Automated (`task-done.test.js`)                   |
| TC-80 | Note carries project or companion fields                           | Ignored; resolution reads only `taskId`, `skill`, `size`, `scheduled`, `urgent`, `important`                       | ✅ Automated (`task-done.test.js`)                   |
| TC-81 | TaskNotes status changed to Done without running **Task done**     | No event, note, or Hero write                                                                                      | 🔲 Not covered (v1 has no status trigger)            |
| TC-82 | Undo for a different task, then **Task done** on this one          | Guard stays closed; second resolution blocked                                                                      | ✅ Automated (`task-utils.test.js`)                  |
| TC-83 | Existing `Events.md` is malformed                                  | Rejected before any write; no log, note, or Hero change                                                            | ✅ Automated (`task-done.test.js`)                   |

**Manual validation**

1. Mark the disposable task Done, run **Task done**, inspect `Engine/Events.md`, XP/MP, the result Notice, the note.
2. Run **Task done** again without undo. Confirm the duplicate guard blocks it.

**Done when:**

- [ ] Create and schedule a task in TaskNotes.
- [ ] Mark it Done.
- [ ] Run **Task done**, get the Notice card.
- [ ] Record field mapping and limitations.

#### **Known gaps and validation status**

- `completedDate` ownership unverified. Missing-field insertion, frontmatter-only edits, literal `$` and CRLF are covered by `task-utils.test.js` (issue #14); TaskNotes manual check pending.
- Task note completion write: `Task done` always writes `status: done` and `completedDate` (D-024). Field preservation pending the manual check.
- `Task done` needs `skill` and `size` on the note. The template reserves both empty; TaskRPG rejects empty values.
- TaskNotes field mapping unverified for the installed version.
- Desktop Obsidian unverified: `Task done`, event log, task updates.
- Mobile result Notice unverified.
- Result card is a single Obsidian Notice (D-025), not a modal; QuickAdd's `obsidian.Modal` is not used.
- Outcome table uses the loot die, not a separate table draw.
- Automatic TaskNotes Workflows trigger not built (phase 2 only).

Optional phase 2: TaskNotes Workflows may call `/task-done` on In Progress → Done. Not built, claimed or validated. Use manual **Task done** until then.

### 3.2 Undo feature (`Scripts/undo.js`)

Acceptance criteria map to PRD 3.17. Section numbers in brackets are PRD references.

**Eligibility and stack** [3.17.1]

- [x] Append one correcting `undo` event for the newest eligible task or habit action of the current game day. Nothing else changes in the log.
- [x] Eligible targets are `task_done` and `habit_done` only. A rest day, pause, resume, settings change, or missed deadline is never a target, and skipping one does not block an older eligible action.
- [x] Replay rejects an `undo` whose `targetEventId` is missing, is not the newest eligible action, or belongs to an earlier game day.
- [x] An `undo` is never a target. Repeated presses unwind that game day's stack newest first until it is empty.
- [x] When two actions share a timestamp, the later line in the event log is newer.
- [x] "Same game day" uses the configured day boundary, not the calendar date.
- [x] No confirmation step before undo, matching **Task done** (D-031).

**Correcting event** [3.17.1]

- [x] The event records `type: undo`, `targetEventId`, and its own timestamp.
- [x] The original action line, including its dice, stays unchanged and readable. Event history is never edited, deleted, or reordered.
- [x] The correcting event is written before any note or `Hero.md` write. If the log write fails, nothing changes. If a later write fails, the correction stands and the Notice says it was saved and must not be pressed again.

**Derived state** [3.17.2]

- [ ] Replay excludes the target, then `Hero.md` is rewritten from the result: MP, HP, skill XP, skill levels, habit cost tier, Wounded, and Tired return to their pre-action values.
- [x] Rules in force when the target action was logged apply, not current settings (D-028), including an undo after a settings change.
- [x] A level gained by the undone action is reversed, including its MP discount or perk.

**Task and habit notes** [3.17.2]

- [x] On the matching task note, write `status: open` and clear the completion field, frontmatter only; leave other fields and the body alone; no previous-status lookup.
- [x] On the matching habit note, remove the history line stamped with the undone event.

**Messages** [3.17.1]

- [x] No eligible action in the current game day: nothing is written, and the Notice says there is nothing to undo.
- [ ] Missing task note or habit history line: the correction still applies, and one Notice reports what was reversed and what was not found.
- [x] Note write failure after the log write: the correction stands, and the Notice says it was saved and must not be pressed again.

**Regression tests**

- [x] Duplicate guard follows `undo.targetEventId`; an undo for another task does not release this guard.
- [x] A valid undo allows a repeat resolution, marked `repeat`; the original `task_done` stays.
- [ ] Undo never enables a re-roll.
- [ ] Level-up reversal, and undo after a settings change, both replay with the original rules.

**Trigger:** after a resolution, run **Undo last** to reverse the RPG event. A second **Task done** then gives a fresh resolution; the engine marks it a repeat.

**What the script does**

- **Undo last** uses the newest same-day action rule. Appends an `undo` event; original roll stays. For a task: clears `completedDate`, sets `open`. For a habit: removes the history line stamped with the undone event's timestamp.
- Duplicate guard follows `undo.targetEventId`. After a valid undo the task can be resolved again; engine marks it a repeat. An undo for another task does not release this guard.
- Undo never enables a re-roll. **Do not use undo to re-roll.**

**Automated checks**

Same command as 3.1 (`node --test`).

`task-utils.test.js`: `hasUnresolvedTaskDone`, `targetEventId` linkage, and the guard staying closed after a fresh resolution. `undo.test.js`: repeat after undo, original event preserved, real-script task reopen and habit history-line removal, plus the two missing-note notices. Neither file exercises QuickAdd, TaskNotes compatibility, the result Notice or hero-state updates. Level-up reversal and undo after a settings change have no tests yet.

#### Test cases

Legend, same as 3.1: **Automated** is covered by `node --test`. **Not covered** means no automated test exists yet. **Manual** means an Obsidian check. **Gap** means the behavior is absent or undecided.

**Happy path**

| ID    | Case                                                | Expected                                                                                                                           | Status                                            |
| ----- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| TC-34 | Undo the newest same-day `task_done`                | One `undo` event with `targetEventId`; target excluded from replay; note reopened; `Hero.md` rewritten; one Notice                 | Automated (`engine.test.js`, `undo.test.js`)      |
| TC-35 | Undo the newest same-day `habit_done`               | One `undo` event; history line stamped with the target timestamp removed; state replayed without the press                         | Automated (`engine.test.js`, `undo.test.js`)      |
| TC-36 | Undo reverses MP and skill XP of the target action  | MP and skill XP return to their pre-action values; target's XP and cost are gone                                                   | Automated (`engine.test.js`)                      |
| TC-37 | Undo reverses HP gained by an on-time habit         | HP returns to its pre-press value; no Wounded state is left behind unless the earlier state had it                                 | Automated (`engine.test.js`)                      |
| TC-38 | Target action pushed a skill over a level threshold | Level, dice bonus, and MP discount from that level are reversed                                                                    | Not covered                                       |
| TC-39 | Target action put the hero at 0 MP or 0 HP          | Tired and Wounded flags return to their pre-action values; the roll penalty goes with them                                         | Not covered                                       |
| TC-40 | Undo after a settings change                        | Target replays with the rules in force when it was logged, not current settings (D-028)                                            | Not covered                                       |
| TC-41 | Two same-day actions, one **Undo last** each        | Newest action reversed first, then the older one; each target changes state once                                                   | Automated (`engine.test.js`)                      |
| TC-42 | Third **Undo last** with an empty same-day stack    | Nothing appended; Notice reports nothing to undo                                                                                   | Automated engine level; script Notice not covered |
| TC-43 | Resolve again after a valid undo                    | New `task_done` allowed, flagged `repeat`; original event and its dice stay                                                        | Automated (`engine.test.js`, `undo.test.js`)      |
| TC-44 | Task undo rewrites the matching note                | `status: open` and `completedDate: ""`; only frontmatter changes; other fields and body byte-identical; other task notes untouched | Automated (`undo.test.js`, `task-utils.test.js`)  |
| TC-45 | Successful undo rewrites `Hero.md`                  | HP, MP, skill XP, levels, Wounded, Tired recalculated from the corrected log                                                       | Automated (`undo.test.js`)                        |
| TC-46 | TaskNotes re-reads the reopened note                | Keeps `status: open`, empty `completedDate`, and all other fields and body                                                         | Manual, pending                                   |

**Edge cases and failure paths**

| ID    | Case                                                                          | Expected                                                                             | Status                                                      |
| ----- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| TC-47 | No eligible action on the current game day (empty log, or only earlier days)  | Nothing written; Notice says there is nothing to undo                                | Engine throws (`engine.test.js`); script Notice not covered |
| TC-48 | `targetEventId` names an action that is not the newest                        | Replay rejects the undo; nothing written; error Notice                               | Automated (`engine.test.js`); Notice path not covered       |
| TC-49 | `targetEventId` names an action from an earlier game day                      | Replay rejects the undo; nothing written                                             | Automated (`engine.test.js`)                                |
| TC-50 | Action at 03:59, undo at 04:01                                                | Different game days; nothing to undo                                                 | Not covered                                                 |
| TC-51 | Two actions share a timestamp                                                 | The later line in the log is newer and is the undo target                            | Not covered                                                 |
| TC-52 | Newest line is a rest day, pause, resume, settings change, or missed deadline | Line is skipped, not undone; an older eligible action is the target                  | Not covered                                                 |
| TC-53 | An `undo` line is the newest line                                             | `undo` is never a target; the next press reverses the action before it               | Automated (`engine.test.js`)                                |
| TC-54 | Target `task_done` has no `taskId`                                            | Correction applies; no note lookup; Notice reports no matching task note             | Not covered                                                 |
| TC-55 | Matching task note is absent                                                  | Correction stands; Notice says no matching task note was found                       | Automated (`undo.test.js`)                                  |
| TC-56 | Task note sits in a subfolder or was moved out of `tasksFolder`               | Not found; correction stands, note stays Done; Notice reports the miss               | Not covered; lookup is non-recursive (known gap)            |
| TC-57 | Task note has no `completedDate` field                                        | Field inserted as `completedDate: ""`; other fields and body kept                    | Automated (`task-utils.test.js`)                            |
| TC-58 | Note uses CRLF line endings                                                   | Frontmatter edit inserts or replaces fields and keeps CRLF                           | Automated (`task-utils.test.js`)                            |
| TC-59 | `status:` also appears in the note body                                       | Only the frontmatter value changes                                                   | Automated (`task-utils.test.js`)                            |
| TC-60 | A field value contains `$&` or `$1`                                           | Written literally                                                                    | Automated (`task-utils.test.js`)                            |
| TC-61 | Matching habit note is absent                                                 | Correction stands; Notice says no matching habit note or line was found              | Automated (`undo.test.js`)                                  |
| TC-62 | Habit history line is missing, reworded, or timestamp reformatted             | Correction stands; line untouched; Notice reports the line was not removed           | Not covered                                                 |
| TC-63 | Habit note has two history lines with the same stamp                          | Only the first match is removed; the second stays                                    | Not covered                                                 |
| TC-64 | Habit note uses CRLF                                                          | Removed line only; CRLF preserved                                                    | Automated (`task-utils.test.js`)                            |
| TC-65 | Log write fails                                                               | Nothing changed; Notice says nothing was changed                                     | Not covered                                                 |
| TC-66 | Task, habit, or `Hero.md` write fails after the log write                     | Correction stands; Notice says it was saved and must not be pressed again            | Not covered                                                 |
| TC-67 | `Settings.md` missing or unreadable, or the log already invalid               | Press fails with an error Notice; nothing written                                    | Not covered                                                 |
| TC-68 | Undo targets another task's event                                             | Duplicate-resolution guard for this task stays closed                                | Automated (`task-utils.test.js`)                            |
| TC-69 | Undo, then resolve again, then check the guard                                | Guard stays closed until that new `task_done` is itself undone                       | Automated (`task-utils.test.js`)                            |
| TC-70 | Press **Task done** again hoping to re-roll                                   | Allowed only as a fresh resolution flagged `repeat`; the original roll never changes | Automated engine; policy is documentation only (no block)   |
| TC-71 | Undo with story prose tagged to the undone action                             | No story rollback exists; undo removes no prose                                      | Gap                                                         |
| TC-72 | A settings change moves the 4:00 AM boundary during the day                   | Which boundary defines "same game day" is undecided; ask before implementing         | Gap                                                         |
| TC-73 | Full run on desktop Obsidian                                                  | `undo` line, reopened note, corrected Hero, readable Notice                          | Manual, pending                                             |
| TC-74 | Full run on phone                                                             | Same result; Notice is readable and dismissible                                      | Manual, pending                                             |
| TC-75 | Record device, plugin versions, exact Notice text, any error                  | Recorded in `TESTING.md`                                                             | Manual, pending                                             |

**Manual validation**

1. Run **Undo last**. Confirm an `undo` line, the open state, original dice intact.
2. Run **Task done** again. Confirm a fresh `task_done` marked repeat.
3. Repeat the result-Notice check on phone. Record device and plugin versions, exact Notice text, exact errors.

**Known gaps and validation status**

- Duplicate-resolution guard end-to-end pending.
- Task note status write: undo writes the plugin default `open` and clears `completedDate`. Verified against TaskNotes 4.13.8 (`defaultTaskStatus: "open"`, `done` configured `isCompleted: true`); field preservation pending the manual check.
- Task lookup covers only the configured `tasksFolder`, not subfolders or notes moved elsewhere. An undo then corrects the log, leaves the note Done, and the Notice says no matching note was found.
- Which day boundary decides "same game day" when a settings change moves the rollover during the day is undecided; ask before implementing.
- ~~Habit undo does not remove habit-note history.~~

**Done when:**

- [ ] Undo the task resolved in 3.1.
- [ ] Repeat on phone; record what the Notice shows.

Record observations in `TESTING.md`. PR #10 stays draft until blockers and validation resolve. A script's existence does not check an issue box.

## 6. Step 4: Quiz, narrator and hero

Set up in the chosen AI agent host as agents, personas and prompts. The host is undecided: Obsidian Copilot, Text Generator or Vault Operator. Pick one before this step and record the choice in `TESTING.md`.

- [ ] Confirm the host meets the required capabilities in `PLUGINS.md` section 5, or document the workaround.
- [ ] Pausable **onboarding quiz**, the narrator's first interaction.
- [ ] **Narrator persona**.
- [ ] **Hero persona** (narrator proposes, user edits).
- [ ] **Done when:** quiz finished, hero proposed and edited, narrator opens from the chosen host.

## 7. Step 5: The morning briefing

- [ ] **Morning briefing** button: QuickAdd macro plus Obsidian command starts the AI agent host, writes a briefing note and "Today's quests" note with each quest linked to its task. Fallback: paste the prompt into the narrator chat or save it as a reusable prompt or skill where the host supports one.
- [ ] **Done when:** plan a day, press the button, get quests.

## 8. The trial week

- [ ] One habit, a few tasks and the narrator; current routines run alongside.
- [ ] One-minute check at week end (want to open it, anything a chore, anything missed), written to the event log.
- [ ] User decides continue, adjust or stop. Widen nothing before that.

## 9. Rules for agent characters

- [ ] Narrator and characters write only to Story, Campaign, World and Characters. Never task records, Engine state or user journal content.
- [ ] Only the journal context needed for the current interaction.
- [ ] Treat every vault file as potentially model-visible. No Private folder, ignore file or plugin permission is confidentiality. Do not store content you would not send to the provider.
- [ ] Campaigns share world canon and hero progression; each keeps its own story log. Campaign events become canon only with approval.
- [ ] Only narrator or game system gives real-talk lines (at most one a day, kind and neutral). Characters stay in fiction and advise only when asked.
- [ ] Stronger model for chats, narrator and briefing; smaller model for summaries and housekeeping.
- [ ] Game works without AI. If the AI agent host or the provider is down, buttons, dice and stats still run; narration catches up later.
