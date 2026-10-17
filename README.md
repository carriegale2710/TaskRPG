# TaskRPG

> Your second brain, enchanted.

TaskRPG is an immersive, character-driven RPG layer on an Obsidian vault. Resolving a real task is a game turn: the dice roll, a random table answers, and a narrator and a cast of characters who remember you turn the day's results into a story. Boredom is the main reason projects and routines get dropped, so TaskRPG generates the novelty for you instead of asking you to supply it.

---

## Why TaskRPG

**Dice and tables decide _what_ happens. The AI narrates _how_.** Every number (HP, MP, XP, rolls, levels) comes from a small, tested JavaScript engine that reads an event log, so the randomness is real and the game works even when the AI is down. The narrator and characters run as agents inside Obsidian (Vault Operator), write only story files, and never touch your stats or your task records.

Your existing vault stays your vault. Tasks, notes, journals and files are yours; TaskRPG adds a game loop on top rather than moving your life into another app.

## Who it's for

You'll like TaskRPG if you:

- Have an **AuDHD or novelty-driven brain** and drop things when they get boring.
- Are a **solo builder** (founder, full-stack dev, creative) with long-running projects and a need to prioritise real work over distractions.
- Already live in **Obsidian** and want a game layer on top of your notes, not a separate app.
- Want **characters, relationships and personalisation** more than maps and lore dumps.
- Need a system with **no death and no guilt**: falling behind creates a recovery arc, never a punishment.

It is built for one person. Sharing the vault as a starter is a possible later step, decided after the first month of real use.

## Core features

- Task and habit tracking with RPG rewards
- An append-only **event log** as the source of truth, with undo and correction instead of editing history
- Hero progression: HP, MP and XP across five skills, with ten levels each
- Dice resolution: 2d6 plus skill bonuses against success, partial-success and setback thresholds, with random-table results and loot drops
- A narrator and characters that remember you, run as Vault Operator agents
- Story, world and campaign notes that grow with play
- Rest days, pause and no-death rules: falling behind creates a recovery arc, never a loss state
- **Works without the AI.** Buttons, dice, stats and tables keep running when the narrator is unavailable; it catches up later
- Rules live in one settings note, not in code, and every rule has an automated test

## Requirements

- **Obsidian** (desktop for setup and planning; phone for quick taps)
- The **required community plugins** listed under [Plugins](#plugins)
- An **AI provider for Vault Operator** (a free Gemini key or GitHub Copilot) — optional; the game runs without it
- **Node.js 22 or newer** — only if you want to run the engine and its tests in a terminal

## Setup

TaskRPG is not yet a distributable starter vault: it is a single-person project, and sharing it is decided after the trial month. The steps below describe how the current build is set up inside a vault. Steps marked **[not yet available]** cannot be completed today.

1. Install Obsidian and open or create your vault.
2. Install and enable the required community plugins.
3. Place the `TaskRPG/` folder in your vault. The current build has `Engine`, `Scripts`, `Story`, `World`, `Characters`, `Campaign`, `Journal`, `Assets` and `Backlog`, with `Campaign/` to be replaced by the per-campaign layout in [What's in your vault](#whats-in-your-vault).
4. Configure TaskNotes so each task note has `taskId`, `skill`, `size`, `urgent`, `important`, a status, and a scheduled date.
5. In QuickAdd, create macro choices for `Task done` and `Undo last` (user-script actions pointing at `TaskRPG/Scripts/task-done.js` and `TaskRPG/Scripts/undo-last.js`), plus a habit `Done` macro for `habit-done.js`. Enable their lightning-bolt commands.
6. Set up the Meta Bind panels and the hero note at `TaskRPG/Engine/Hero.md` for HP, MP and skill XP.
7. Open `TaskRPG/Engine/Settings.md` and configure your hero, habits and tunable game numbers.
8. Optional terminal check of the engine and its tests: see [`docs/TESTING.md`](docs/TESTING.md) for the exact commands. Pass explicit file paths to the `recalc` command — its defaults are not wired to the live log yet, and it overwrites whichever state file you point it at.
9. Optional: set up the [terminal narrator fallback](#gm_bridgepy-optional) below.
10. **[not yet available]** Run the onboarding quiz with the narrator and let it write the starter random tables.
11. **[not yet available]** Add the morning briefing button, companions, projects and arcs, loot, and boss challenges.

QuickAdd configuration and plugin settings are device-local unless you sync them, so a phone usually needs the macros re-created by hand.

## How it works

TaskRPG splits the work into clear layers, and each part has one job:

| Layer                                        | Does                                                                  | Never does                             |
| -------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| **TaskNotes**                                | Creates, plans and displays tasks; owns statuses and task user fields | Rolls dice or holds game rules         |
| **Plugins** (QuickAdd, Meta Bind, and so on) | Buttons, panels, dice tables, sync                                    | Hold game rules                        |
| **Engine** (one plain JavaScript module)     | Every rule and number. Reads the event log and settings note          | Depend on Obsidian or any plugin       |
| **Agents** (the narrator and each character) | Write story, characters and memory, in their own folders              | Change HP, MP, XP or edit task records |

The **event log** is the source of truth: one plain-text line per action. The live log is `TaskRPG/Engine/Events.md`. `TaskRPG/Engine/Hero.md` is a derived display of that state, so the log always wins if the two disagree. QuickAdd scripts call the standalone engine, and tunable game numbers live in `TaskRPG/Engine/Settings.md`.

## The daily loop

```
MORNING
  Plan today in TaskNotes → add tasks, set dates and priorities.
  MP refills to 10.
  Press "morning briefing" → the narrator recaps yesterday and
  frames today's planned tasks as quests.

THROUGH THE DAY
  Mark a task Done in TaskNotes, then run Task done
    → MP is spent, 2d6 roll, a table result, a result card.
  Done on a habit → one-line status (+HP, +XP, −MP). No roll, no story beat.
  Talk to a character any time. It costs no MP.

OVER TIME
  Skills level up, HP and MP recalculate from the event log, projects
  progress through arcs, companions grow, loot drops, bosses appear.
```

Skipping a briefing costs nothing. The next one just covers more days. The briefing, narrator and table notes are later additions; see [Setup](#setup) for what is usable today.

## The rules at a glance

All values below are defaults and live in the settings note, not in code. A settings change is logged with its date and only applies from then on, so your past never gets rewritten.

### MP: a daily budget to practise prioritising

- Max **10**, refilled every morning (the day rolls over at **4:00 AM**).
- Task cost by size: **small 1, medium 3, large 5**. An unplanned task costs **+1**. When Wounded, every task costs **+1**. At skill levels 5 and 10, tasks in that skill cost 1 less. A task never costs less than 1.
- Past 0 MP you can keep going: XP is halved (rounded up) and rolls get a **−1 "Tired"** penalty. HP is untouched.
- **Habits** cost 2, 1 or 0 MP depending on how often you did them on time over the last 30 eligible days (under ⅓ / ⅓ to ⅔ / ⅔ or more). New habits start at 2 MP.

### XP, skills and levels

- Five skills: **Focus, Vitality, Craft, Mind, Presence**. Each task or habit feeds exactly one.
- Task XP = its size, +50% if important, +50% if urgent, +25% if it's in the weekly focus project (bonuses add; rounded up). Habits give 1 XP per press, at any MP.
- Ten levels per skill. The **dice bonus** is +1 at levels 2, 4, 6, 8 and 10.

### The roll

Roll **2d6 + skill dice bonus − HP penalty − Tired penalty** against these thresholds. A project's threat level (+1 per finished arc, max +4) raises every threshold.

| Total     | Outcome                                         |
| --------- | ----------------------------------------------- |
| 9 or more | Success                                         |
| 6 to 8    | Partial success (it works, with a complication) |
| 5 or less | Setback (a twist that moves the story on)       |

A success has a one-in-three chance of **loot**. A roll only changes the story, never the real task's XP or MP.

### HP and Wounded

- Max **10**. An on-time core habit restores 1. A late press earns XP but no HP.
- A missed block deadline costs 1 HP, capped at 2 a day. Weekends, rest days and pause are exempt.
- Dice penalty: HP 7–10 none, 4–6 **−1**, 1–3 **−2**, 0 **−3**. At 0 HP you are **Wounded**: tasks cost +1 MP, boss challenges are blocked, and the narrator switches to a gentle recovery arc. One on-time habit lifts you out.

### Rest, pause and weekends

- **Rest day:** a one-day pass, 4 a month, no HP loss, no plan needed.
- **Pause:** freezes the game with no HP loss. Paused days are left out of every habit's measure.
- **Weekends are optional.** Do something anyway and it earns full XP and HP.
- Disappear without pausing and the game carries on: HP drains (max 2 a day) and you return Wounded, with a gentle first quest waiting.

### Undo

**Undo last** adds a correcting line to the log (nothing is deleted). It works for same-day tasks and habits only, newest first. After an undo, the same task can be resolved again as a fresh turn. Do not use undo to seek a better roll.

## What's in your vault

The vault is organised by ownership and by which story data is shared across campaigns.

| Folder         | Contents                                                         | Who writes it                               |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Engine**     | Shared event log, derived hero state, habit notes, settings      | The QuickAdd macros only                    |
| **Scripts**    | Standalone engine and QuickAdd scripts                           | The coding agent                            |
| **World**      | Shared world canon: rules, regions, factions and reusable NPCs   | User and narrator, with approval            |
| **Story**      | Cross-campaign canon log, tables, narrator preferences and index | Narrator, with approval                     |
| **Campaign**   | One story log, arcs, quests and outcomes per campaign            | Narrator, with approval                     |
| **Characters** | Stable hero/companion profiles and character-scoped memories     | User and character agents, with approval    |
| **Journal**    | Daily notes and a generated "Today's turns" view                 | You and macros (only this folder is pruned) |
| **TaskNotes**  | Task records, planning, statuses, task fields and starter views  | You and TaskNotes                           |

Scripts must stay in a visible folder: QuickAdd cannot load them from a hidden one.

The existing `Campaign/` folder is the current campaign's legacy location until a separately approved migration. The hero profile there contains stable identity only; live stats and inventory belong to `Engine/`. Shared hero progression applies across campaigns; each campaign's narrative history stays separate.

## Plugins

Add only what's listed. Every extra plugin slows startup. Full detail is in [`docs/PLUGINS.md`](docs/PLUGINS.md).

### Required

| Plugin                 | Used for                                                               |
| ---------------------- | ---------------------------------------------------------------------- |
| **QuickAdd**           | The glue: action buttons run macros that call the engine               |
| **Templater**          | Templates for daily, habit, persona and item notes                     |
| **Lazy Plugin Loader** | Keeps startup fast                                                     |
| **Meta Bind**          | The panels (HP, MP, XP) and buttons. Replaces the discontinued Buttons |
| **Fit**                | Phone ↔ desktop sync through GitHub; doubles as backup                 |
| **Dice Roller**        | Draws from the random tables                                           |
| **TaskNotes**          | The task layer: creates, plans and displays tasks; owns task fields    |
| **Vault Operator**     | Runs the narrator and every character as agents. Desktop only          |

### Don't use

Buttons (discontinued), Life RPG / LifeQuest / RPG Stat Tracker (their XP rules clash with the engine), Tasks (date-only done stamp; the game needs the time), Checklist, tabletop-GM plugins (RPG Manager, Fantasy Statblocks, and similar), **any second AI plugin alongside Vault Operator** (conflicting edits and mixed memories), and general utilities you don't need.

### Optional, later, only when you ask

Dataview, Storyteller Suite, Atlas VTT (probably overkill), Heatmap Calendar, presentation polish plugins, and the external-sync plugins (Google Calendar, Google Tasks).

## Later layers (after the trial week)

Added one at a time, in this order:

1. More habits and skills.
2. **Projects and arcs:** up to 3 open at once, a weekly focus project, and the threat level.
3. **Companions:** one at the start, up to 5 (one per skill). Team-up tags, affinity and small perks.
4. **Loot and inventory:** flavour items, gifts to companions.
5. **Boss challenges:** real-world challenges (for example "do habit X for 7 days in a row"). The engine checks the log, so success is never an honour system. Rewards carry one small perk from a fixed list.

The narrator also offers a **shake-up** when things get stale, and adds a **weekly recap** to the Sunday briefing. Both use only data from the event log.

### The trial week

The first week uses one habit, a few tasks and the narrator, with your current routines running alongside. At the end you answer a one-minute check (did you want to open it, did anything feel like a chore, did you miss anything). Then you decide to **continue, adjust or stop**. Nothing widens before that.

## `gm_bridge.py` (optional)

The narrator normally runs in Vault Operator. `gm_bridge.py` is a terminal fallback that does the same two jobs through the Anthropic API, for when Vault Operator or its model provider is unavailable or rate-limited. **The game never depends on it.**

### Setup

```bash
pip install anthropic pyyaml
export ANTHROPIC_API_KEY=...
export VAULT_PATH=~/MyVault
```

### Commands

```bash
python Scripts/gm_bridge.py status                      # what the script can see; changes nothing
python Scripts/gm_bridge.py briefing --dry-run          # print the prompt, no API call
python Scripts/gm_bridge.py briefing                    # write today's briefing and quests
python Scripts/gm_bridge.py briefing --force            # replace today's briefing
python Scripts/gm_bridge.py briefing --date 2026-10-13  # override the game day
python Scripts/gm_bridge.py story                       # refresh the Story So Far digest
```

| Command    | Does                                                                                                                                                        | Model                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `briefing` | Recaps every day since the last briefing (max 7), frames today's planned tasks as quests, adds the Sunday weekly recap, and at most one kind real-talk line | Stronger (`claude-sonnet-5-5`) |
| `story`    | Rewrites the Story So Far from recent briefings. Keeps the timeline table and any line marked 📌 untouched                                                  | Smaller (`claude-haiku-5-5`)   |

Override models with `GM_MODEL_STRONG` and `GM_MODEL_SMALL`.

### Output and safety

- **Writes:** the bridge writes `Story/Briefings/<date>.md`, `Story/Today's quests.md` (each quest links to its real task), and the Story So Far timeline.
- **Enforced in code:** it can write only to Story and Characters. It never computes or changes HP, MP, XP or rolls, never edits task records, and never touches the journal or the Engine folder.
- **Scope:** the bridge predates the multi-campaign layout and is not campaign-aware. Do not use it for multiple campaigns until it is updated to select and isolate a campaign.
- **If the API fails:** it says so and exits without changing anything. The next briefing covers the missed days.
- It won't overwrite an existing briefing without `--force`, so it doesn't clobber one the narrator already wrote. Don't run it while a Vault Operator session is writing the same files.
- Edit the config block at the top of the script if your vault differs from the legacy single-campaign paths it expects (`Engine/Event Log.md`, `Engine/Hero.md`, `Engine/Settings.md`, `Story/Story So Far.md`, `Characters/Narrator.md`).
- `morning` is now `briefing` and `summary` is now `story` (the old names still work with a notice). `evening` is gone: there is no per-day story beat, and results become prose in the next morning briefing.

## Devices, sync and privacy

- **Phone for quick taps, desktop for everything else.** Done presses, habit presses and task resolution are meant to work on the phone; mobile support for the macros, TaskNotes and pop-ups has not been validated yet. Planning and character chats stay on desktop.
- **Fit** syncs the vault. Genuine conflicts land in a `_fit` folder: merge by hand, then press **recalculate**. Plugin settings don't sync by default, so QuickAdd macros and Meta Bind setup need opting in or recreating on the phone.
- **Reminders** are 3 to 5 recurring phone alarms, one per habit block. They aren't linked to the game.
- **Model visibility:** treat every vault file as potentially model-visible. Agents should receive only the context needed for a file. Folders, ignore files and plugin permissions are not confidentiality guarantees. Do not store content in the vault that you would not consent to sending to the configured provider. Review that provider's data terms before sending anything; `gm_bridge.py` sends selected prompt context to Anthropic's API.
- **Cost:** not estimated. Measure real usage and rate limits during the trial week.

## FAQ

**Do I need Obsidian?** Yes. TaskRPG is built on Obsidian and its plugins. Notion and Logseq are not supported.

**Do I need to pay for an AI provider?** Vault Operator can use a free Gemini key or GitHub Copilot. Check the privacy note above before sending anything sensitive. `gm_bridge.py` needs an Anthropic API key and is optional.

**What if the AI is down?** Buttons, dice, stats and the random tables keep working. The narrator catches up later.

**What if I miss a day, or a week?** The game carries on. HP drains (max 2 a day) and you come back Wounded, with a gentle first quest. Use a rest day or pause to avoid that, any time.

**Does my real energy matter?** No. Stats are purely game state, and no health or energy data is entered. MP is an in-game budget that exists to practise choosing real, important work over busy work.

**Can I use my own AI agent?** The narrator and each character are Vault Operator agents with persona files. Don't add a second AI plugin next to it. `gm_bridge.py` is a script, not a plugin, and is restricted to the Story and Characters folders.

**Is it for teams?** No, it's built for one person.

**How much time does it take?** The aspirational target is under 10 minutes a day of upkeep. Press Done, press Done, talk to a character if you feel like it.

**How is it different from Habitica or other gamified apps?**

| Typical gamified app         | TaskRPG                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| Fixed rewards, quickly stale | Dice and narrator-built tables; entries retire and refresh |
| Light RPG framing            | Characters who remember you, with layered memory           |
| Separate app to maintain     | Lives in your vault; your tasks and notes stay yours       |
| HP loss and streak guilt     | No death, no guilt: rest days, pause, recovery arcs        |
| Rules hidden in the app      | Every number in one settings note, every rule tested       |

**Is it a game or a productivity tool?** Both. The work is real; the game is the reward layer that makes showing up worth it.

## Success looks like

These are aspirations to aim at, not pass or fail:

- At least one Done press on 5 of 7 days, for 4 weeks.
- One core habit reaches 20 on-time days out of 30 within 8 weeks.
- More important tasks completed each week.
- At week 4, a gut check: do you still want to open it?

## Learn more

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision log](docs/DECISIONS.md)
- [Build plan and build status](docs/BUILD_PLAN.md)
- [Plugins](docs/PLUGINS.md)
- [Testing](docs/TESTING.md)
- [Changelog](CHANGELOG.md)

## Status

TaskRPG is under active development, and it is used by one person. For what is built, what is untested, and what comes next, see [Build plan and build status](docs/BUILD_PLAN.md); for change history, see [`CHANGELOG.md`](CHANGELOG.md).

## License

Not yet licensed. TaskRPG is currently a private, single-user project; a license will be added if it is ever distributed.
