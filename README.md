# TaskRPG

> Your second brain, enchanted.

Turn your daily tasks, habits, and projects into a living D&D-style campaign—where your real productivity decides the quest, finishing work advances the story, and every completed task earns XP, loot, and a new chapter in your personal saga.

TaskRPG is a journal-driven productivity layer for your existing second brain (Obsidian, Notion, Logseq—wherever your notes live). Finish a real task, and the story continues: a new scene, a plot twist, a relic uncovered, a rival outmaneuvered. Your journal becomes the campaign log; your master summary becomes the living map of where your story is heading in TaskRPG.

---

## Quick Start

1. Copy folder structure into a new Obsidian vault
2. Install plugins
3. Configure an AI provider in Text Generator or use gm_bridge.py with Anthropic API
4. Run `python gm_bridge.py morning` each morning, `evening` after tasks

---

## Who It’s For

TaskRPG is built for people who want their productivity system to feel like an adventure—not another chore.

## You’ll love it if you…

- **Have ADHD or fluctuating energy** and need a system that adapts to your real capacity instead of punishing you for “off” days.
- **Already use a second brain** (Obsidian, Notion, Logseq) and want to layer a narrative reward on top without abandoning your existing notes.aiproductweekly.substack+1
- **Get bored easily** with traditional productivity apps and need novelty, surprise, and story progression to stay engaged.
- **Work solo** on long-running projects (coding, game dev, research, creative work) and miss the sense of momentum that comes from a shared campaign.
- **Love D&D, RPGs, or lore-heavy stories** and want your real life to feel like part of an epic.mainquest
- **Struggle with perfectionism or guilt** over unfinished tasks and need a system that treats recovery as progress, not failure.

## Features & Benefits

TaskRPG isn’t just another habit tracker—it’s a narrative reward layer that adapts to your real capacity, keeps your story coherent, and stays low-maintenance.

### Core Features

| Feature                        | What it does                                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **MP-adaptive quests**         | Your logged energy (MP 1–10) determines quest type, scope, and rewards—low MP means recovery missions, high MP unlocks bolder chapters. |
| **AI Game Master**             | Generates lore-heavy quest framings (morning) and completion beats (evening) that reference your actual vault context.                  |
| **Journal-as-campaign-log**    | Your daily notes serve triple duty: bujo, diary, and story log—no separate “campaign diary” to maintain.                                |
| **Master Story So Far**        | A living plot summary with a timeline linking back to each day’s original entry, so you (and the AI) can always trace context.          |
| **Skill progression**          | Real skills (TypeScript, Product Design, AI Agents, etc.) level up as you complete work—your character grows with you.                  |
| **Atlas VTT integration**      | Pin quests to map locations, reveal fog, move tokens, and unlock regions as visual payoff for real progress.                            |
| **Habit & deadline awareness** | The GM factors your habit streaks and upcoming deadlines into quest framing, adding urgency or recovery framing as needed.              |
| **Weekly review**              | A built-in ritual that rolls up the week’s quests, XP, and story beats, then prunes stale quests without guilt.                         |

### Benefits

| Benefit                              | Why it matters                                                                                                                                                                                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No guilt on low-energy days**      | Low MP triggers recovery-framed quests with real (small) rewards—never failure or shame.                                                                                                                                                                                      |
| **Prevents overcommitment**          | You set capacity _before_ the quest is framed, so the story respects your actual limits.                                                                                                                                                                                      |
| **Story continuity without bloat**   | Layered memory (summary + structured state + recent beats) keeps the plot coherent without dumping full history into every prompt.                                                                                                                                            |
| **Your journal stays useful**        | One note per day handles tasks, mood, and story—no duplicate systems to abandon.                                                                                                                                                                                              |
| **Motivation that scales both ways** | Good days unlock bolder quests; bad days still feel productive—never stagnant or patronizing. [[strayspark](https://www.strayspark.studio/blog/difficulty-systems-players-enjoy)][[playquestmaster](https://www.playquestmaster.com/smarter-difficulty-scaling-modern-rpgs/)] |
| **Full vault control**               | Everything lives in your own Obsidian vault (or Notion/Logseq); no vendor lock-in, no cloud dependency required. [[forum.obsidian](https://forum.obsidian.md/t/nested-vaults-usage-and-risks/6360)][[github](https://github.com/rbcodelabs/obsidian-vault-bridges)]           |
| **Built for ADHD brains**            | Novelty, surprise, and recovery-as-progress mechanics combat boredom and perfectionism.                                                                                                                                                                                       |

### What makes it different

Most gamified productivity apps treat your energy as a **decoration** (HP bars that go down when you miss a day). TaskRPG treats it as a **hard input**: your logged MP literally changes the quest you receive, the scope you’re given, and the reward you earn.

| Typical gamified app                   | TaskRPG                                            |
| -------------------------------------- | -------------------------------------------------- |
| HP drops on missed days → guilt        | Low MP → recovery quest, smaller rewards, no shame |
| Fixed daily goals regardless of energy | Capacity set by you, quest adapts to it            |
| Story is separate from real work       | Story is a direct mirror of your real capacity     |
| Requires a new app/habit to maintain   | Layers onto your existing journal/notes            |

This is the core insight: **the story is a mirror of your real capacity, not a separate fiction ignoring it.**

## How It Works

TaskRPG turns your existing second brain into a living campaign by following one simple daily loop:

```
┌─────────────────────────────────────────────┐
│ 1. LOG YOUR STATE (morning)                 │
│ Open today's journal note.                  │
│ Fill in MP, energy, capacity, habits.       │
│ Write 1–3 tasks you actually plan to do.    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 2. GM FRAMES YOUR QUEST                     │
│ Your AI Game Master reads your state +      │
│ Story So Far, then writes a quest framing   │
│ that matches your real capacity.            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 3. DO REAL WORK                             │
│ Complete tasks in your project repos,       │
│ check off habits, track focus sessions.     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 4. STORY CONTINUES (evening)                │
│ Mark the quest complete. Your GM writes a   │
│ 120–180 word story beat, appends it to your │
│ journal, and updates the master plot map.   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 5. VISUAL PAYOFF (optional)                 │
│ Update your Atlas VTT map: reveal fog,      │
│ move your token, unlock the next region.    │
└─────────────────────────────────────────────┘
```

### Step 1 — Log your state

Each morning, open today’s journal note and fill in a tiny “Character Status” block:

- **MP** (mana/energy): 1–10
- **Energy**: low / medium / high
- **Capacity**: how many main tasks you can realistically handle
- **Habits**: quick checkboxes
- **Today’s plan**: 1–3 tasks you actually intend to do

This takes under two minutes and becomes the **hard constraint** your GM must respect.

### Step 2 — Your GM frames the quest

Your AI Game Master reads your MP, energy, plan, and the master Story So Far summary, then writes a short quest framing.

- **MP 1–4** → Rest/Scout quest: smaller scope, recovery framing, no new plot threads.
- **MP 5–7** → Standard quest: normal scope, moderate rewards.
- **MP 8–10** → Deep/Bold quest: bigger risks, richer rewards, plot advancement allowed.

Low MP is never framed as failure—it’s a tactical retreat, a scouting mission, or a chance to recover.

### Step 3 — Do the real work

This is where the actual productivity happens: complete tickets in your project repos, check off habits, run focus sessions. TaskRPG doesn’t replace your existing workflow—it layers a narrative reward on top of it.

### Step 4 — The story continues

When you mark a quest complete, your GM writes a 120–180 word story beat that:

- Advances an existing plot thread (never invents new major arcs unprompted).
- Rewards XP/MP proportional to your morning capacity.
- Ends with a next-chapter hook.
- Gets appended directly into your daily journal note.
- Adds a timeline row to your master Story So Far summary.

Your journal becomes the campaign log; your Story So Far becomes the living map of where your story is heading.

### Step 5 — See it on the map (optional)

If you use Atlas VTT, update your world map after a quest: reveal fog, move your token, unlock a region, or defeat a boss. This is the visual payoff that makes the campaign feel real.

### Weekly rhythm

Once a week, run a **summary refresh**: your GM rewrites the Story So Far (200–400 words) incorporating the last 3–5 story beats, preserving active threads and dropping resolved minor details. This keeps the overarching plot coherent without bloating context.

---

## FAQ

### Do I need to use Obsidian?

No—but it’s the best-supported setup. TaskRPG is designed around Markdown files, YAML frontmatter, and wikilinks, which Obsidian handles natively. You can adapt the system for Notion, Logseq, or any folder-based notes app, but you’ll lose some of the plug-and-play integrations (Atlas VTT, Life RPG, Text Generator).

### Do I need to pay for an AI provider?

Not necessarily. You can use a local model via Ollama/LM Studio for zero API cost, or connect a paid provider (Anthropic, OpenAI, OpenRouter) if you want higher-quality story generation. Typical API usage runs $3–10/month depending on how often you generate beats.

### Is my data private?

Yes—everything lives in your own vault/folder on your device. If you use a cloud AI provider, only the prompt context you explicitly send (quest name, MP, plan, Story So Far excerpt) is transmitted; your full vault never leaves your machine unless you choose to sync it.

### How is this different from Habitica or MainQuest?

| Habitica / MainQuest | TaskRPG                  |
| -------------------- | ------------------------ | ------------------------------------------- |
| Quest scope          | Fixed daily habits/tasks | Adapts to your logged MP/capacity           |
| Story                | Light RPG framing        | Deep, evolving lore with continuity         |
| Journal integration  | Separate app             | Your existing daily notes ARE the log       |
| Energy handling      | HP drops on missed days  | Low MP triggers recovery quests, no shame   |
| Project doc linking  | Limited                  | Direct wikilinks to your project repos/docs |

TaskRPG is built for people who want the **story to mirror their real capacity**, not just decorate a checklist.

### Can I use this for team projects?

It’s designed for solo builders. You could share a vault with a collaborator, but the GM, journal, and progression are tuned for one person’s capacity and story.

### What if I miss a day?

Nothing breaks. Your journal just has a gap—and since the system uses a rolling Story So Far (not a rigid streak), missing a day doesn’t punish you. The next quest simply picks up from wherever your Story So Far left off.

### How much time does this take daily?

About 5–10 minutes total:

- **Morning**: 2 min (log MP/energy/plan, generate quest framing)
- **Evening**: 3 min (mark complete, generate beat, update map)
- **Weekly**: 10 min (review, prune, refresh summary)

If that feels like too much, start with just MP logging + evening beats—skip the morning framing until the habit forms.

### Can I use my own AI agent instead of the built-in GM?

Yes. The system is modular: you can plug in Claude Code, Codex, opencode, or any custom agent via the `AGENTS.md` rules file and the `gm_bridge.py` script. The README includes a sample `AGENTS.md` you can customise.

### Is this a game or a productivity tool?

Both. The productivity is real (you complete actual tasks in your actual projects); the game is the **reward layer** that makes showing up feel meaningful. Think of it as “a campaign that meets you where you are,” not a game that distracts from work.
