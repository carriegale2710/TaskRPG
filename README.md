# TaskRPG

> Your second brain, enchanted.

TaskRPG is an immersive, character-driven RPG layer on an Obsidian vault. Resolving a real task is a game turn: the dice roll, a random table answers, and a narrator and a cast of characters who remember you turn the day's results into a story. Boredom is the main reason projects and routines get dropped, so TaskRPG generates the novelty for you instead of asking you to supply it.

**Status on `feat/3-task-creation-planning-completion-undo`:** Steps 0–2 have code, and Step 3 has TaskNotes-wrapped task resolution and undo in draft PR #10. TaskNotes owns task creation, planning, statuses, and task user fields; TaskRPG owns `Task done` and `Undo last`. The automated tests pass, including undo-linked duplicate-resolution coverage. Step 3 has **not** been verified in Obsidian on desktop or phone; Step 2's phone validation is also still recorded as pending. The current task flow is a prototype, not the complete daily loop below. See `STEP3.md`, `TESTING.md` and the unreleased entry in `CHANGELOG.md`. The PRD describes intended behavior, not proof that every plugin integration is working.

---

## The idea in one paragraph

**Dice and tables decide _what_ happens. The AI narrates _how_.** Every number (HP, MP, XP, rolls, levels) comes from a small, tested JavaScript engine that reads an event log, so the randomness is real and the game works even when the AI is down. The narrator and characters run as agents inside Obsidian (Vault Operator), write only story files, and never touch your stats or your task records.

---

## Who it's for
You'll like TaskRPG if you:

- Have an **AuDHD or novelty-driven brain** and drop things when they get boring.
- Are a **solo builder** (founder, full-stack dev, creative) with long-running projects and a need to prioritise real work over distractions.
- Already live in **Obsidian** and want a game layer on top of your notes, not a separate app.
- Want **characters, relationships and personalisation** more than maps and lore dumps.
- Need a system with **no death and no guilt**: falling behind creates a recovery arc, never a punishment.

It is built for one person. Sharing the vault as a starter is a possible later step, decided after the first month of real use.

---

## The daily loop

The diagram below is the intended product loop, not a claim that every step is implemented. On this branch, create and plan tasks in TaskNotes, then use the QuickAdd `Task done` and `Undo last` commands; morning briefing, narrator and table-note integration are later steps.

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

Skipping a briefing costs nothing. The next one just covers more days.

---

## How it works

TaskRPG splits the work into clear layers, and each part has one job:

| Layer                                        | Does                                                         | Never does                           |
| -------------------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| **TaskNotes**                                | Creates, plans and displays tasks; owns statuses and task user fields | Rolls dice or holds game rules |
| **Plugins** (QuickAdd, Meta Bind, and so on) | Buttons, panels, dice tables, sync                    | Hold game rules                      |
| **Engine** (one plain JavaScript module)     | Every rule and number. Reads the event log and settings note | Depend on Obsidian or any plugin     |
| **Agents** (the narrator and each character) | Write story, characters and memory, in their own folders     | Change HP, MP, XP or edit task records |

The **event log** is the source of truth: one plain-text line per action. The live log is `Engine/Events.md`. `Engine/Hero.md` is a derived display rewritten by the habit macro; Step 3 task Done and Undo do **not** refresh it yet, so its HP/MP/XP fields can be stale even though the log is authoritative. QuickAdd scripts call the standalone engine, and tunable game numbers live in `Engine/Settings.md`.

---

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

**Undo last** adds a correcting line to the log (nothing is deleted). It works for same-day tasks and habits only, newest first.

For tasks, the duplicate-resolution guard follows `undo.targetEventId` to the original `task_done` event. After a valid undo, **Task done** can run again and the engine records the fresh resolution as a repeat. An undo for another task does not release this task’s guard. Do not use undo to seek a better roll.

---

## Later layers (after the trial week)

Added one at a time, in this order:

1. More habits and skills.
2. **Projects and arcs:** up to 3 open at once, a weekly focus project, and the threat level.
3. **Companions:** one at the start, up to 5 (one per skill). Team-up tags, affinity and small perks.
4. **Loot and inventory:** flavour items, gifts to companions.
5. **Boss challenges:** real-world challenges (for example "do habit X for 7 days in a row"). The engine checks the log, so success is never an honour system. Rewards carry one small perk from a fixed list.

The narrator also offers a **shake-up** when things get stale, and adds a **weekly recap** to the Sunday briefing. Both use only data from the event log.

---

## What's in the vault

The vault is organised by ownership and by which story data is shared across campaigns.

| Folder         | Contents                                                        | Who writes it                                |
| -------------- | --------------------------------------------------------------- | -------------------------------------------- |
| **Engine**     | Shared event log, derived hero state, habit notes, settings     | The QuickAdd macros only                     |
| **Scripts**    | Standalone engine and QuickAdd scripts                          | The coding agent                             |
| **World**      | Shared world canon: rules, regions, factions and reusable NPCs  | User and narrator, with approval             |
| **Story**      | Cross-campaign canon log, tables, narrator preferences and index   | Narrator, with approval                      |
| **Campaigns**  | Separate story log, arcs, quests and outcomes per campaign      | Narrator, with approval                      |
| **Characters** | Stable hero/companion profiles and character-scoped memories    | User and character agents, with approval     |
| **Journal**    | Daily notes and a generated "Today's turns" view                | You and macros (only this folder is pruned)  |
| **TaskNotes**  | Task records, planning, statuses, task fields and starter views | You and TaskNotes                            |

The existing `Campaign/` folder is the current campaign's legacy location until a separately approved migration. The hero profile there contains stable identity only; live stats and inventory belong to `Engine/`. Shared hero progression applies across campaigns; each campaign's narrative history stays separate.

Scripts live in a **visible** folder, because QuickAdd can't load them from a hidden one.

---

## Plugins

Add only what's listed. Every extra plugin slows startup. Full detail is in `PLUGINS.md`.

### Required

| Plugin                 | Used for                                                                 | From   |
| ---------------------- | ------------------------------------------------------------------------ | ------ |
| **QuickAdd**           | The glue: action buttons run macros that call the engine                | Step 0 |
| **Templater**          | Templates for daily, habit, persona and item notes                       | Step 0 |
| **Lazy Plugin Loader** | Keeps startup fast                                                       | Step 0 |
| **Meta Bind**          | The panels (HP, MP, XP) and buttons. Replaces the discontinued Buttons   | Step 2 |
| **Fit**                | Phone ↔ desktop sync through GitHub; doubles as backup                   | Step 2 |
| **Dice Roller**        | Draws from the random tables                                             | Step 3 |
| **TaskNotes**          | The task layer: creates, plans and displays tasks; owns task fields      | Step 3 |
| **Vault Operator**     | Runs the narrator and every character as agents. Desktop only            | Step 4 |

Step 3 currently uses the standalone engine's dice and an in-code placeholder outcome table. Dice Roller integration with generated table notes is planned for Step 4 and has not been verified. TaskNotes field mapping, scheduled dates, and completion behaviour also need testing.

You also need **VS Code with GitHub Copilot** to build and test the engine (Vault Operator has no terminal).

### Don't use

Buttons (discontinued), Life RPG / LifeQuest / RPG Stat Tracker (their XP rules clash with the engine), Tasks (date-only done stamp; the game needs the time), Checklist, tabletop-GM plugins (RPG Manager, Fantasy Statblocks, and similar), **any second AI plugin alongside Vault Operator** (conflicting edits and mixed memories), and general utilities you don't need.

### Optional, later, only when you ask

Dataview, Storyteller Suite, Atlas VTT (probably overkill), Heatmap Calendar, presentation polish plugins, and the external-sync plugins (Google Calendar, Google Tasks).

---

## Quick start

Build one step at a time and try each before the next. Each step ends with something you can press and see. The full brief is in `BUILD_PROMPT.md`.

| Step | Build                                                                             | Done when                                                                                |
| ---- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 0    | Folders, stub settings note, plugin check                                         | A QuickAdd macro runs a "hello" script                                                   |
| 1    | The engine and its automated tests (VS Code)                                      | All tests pass, and `node engine.js recalc` works in a terminal                          |
| 2    | Habit **Done** button, hero note, Meta Bind panels                                | You press Done and see the toast, the log line and the HP change. **Test on your phone** |
| 3    | TaskNotes task fields, task **Done**, result card, **undo last**                  | You create and schedule a task in TaskNotes, resolve it, and undo it                     |
| 4    | Quiz, narrator, hero persona, about 5 starter random tables                       | Quiz finished, hero edited, Dice Roller draws from the tables                            |
| 5    | One companion and the morning briefing button                                     | You plan a day, get the quests and a remembered conversation                             |

On this branch, Step 3 is coded and its automated tests pass; its Obsidian acceptance test is pending. `STEP3.md` distinguishes implemented commands from the optional Workflows trigger. Do not advance to Step 4 until it is validated.

### The trial week

The first week uses one habit, a few tasks and the narrator, with your current routines running alongside. At the end you answer a one-minute check (did you want to open it, did anything feel like a chore, did you miss anything). Then you decide to **continue, adjust or stop**. Nothing widens before that.

---

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
| `story` | Rewrites the Story So Far from recent briefings. Keeps the timeline table and any line marked 📌 untouched                                                  | Smaller (`claude-haiku-5-5`)   |

Override models with `GM_MODEL_STRONG` and `GM_MODEL_SMALL`.

### Output and safety

- **Writes:** the legacy bridge writes `Story/Briefings/<date>.md`, `Story/Today's quests.md` (each quest links to its real task), and the Story So Far timeline.
- **Enforced in code:** it can write only to Story and Characters. It never computes or changes HP, MP, XP or rolls, never edits task records, and never touches the journal or the Engine folder.
- **Scope:** this bridge predates the multi-campaign layout and is not campaign-aware. Do not use it for multiple campaigns until it is updated to select and isolate a campaign.
- **If the API fails:** it says so and exits without changing anything. The next briefing covers the missed days.
- It won't overwrite an existing briefing without `--force`, so it doesn't clobber one the narrator already wrote. Don't run it while a Vault Operator session is writing the same files.

### What it assumes

Edit the config block at the top of the script if your vault differs.

- Folders and files named as in the table above (`Engine/Event Log.md`, `Engine/Hero.md`, `Engine/Settings.md`, `Story/Story So Far.md`, `Characters/Narrator.md`, and so on). These are the bridge's legacy single-campaign paths, not the final multi-campaign layout.
- Event-log lines start with a real date and 24-hour time (for example `2026-10-12 14:00 | ...`). The script applies the 4:00 AM rollover itself.
- The bridge expects a separate engine-owned live-state note with HP, MP and unlocked rules; `Campaign/00 Hero.md` is the stable character profile and must not hold live stats. The settings note is a table of `| Name | Value |` rows.
- Daily-note task lines use the inline format `[skill:: craft] [size:: 3] [urgent:: true]`, and the results sit under a **Today's turns** heading.

### Migrating from v1

`morning` is now `briefing` and `summary` is now `story` (the old names still work with a notice). **`evening` is gone:** v2 has no per-day story beat, and results become prose in the next morning briefing. MP is no longer typed in as real energy, so the old capacity tiers are removed.

---

## Devices, sync and privacy

- **Phone for quick taps, desktop for everything else.** Done presses, habit presses and task resolution are meant to work on the phone. Planning and character chats stay on desktop. Mobile support for the macros, TaskNotes and pop-ups is _untested_ and is checked in Steps 2 and 3.
- **Fit** syncs the vault. Genuine conflicts land in a `_fit` folder: merge by hand, then press **recalculate**. Plugin settings don't sync by default, so QuickAdd macros and Meta Bind setup need opting in or recreating on the phone.
- **Reminders** are 3 to 5 recurring phone alarms, one per habit block. They aren't linked to the game.
- **Model visibility:** treat every vault file as potentially model-visible. Agents should receive only the context needed for a file. Folders, ignore files and plugin permissions are not confidentiality guarantees. Do not store content in the vault that you would not consent to sending to the configured provider. Review that provider's data terms before sending anything; `gm_bridge.py` sends selected prompt context to Anthropic's API.
- **Cost:** not estimated. Measure real usage and rate limits during the trial week.

---

## FAQ

**Do I need Obsidian?** Yes. v2 is built on Obsidian and its plugins. Notion and Logseq are not supported.

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

---

## Success looks like

These are aspirations to aim at, not pass or fail:

- At least one Done press on 5 of 7 days, for 4 weeks.
- One core habit reaches 20 on-time days out of 30 within 8 weeks.
- More important tasks completed each week.
- At week 4, a gut check: do you still want to open it?

---

## Project documents

| File              | What it is                                                      |
| ----------------- | --------------------------------------------------------------- |
| `PRD.md`          | The full product requirements (v2): every decision and default  |
| `BUILD_PROMPT.md` | Step-by-step brief for the coding agent                         |
| `PLUGINS.md`      | Plugin requirements, what to avoid, and checks before each step |
| `TESTING.md`      | How to run the engine tests, and a manual test inside Obsidian  |
| `STEP3.md`        | TaskNotes-wrapped task resolution, current limitations and validation gate |
| `Scripts/gm_bridge.py` | Optional terminal fallback for the narrator                     |
