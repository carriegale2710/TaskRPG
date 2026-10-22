# TaskRPG

> Your second brain, enchanted.

TaskRPG is an immersive, character-driven RPG layer on an Obsidian vault. Resolving a real task is a game turn: dice roll, a random table answers, and a narrator and cast who remember you turn results into story. Boredom drops projects and routines, so TaskRPG generates the novelty instead of asking you to supply it.

## Why TaskRPG

**Dice and tables decide _what_ happens. The AI narrates _how_.** Every number (HP, MP, XP, rolls, levels) comes from a small, tested JavaScript engine that reads an event log. Randomness is real, and the game works when the AI is down. Narrator and characters run as Vault Operator agents, write only story files, and never touch stats or task records.

Your vault stays yours. Tasks, notes and journals stay where they are; TaskRPG adds a game loop on top.

## Who it's for

- AuDHD or novelty-driven brain; drops things when they get boring.
- Solo builder with long-running projects; needs to prioritise real work.
- Already lives in Obsidian; wants a game layer, not another app.
- Wants characters and relationships more than maps and lore dumps.
- Wants no death and no guilt: falling behind creates a recovery arc.

Built for one person. Sharing the vault is decided after the first month.

## Core features

- Task and habit tracking with RPG rewards.
- Append-only **event log** as source of truth; undo and correction instead of editing history.
- Hero progression: HP, MP, XP across five skills with ten levels each.
- 2d6 resolution against success/partial/setback, random-table results, loot drops.
- Narrator and characters that remember you, run as Vault Operator agents.
- Story, world and campaign notes that grow with play.
- Rest days, pause, no-death recovery arcs.
- **Works without AI.** Buttons, dice, stats and tables keep running; narration catches up later.
- Rules in one settings note; every rule has an automated test.

## Requirements

- **Obsidian** (desktop for setup and planning; phone for quick taps).
- Required community plugins ([Plugins](#plugins)).
- **AI provider for Vault Operator** (free Gemini key or GitHub Copilot) — optional.
- **Node.js 22+** only for terminal engine and tests.

## Setup

Not yet a distributable starter vault. Steps describe the current build inside a vault. **[not yet available]** = cannot be completed today.

1. Install Obsidian; open or create your vault.
2. Install and enable the required community plugins.
3. Place `TaskRPG/` in the vault. Current build: `Engine`, `Scripts`, `Story`, `World`, `Characters`, `Campaign`, `Journal`, `Assets`, `Backlog`. `Campaign/` is replaced by the per-campaign layout later.
4. Configure TaskNotes per task: `taskId`, `skill`, `size`, `urgent`, `important`, status, scheduled date.
5. QuickAdd: macro choices for `Task done`, `Undo last` and habit `Done`, each a user-script action on `TaskRPG/Scripts/`. Enable their lightning-bolt commands.
6. Meta Bind: panels and hero note at `TaskRPG/Engine/Hero.md` for HP, MP, skill XP.
7. Configure hero, habits and numbers in `TaskRPG/Engine/Settings.md`.
8. Optional terminal check: see [`docs/TESTING.md`](docs/TESTING.md). Pass explicit file paths to `recalc`; defaults are not wired to the live log, and it overwrites the state file you point it at.
9. Optional: [terminal narrator fallback](#gm_bridgepy-optional).
10. **[not yet available]** Onboarding quiz and starter random tables.
11. **[not yet available]** Morning briefing, companions, projects and arcs, loot, boss challenges.

QuickAdd and plugin settings are device-local unless synced; a phone usually needs the macros re-created by hand.

## How it works

| Layer                                        | Does                                                                  | Never does                             |
| -------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| **TaskNotes**                                | Creates, plans and displays tasks; owns task user fields. TaskRPG writes only `done`/`open` | Rolls dice or holds game rules         |
| **Plugins** (QuickAdd, Meta Bind, and so on) | Buttons, panels, dice tables, sync                                    | Hold game rules                        |
| **Engine** (one plain JavaScript module)     | Every rule and number. Reads the event log and settings note          | Depend on Obsidian or any plugin       |
| **Agents** (narrator, each character)        | Story, characters and memory, in their own folders                    | Change HP, MP, XP or edit task records |

The **event log** is the source of truth: one plain-text line per action, at `TaskRPG/Engine/Events.md`. `TaskRPG/Engine/Hero.md` is a derived display; the log wins if they disagree. QuickAdd scripts call the standalone engine; tunable numbers live in `TaskRPG/Engine/Settings.md`.

## The daily loop

```text
MORNING
  Plan today in TaskNotes. MP refills to 10.
  Press "morning briefing": recap yesterday, frame today's tasks as quests.

THROUGH THE DAY
  Mark a task Done in TaskNotes, then run Task done.
    MP spent, 2d6 roll, table result, result card.
  Habit Done: one-line status (+HP, +XP, −MP). No roll, no story beat.
  Talk to a character any time. No MP cost.

OVER TIME
  Skills level, HP/MP rebuild from the log, projects advance through arcs,
  companions grow, loot drops, bosses appear.
```

Skipping a briefing costs nothing; the next one covers more days. Later additions are noted in [Setup](#setup).

## Rules at a glance

Defaults. All numbers live in the settings note; a change is logged and applies from its date, never rewriting the past.

| Rule             | Value                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Day boundary     | 4:00 AM                                                                                                       |
| MP               | Max 10, refilled each morning                                                                                 |
| Task MP          | Small 1, medium 3, large 5. Unplanned +1. Wounded +1. Skill level 5/10 −1. Never below 1                     |
| Overdraft        | Keep going past 0 MP: XP halved (rounded up), −1 Tired roll                                                                 |
| Task XP          | Size (1/3/5) +50% important +50% urgent +25% weekly focus; rounded up. Habits: 1 XP per press                 |
| Skills           | Focus, Vitality, Craft, Mind, Presence. 10 levels each. Dice bonus +1 at levels 2/4/6/8/10                   |
| Roll             | 2d6 + skill bonus − HP penalty − Tired. Success 9+, partial 6–8, setback 5 or less. Threat raises all thresholds |
| Loot             | One in three successes; flavour only, never changes maths                                                     |
| HP               | Max 10. On-time core habit +1. Late press: XP only. Missed block −1 HP, cap 2/day; weekends/rest/pause exempt |
| HP penalty       | 7–10 none, 4–6 −1, 1–3 −2, 0 −3. Wounded blocks boss challenges; one on-time habit lifts it                   |
| Habits           | Cost 2 / 1 / 0 MP from on-time share of last 30 eligible days (<⅓, ⅓–⅔, ≥⅔). New habit 2 MP                |
| Rest / pause     | Rest: one-day pass, 4/month. Pause: freezes the game. Neither loses HP; paused days leave habit measures      |
| Undo             | Same-day tasks and habits, newest first. Appends a correction; task note returns to `open`                    |

A roll changes only the story. Undo is not a re-roll.

## What's in your vault

| Folder         | Contents                                                         | Writer                                      |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Engine**     | Event log, derived hero state, habit notes, settings             | QuickAdd macros only                        |
| **Scripts**    | Standalone engine and QuickAdd scripts                           | Coding agent                                |
| **World**      | Shared canon: rules, regions, factions, reusable NPCs            | User and narrator, with approval            |
| **Story**      | Cross-campaign canon, tables, narrator preferences, index        | Narrator, with approval                     |
| **Campaign**   | One story log, arcs, quests, outcomes per campaign               | Narrator, with approval                     |
| **Characters** | Hero/companion profiles and character-scoped memory              | User and character agents, with approval    |
| **Journal**    | Daily notes and generated "Today's turns"                        | You and macros (only folder pruned)         |
| **TaskNotes**  | Task records, planning, task fields, starter views               | You, TaskNotes, TaskRPG status writes       |

Scripts must stay in a visible folder; QuickAdd cannot load hidden ones.

`Campaign/` is the current campaign's legacy location until an approved migration. Hero profile holds stable identity only; live stats and inventory belong to `Engine/`. Progression is shared; campaign history stays separate.

## Plugins

Add only what is listed; every extra plugin slows startup. Detail: [`docs/PLUGINS.md`](docs/PLUGINS.md).

| Plugin                 | Used for                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| **QuickAdd**           | Buttons run macros that call the engine                           |
| **Templater**          | Templates for daily, habit, persona and item notes                |
| **Lazy Plugin Loader** | Keeps startup fast                                                |
| **Meta Bind**          | Panels (HP, MP, XP) and buttons; replaces discontinued Buttons    |
| **Fit**                | Phone ↔ desktop sync through GitHub; doubles as backup           |
| **Dice Roller**        | Draws from random tables                                          |
| **TaskNotes**          | Task layer: creates, plans, displays; owns task fields            |
| **Vault Operator**     | Narrator and characters as agents. Desktop only                   |

**Don't use:** Buttons (discontinued), Life RPG / LifeQuest / RPG Stat Tracker (clashing XP rules), Tasks (date-only done stamp), Checklist, tabletop-GM plugins, any second AI plugin beside Vault Operator, utilities you don't need.

**Optional, later, on request:** Dataview, Storyteller Suite, Atlas VTT, Heatmap Calendar, presentation plugins, external-sync plugins.

## `gm_bridge.py` (optional)

Terminal fallback narrator through the Anthropic API, for when Vault Operator or its provider is unavailable. **The game never depends on it.**

```bash
pip install anthropic pyyaml
export ANTHROPIC_API_KEY=...
export VAULT_PATH=~/MyVault
```

```bash
python Scripts/gm_bridge.py status                      # what it can see; changes nothing
python Scripts/gm_bridge.py briefing --dry-run          # print prompt, no API call
python Scripts/gm_bridge.py briefing                    # write today's briefing and quests
python Scripts/gm_bridge.py briefing --force            # replace today's briefing
python Scripts/gm_bridge.py briefing --date 2026-10-13  # override game day
python Scripts/gm_bridge.py story                       # refresh Story So Far digest
```

| Command    | Does                                                                                                 | Model                        |
| ---------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- |
| `briefing` | Recaps every day since the last briefing (max 7), frames planned tasks as quests, Sunday recap, one real-talk line | `claude-sonnet-5-5` |
| `story`    | Rewrites Story So Far from recent briefings; keeps the timeline table and 📌 lines                     | `claude-haiku-5-5`           |

Override models with `GM_MODEL_STRONG` and `GM_MODEL_SMALL`.

- **Writes:** `Story/Briefings/<date>.md`, `Story/Today's quests.md`, Story So Far timeline.
- **Enforced in code:** Story and Characters only. Never HP, MP, XP, rolls, task records, journal or Engine.
- **Scope:** predates multi-campaign; not campaign-aware. Do not use across campaigns until updated.
- **API failure:** reports and exits; next briefing covers missed days.
- No overwrite without `--force`. Do not run during a Vault Operator session writing the same files.
- Config block at the top holds legacy single-campaign paths (`Engine/Event Log.md`, `Engine/Hero.md`, `Engine/Settings.md`, `Story/Story So Far.md`, `Characters/Narrator.md`).
- Old names `morning` → `briefing`, `summary` → `story` still work with a notice. `evening` removed; results become prose in the next briefing.

## Devices, sync and privacy

- **Phone for quick taps, desktop for everything else.** Done presses are meant to work on phone; mobile macros, TaskNotes and pop-ups are unvalidated. Planning and chats stay on desktop.
- **Fit** syncs the vault. Conflicts land in `_fit`: merge by hand, then **recalculate**. Plugin settings do not sync; opt in or recreate on phone.
- **Reminders:** 3–5 recurring phone alarms, one per habit block. Not linked to the game.
- **Model visibility:** every vault file may be model-visible. Send only needed context. Folders, ignore files and plugin permissions are not confidentiality. Do not store content you would not send to the configured provider; `gm_bridge.py` sends prompt context to Anthropic.
- **Cost:** unestimated. Measure real usage during the trial week.

## FAQ

**Need Obsidian?** Yes. Built on Obsidian and its plugins. Notion and Logseq unsupported.

**Need a paid AI provider?** No. Vault Operator can use a free Gemini key or GitHub Copilot. `gm_bridge.py` needs an Anthropic key and is optional.

**AI down?** Buttons, dice, stats and tables keep working; the narrator catches up.

**Miss a day or week?** Game continues: HP drains (max 2/day), you return Wounded with a gentle first quest. Rest day or pause avoids it.

**Does real energy matter?** No. Stats are game state; no health data. MP is an in-game budget for choosing important work.

**Own AI agent?** Narrator and characters are Vault Operator agents with persona files. No second AI plugin. `gm_bridge.py` is a restricted script, not a plugin.

**Teams?** No, one person.

**Time cost?** Target under 10 minutes a day of upkeep.

**Different from Habitica?**

| Typical gamified app         | TaskRPG                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| Fixed rewards, quickly stale | Dice and narrator-built tables; entries retire and refresh |
| Light RPG framing            | Characters who remember you, layered memory                |
| Separate app to maintain     | Lives in your vault; notes stay yours                      |
| HP loss and streak guilt     | No death, no guilt: rest, pause, recovery arcs             |
| Rules hidden in the app      | Every number in one settings note, every rule tested       |

**Game or productivity tool?** Both. Real work; the game is the reward layer.

## Success looks like

Aspirations, not pass/fail: a Done press on 5 of 7 days for 4 weeks; one core habit at 20 on-time days of 30 within 8 weeks; more important tasks each week; at week 4, do you still want to open it?

## Learn more

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision log](docs/DECISIONS.md)
- [Build plan and status](docs/BUILD_PLAN.md)
- [Plugins](docs/PLUGINS.md)
- [Testing](docs/TESTING.md)
- [Changelog](CHANGELOG.md)

## Status

Active development, used by one person. Built/untested/next: [build plan](docs/BUILD_PLAN.md). History: [`CHANGELOG.md`](CHANGELOG.md).

## License

Not yet licensed. Private, single-user project; a licence will be added if distributed.
