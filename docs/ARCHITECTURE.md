# TaskRPG Architecture

**Status:** v2  
**Source of truth for:** system structure, data ownership, module boundaries, integrations, and technical invariants  
**Related:** [PRD.md](./PRD.md) · [DECISIONS.md](./DECISIONS.md) · [BUILD_PLAN.md](./BUILD_PLAN.md) · [PLUGINS.md](./PLUGINS.md) · [TESTING.md](./TESTING.md)
**Last Updated**: 2026-10-18

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

- **TaskNotes** owns task creation, planning, statuses, and user fields.
- **QuickAdd wrappers** own vault I/O and call the engine.
- **The engine** owns every RPG rule and derives state from the event log.
- **Vault Operator** provides narrator and character agents; it never implements game rules.
- **Meta Bind** provides buttons and panels.
- **Dice Roller** provides dice rolls.
- **Templater** supports note templating.
- **Bases** provides built-in views.
- **Lazy Plugin Loader** delays plugin startup.

## 2. Ownership boundaries

| Concern                                          | Owner                              |
| ------------------------------------------------ | ---------------------------------- |
| Task creation, scheduling, statuses, user fields | TaskNotes                          |
| Task RPG resolution and undo                     | TaskRPG QuickAdd wrappers + engine |
| Habit completion records                         | Habit notes + QuickAdd wrapper     |
| Game rules, XP, MP, HP, dice outcomes            | Engine                             |
| Event history                                    | `Engine/Events.md`                 |
| Derived live state display                       | `Engine/Hero.md`                   |
| Stable hero identity                             | Hero persona note                  |
| Narrator and character agents                    | Vault Operator                     |
| World canon                                      | `World/`                           |
| Cross-campaign canon                             | `Story/`                           |
| Campaign story state                             | `Campaign/<campaign-id>/`          |
| Daily journal                                    | `Journal/`                         |
| Engine and wrapper code                          | `TaskRPG/Scripts/`                 |

## 3. Event-sourced state

### Source of truth

`Engine/Events.md` is the source of truth for shared player progression.

- One shared event log records every game action.
- Each action appends one event line.
- Actions include task Done, habit Done, missed deadline, overdraft, rest day, pause, resume, session, settings change, and undo.
- A task linked to a campaign records campaign ID as narrative metadata.
- One task completion creates one global game event and awards shared progression once.
- Campaign story state is separate from shared player progression.

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

The terminal test path may use `Engine/Events.jsonl`, with one JSON object per line. The event format remains equivalent.

## 4. Engine boundaries

These boundaries are requirements. They keep a future Obsidian plugin a swap rather than a rewrite.

- The engine is plain, dependency-free JavaScript.
- No `obsidian` import, Obsidian API, plugin API, `app`, or DOM access.
- Inputs are strings and objects; outputs are objects.
- The engine runs with Obsidian closed.
- Only the terminal entry point may use `node:fs`, and it remains optional.
- All vault and file I/O lives in the wrapper layer.
- The engine never reads or writes files directly.
- Wrappers call the engine API; they never restate game rules.
- Wrapper entry points use `parseSettingsNote`, `parseEvents`, `recordAction`, `recalculate`, or `backfillMissedDeadlines`.
- No wrapper recalculates XP, MP, HP, or outcomes.
- `Events.md`, `Settings.md`, and `Hero.md` remain Markdown.
- One action owns one script.
- Engine tests call the engine directly and run without Obsidian.

### Engine API

| Function                  | Responsibility                                          |
| ------------------------- | ------------------------------------------------------- |
| `parseSettingsNote`       | Parse settings from the settings note                   |
| `parseEvents`             | Parse and validate event-log lines                      |
| `recordAction`            | Validate and apply an action, returning new event lines |
| `recalculate`             | Replay events and derive current state                  |
| `backfillMissedDeadlines` | Apply missed-habit deadline events for elapsed windows  |

## 5. Vault folders

| Folder       | Contents                                                                   | Writer                        |
| ------------ | -------------------------------------------------------------------------- | ----------------------------- |
| `Engine/`    | Shared event log, derived hero state, habit records, settings              | QuickAdd macros only          |
| `Scripts/`   | Standalone engine and thin QuickAdd scripts                                | Coding agent                  |
| `Journal/`   | Daily notes and “Today’s turns”; only this folder is pruned after backup   | User and macros               |
| `TaskNotes/` | Task records, scheduling, statuses, user fields                            | User and TaskNotes            |
| `D&D-Vault/` | Dashboard, Campaigns, VTT, Asset Library, Rules, Templates, Inbox, Archive | User and Game Master AI agent |


### Rules

- Hero profile contains stable identity only: name, appearance, background, class, personality, goals.
- Hero profile does not contain HP, MP, XP, skill levels, inventory, active quests, or other live state.
- Shared progression belongs to the player, not a campaign.
- Campaign story state is isolated by campaign ID.
- Folder boundaries protect ownership and data integrity; they are not privacy boundaries.
- Vault Operator may write only to designated Story, Campaign, World, and Characters areas.
- Vault Operator must not write engine state, task lines, or user-authored journal content.
- The existing `Campaign/` folder remains the legacy current-campaign location until an approved migration.
- Do not mass-move existing notes as part of this documentation change.

## 6. AI integration

### Agents

- One agent per character.
- One narrator agent.
- Each agent has its own persona file.
- Agents run in Vault Operator inside Obsidian.
- Agents are desktop-only.
- Models may be Gemini or GitHub Copilot, subject to provider support.

### Model assignment

| Job                                                 | Model                              |
| --------------------------------------------------- | ---------------------------------- |
| Character chats, narrator, morning briefing         | Strongest available provider model |
| Session summaries, memory compression, housekeeping | Smaller, faster provider model     |

Model-per-agent support is untested and must be validated in the thin slice.

### Session lifecycle

1. Agent loads persona file.
2. Agent loads relevant character-scoped memory.
3. Agent loads selected campaign story log.
4. User interacts in the Obsidian sidebar.
5. At session end, agent writes a summary and extracted changes.
6. User approves relationship or canon changes where required.
7. Full transcripts are not saved.

### Memory layers

| Layer              | Purpose                             |
| ------------------ | ----------------------------------- |
| Core facts         | Always-loaded short character facts |
| Recent sessions    | Last 10 sessions retained in detail |
| Monthly digest     | Compressed older history            |
| Pinned moments     | Never compressed                    |
| Shared story log   | Cross-campaign approved canon       |
| Campaign story log | Campaign-specific plot history      |
| Who-knows-what     | In-fiction secret tracking          |

## 7. Plugin boundaries

| Plugin             | Role                                          |
| ------------------ | --------------------------------------------- |
| QuickAdd           | Calls wrapper scripts and engine              |
| Meta Bind          | Buttons and dashboard panels                  |
| Dice Roller        | Dice rolls                                    |
| Templater          | Templates                                     |
| Bases              | Built-in views                                |
| Lazy Plugin Loader | Startup performance                           |
| TaskNotes          | Task backlog, planning, statuses, user fields |
| Vault Operator     | Narrator and character agents                 |

### Integration rules

- TaskNotes is the task layer; TaskRPG does not duplicate native task creation or scheduling.
- TaskRPG wraps RPG resolution and undo.
- Confirm TaskNotes field mappings and status values against the installed version.
- QuickAdd cannot run Vault Operator reliably until tested; fallback is manual prompt entry or a Vault Operator skill.
- Vault Operator cannot run a terminal, build the engine, or run tests.
- A coding agent in VS Code builds and tests the engine.

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
  → update task completedDate
  → recalculate and rewrite Hero.md
  → show result card
```

### Undo last

```text
Undo last button
  → undo-last.js
  → engine.recordAction with undo action
  → engine selects newest eligible same-day task/habit action
  → append correcting undo event
  → original event remains
  → recalculate state
```

## 9. Time and sync

- Each macro stamps event time using the device clock.
- The engine derives game day from the timestamp offset.
- Day rollover and on-time evaluation depend on device clock accuracy.
- No network time, NTP, Obsidian API, or file modification time is used for event timestamps.
- Fit syncs the vault between phone and desktop.
- Safe changes merge automatically.
- Genuine conflicts are saved in `_fit` for manual resolution.
- After resolving a conflict, run recalculate.
- Plugin settings are not synced by default.
- Mobile QuickAdd and TaskNotes support is untested and must be validated in the thin slice.

## 10. Technical invariants

- The event log is append-only.
- Undo appends a correcting event; it never deletes or rewrites history.
- One user action produces one primary game event.
- A campaign-linked task still produces only one shared progression event.
- Settings changes are logged and apply from their timestamp onward.
- Historical state is never rewritten by a settings change.
- Engine rules are not duplicated in wrappers.
- Engine tests run without Obsidian.
- Vault content is potentially visible to the configured AI provider.
- Folder permissions protect integrity, not confidentiality.

## 11. Future plugin port

A future Obsidian plugin should be a swap, not a rewrite.

Expected changes:

- Bundle the engine as a module.
- Remove the `new Function` eval loader from QuickAdd macros.
- Replace whole-file read plus adapter write with `Vault.process()` for atomic writes.
- Replace Meta Bind panels and QuickAdd wrappers with plugin views and commands.
- Preserve event log, settings note, hero note, and engine contract unchanged.
