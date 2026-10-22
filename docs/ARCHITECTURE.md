# TaskRPG Architecture

**Status:** v2  
**Source of truth for:** system structure, data ownership, module boundaries, integrations, technical invariants  
**Related:** [PRD.md](./PRD.md) · [DECISIONS.md](./DECISIONS.md) · [BUILD_PLAN.md](./BUILD_PLAN.md) · [PLUGINS.md](./PLUGINS.md) · [TESTING.md](./TESTING.md)  
**Last Updated**: 2026-10-21

## 1. System overview

TaskRPG is an event-sourced RPG layer over an Obsidian vault.

```text
User actions
  ↓
TaskNotes / QuickAdd / Meta Bind / Dice Roller
  ↓
QuickAdd wrapper scripts
  ↓
Standalone engine
  ↓
Event log → derived hero state → UI / narration
```

| Layer              | Owns                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| TaskNotes          | Task creation, planning, user fields. TaskRPG writes only `done`/`open` |
| QuickAdd wrappers  | Vault I/O; call the engine                                              |
| Engine             | Every RPG rule; state derived from the event log                        |
| Vault Operator     | Narrator and character agents; never game rules                         |
| Meta Bind          | Buttons and panels                                                      |
| Dice Roller        | Dice rolls                                                              |
| Templater          | Note templating                                                         |
| Bases              | Built-in views                                                          |
| Lazy Plugin Loader | Delayed plugin startup                                                  |

## 2. Ownership boundaries

| Concern                                  | Owner                              |
| ---------------------------------------- | ---------------------------------- |
| Task creation, scheduling, user fields   | TaskNotes                          |
| Task note status writes (`done`, `open`) | TaskRPG QuickAdd wrappers          |
| Task RPG resolution and undo             | TaskRPG QuickAdd wrappers + engine |
| Habit completion records                 | Habit notes + QuickAdd wrapper     |
| Game rules, XP, MP, HP, dice outcomes    | Engine                             |
| Event history                            | `Engine/Events.md`                 |
| Derived live state display               | `Engine/Hero.md`                   |
| Stable hero identity                     | Hero persona note                  |
| Narrator and character agents            | Vault Operator                     |
| World canon                              | `World/`                           |
| Cross-campaign canon                     | `Story/`                           |
| Campaign story state                     | `Campaign/<campaign-id>/`          |
| Daily journal                            | `Journal/`                         |
| Engine and wrapper code                  | `TaskRPG/Scripts/`                 |

## 3. Event-sourced state

### Source of truth

`Engine/Events.md` is the source of truth for shared player progression.

- One shared log; one line per game action.
- Action types: task Done, habit Done, missed deadline, overdraft, rest day, pause, resume, session, settings change, undo.
- A campaign-linked task records campaign ID as narrative metadata.
- One task completion creates one global event and awards shared progression once.
- Campaign story state stays separate from shared progression.

### Derived state

`Engine/Hero.md` is a derived display cache, not a source of truth.

After each action, the engine recalculates:

- HP
- MP
- XP
- Skill levels
- Inventory
- Project threat
- Unlocked rules

A recalculate action repairs drift or manual edits.

### Event format

Events use plain readable text, one line per action.

Typical fields:

- Date and time
- Event type
- Skill
- Task size
- Roll
- Outcome
- XP
- MP

The terminal test path may use `Engine/Events.jsonl`, one JSON object per line. Format is equivalent.

## 4. Engine boundaries

Requirements, so a future Obsidian plugin is a swap rather than a rewrite.

- Plain, dependency-free JavaScript.
- No `obsidian` import, Obsidian API, plugin API, `app` or DOM access.
- Strings and objects in; objects out.
- Runs with Obsidian closed.
- Only the terminal entry point may use `node:fs`, and it stays optional.
- All vault and file I/O lives in the wrapper layer.
- The engine never reads or writes files directly.
- Wrappers call the engine API; they never restate game rules.
- Wrapper entry points: `parseSettingsNote`, `parseEvents`, `recordAction`, `recalculate`, `backfillMissedDeadlines`.
- No wrapper recalculates XP, MP, HP or outcomes.
- `Events.md`, `Settings.md`, `Hero.md` stay Markdown.
- One action owns one script.
- Engine tests call the engine directly and run without Obsidian.

### Engine API

| Function                  | Responsibility                                         |
| ------------------------- | ------------------------------------------------------ |
| `parseSettingsNote`       | Parse settings from the settings note                  |
| `parseEvents`             | Parse and validate event-log lines                     |
| `recordAction`            | Validate and apply an action; return new event lines   |
| `recalculate`             | Replay events; derive current state                    |
| `backfillMissedDeadlines` | Apply missed-habit deadline events for elapsed windows |

## 5. Vault folders

Paths relative to `TaskRPG/`.

| Folder        | Contents                                                                 | Writer                                 |
| ------------- | ------------------------------------------------------------------------ | -------------------------------------- |
| `Engine/`     | Event log, derived hero state, habit records, settings                   | QuickAdd wrappers only                 |
| `Scripts/`    | Standalone engine and thin QuickAdd scripts                              | Coding agent                           |
| `Journal/`    | Daily notes and “Today’s turns”; only this folder is pruned after backup | User and macros                        |
| `TaskNotes/`  | Task records, scheduling, user fields                                    | User, TaskNotes, TaskRPG status writes |
| `Campaign/`   | Current campaign state (`00 Hero`, rules, story so far, quest board)     | User and Game Master AI agent          |
| `Story/`      | Cross-campaign canon, approved by the user                               | Game Master AI agent                   |
| `World/`      | NPCs, quests, regions                                                    | User and Game Master AI agent          |
| `Characters/` | Character persona files                                                  | User and Game Master AI agent          |
| `Assets/`     | Banners and character art                                                | User                                   |
| `Backlog/`    | Reserved; unused in v1                                                   | —                                      |

### Rules

- Hero profile holds stable identity only: name, appearance, background, class, personality, goals.
- No HP, MP, XP, skill levels, inventory, active quests or live state in the hero profile.
- Shared progression belongs to the player, not a campaign.
- Campaign story state is isolated by campaign ID.
- Folder boundaries protect ownership and integrity, not privacy.
- Vault Operator writes only to designated Story, Campaign, World and Characters areas.
- Vault Operator never writes engine state, task lines or user-authored journal content.
- `Campaign/` remains the legacy current-campaign location until an approved migration.
- Do not mass-move notes as part of a documentation change.

## 6. AI integration

### Agents

- One agent per character, plus one narrator.
- Each has a persona file.
- Run in Vault Operator inside Obsidian; desktop only.
- Models: Gemini or GitHub Copilot, subject to provider support.

### Model assignment

| Job                                                 | Model                              |
| --------------------------------------------------- | ---------------------------------- |
| Character chats, narrator, morning briefing         | Strongest available provider model |
| Session summaries, memory compression, housekeeping | Smaller, faster provider model     |

Model-per-agent support is untested; validate in the thin slice.

### Session lifecycle

1. Load persona file.
2. Load relevant character-scoped memory.
3. Load selected campaign story log.
4. User interacts in the Obsidian sidebar.
5. At session end, write a summary and extracted changes.
6. User approves relationship or canon changes where required.
7. Full transcripts are not saved.

### Memory layers

| Layer              | Purpose                             |
| ------------------ | ----------------------------------- |
| Core facts         | Always-loaded short character facts |
| Recent sessions    | Last 10 sessions in detail          |
| Monthly digest     | Compressed older history            |
| Pinned moments     | Never compressed                    |
| Shared story log   | Cross-campaign approved canon       |
| Campaign story log | Campaign-specific plot history      |
| Who-knows-what     | In-fiction secret tracking          |

## 7. Integration rules

- TaskNotes is the task layer; TaskRPG does not duplicate native task creation or scheduling.
- TaskRPG wraps resolution and undo.
- Confirm TaskNotes field mappings and status values against the installed version.
- QuickAdd cannot run Vault Operator reliably until tested. Fallback: manual prompt or a Vault Operator skill.
- Vault Operator cannot run a terminal, build the engine or run tests.
- A VS Code coding agent builds and tests the engine.

## 8. Script flows

### Habit done

```text
Habit Done button
  → habit-done.js
  → engine.recordAction
  → append event to Events.md
  → append history line to habit note
  → recalculate and rewrite Hero.md
  → show habit toast
```

### Task done

```text
User marks TaskNotes task Done
  → runs Task done with task note open
  → task-done.js
  → parse settings and events
  → duplicate-resolution check
  → stamp event
  → roll dice
  → engine.recordAction
  → append event lines
  → set task status done and completedDate
  → recalculate and rewrite Hero.md
  → show result card
```

### Undo last

```text
Undo last button
  → undo.js
  → engine.recordAction with undo action
  → engine selects newest eligible same-day task/habit action
  → append correcting undo event
  → original event remains
  → reopen the task note, or remove the habit history line it added
  → recalculate state
```

## 9. Time and sync

- Each macro stamps event time from the device clock.
- The engine derives game day from the timestamp offset.
- Day rollover and on-time checks depend on device clock accuracy.
- No network time, NTP, Obsidian API or file modification time is used for timestamps.
- Fit syncs between phone and desktop; safe changes merge automatically.
- Genuine conflicts go to `_fit` for manual resolution; run recalculate afterwards.
- Plugin settings are not synced by default.
- Mobile QuickAdd and TaskNotes support is untested; validate in the thin slice.

## 10. Technical invariants

- The event log is append-only.
- Undo appends a correction; it never deletes or rewrites history.
- One user action produces one primary game event.
- A campaign-linked task still produces only one shared progression event.
- Settings changes are logged and apply from their timestamp onward.
- A settings change never rewrites the past.
- Engine rules are not duplicated in wrappers.
- Engine tests run without Obsidian.
- Vault content may be visible to the configured AI provider.
- Folder permissions protect integrity, not confidentiality.

## 11. Future plugin port

A future Obsidian plugin should be a swap, not a rewrite.

- Bundle the engine as a module.
- Remove the `new Function` eval loader from QuickAdd macros.
- Replace whole-file read plus adapter write with `Vault.process()` for atomic writes.
- Replace Meta Bind panels and QuickAdd wrappers with plugin views and commands.
- Keep event log, settings note, hero note and engine contract unchanged.
