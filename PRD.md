# PRD: TaskRPG, v2 (Draft)

**Status:** Draft v2, updated through Q32 of the grilling session. Decisions are marked **Settled**, **Leaning** (you said "maybe") or **Open** (not yet answered).

## 1. Overview

| Field        | Value                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product      | TaskRPG, an immersive character-driven RPG layer on an Obsidian vault                                                                                                                                                                                                                                                                                                                                        |
| User         | Solo founder / full-stack dev, AuDHD, novelty-driven                                                                                                                                                                                                                                                                                                                                                         |
| Core barrier | Boredom and lack of novelty stop projects from being finished and habits and routines from sticking                                                                                                                                                                                                                                                                                                          |
| Strategy     | Make the game layer immersive first, because immersion is how the productivity gets delivered. External sync comes later                                                                                                                                                                                                                                                                                     |
| Core loop    | Each morning, press "plan my day": MP refills to 10 and you pick the tasks you'll attempt. Through the day, tick tasks and habits in the todo note. Each task is a game turn with a dice roll and an instant story result. Each habit gives a one-line status update. HP, MP and skill XP update automatically. In sessions, the narrator and party characters expand the story and save summaries to memory |

## 2. What changed from v1

| Area             | v1                                                                | v2                                                                                                                      |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Motivation       | Fix overcommitment and guilt by scaling quests to real energy     | Beat boredom with novelty and visible progression, and learn to prioritise real work over distractions                  |
| MP               | Real daily energy, typed into the daily note                      | In-game budget of 10 MP, refilled each morning and spent on tasks and habits                                            |
| Finishing a task | Do real work, then a story beat                                   | Ticking a task is a game turn: a dice roll and an instant story result                                                  |
| Priority         | Productivity mechanics with a story wrapper                       | Immersive RPG layer first, external sync later                                                                          |
| Interest         | Lore, map and campaign                                            | Characters, relationships and personalisation                                                                           |
| Automation       | None across plugins in v1                                         | Buttons and small scripts maintained by the agent                                                                       |
| Custom agents    | Won't-have                                                        | Core feature: persona agents for the narrator and party. These are persona files and prompts, not a new agent framework |
| Metrics          | Journal entries per week, unfinished tasks, MP on low-energy days | Aspirational, to be rewritten (see section 7)                                                                           |

## 3. Purpose and problem

**Purpose:** Turn daily habits and project work into an interactive campaign you want to return to. It has real randomness, visible growth and a cast of characters who remember you.

**Problem:** Systems that rely on discipline go stale. Boredom and lack of novelty are the main reasons you drop projects and routines.

**Design principles:**

- Novelty has to be generated by the system, not by your own effort each day.
- Every tick of a task or habit gets an immediate reward.
- Progress must be visible: skills, stats, relationships and plot.
- The daily MP budget exists to practise prioritising: choosing real, important work over distractions and busy work.
- No death and no guilt. Falling behind creates a recovery arc, not a punishment.

## 4. Settled decisions

### 4.1 Novelty and randomness

- Dice and random tables decide **what** happens. The AI narrates **how**.
- Start with a few small tables (events, complications, rewards) and add more as they go stale.
- Progression comes from skill levels, stats, the plot and relationships with characters.

### 4.2 Architecture

- **Hybrid:** Obsidian is the UI (buttons, hero sheet, dashboard, map). The narrator and characters are agents (for example Claude Code) that read and write the vault.
- Conversations happen in **live chat outside Obsidian**. You start a session such as "talk to Elara". The agent loads her persona file, her memory and the shared story log.
- When a session ends, the agent writes a **summary plus extracted changes** (new facts, relationship shifts, plot events) back to the vault. Full transcripts are not saved.
- **Story output when you tick a task (v1):** a script rolls the dice and instantly shows a short result drawn from your random tables. The narrator turns the day's results into prose at your next session.
- **Later:** a button calls the narrator live (for example "continue-story" or "make-move"). The dice and tables are built so only the narration step changes.
- Obsidian can't run anything while closed, so deadline checks run when you open the vault or press a button, and they back-fill any windows that closed in the meantime.

### 4.3 Narrator and characters

- The **narrator** is a wise-wizard or fortune-teller persona who speaks to you directly. It has a persona file with the same structure as the characters.
- Onboarding starts with a **short quiz** on world, campaign, genre and character preferences. The world, campaign and cast are then built iteratively from your answers over time.
- **Cast:** a core party of recurring characters, each with a deep persona file, plus occasional NPCs generated from a shared template.
- Each character has a relationship note with you. Affinity changes are proposed by the agent in its session summary, and a dice roll sets how big the shift is.
- Talking to characters costs no MP.

### 4.4 Memory (layered)

- A **shared story log** holds public events that everyone knows.
- **Private per-character memory** holds one-on-one conversations.
- A short "who knows what" note tracks sensitive facts. A character learns something private only if you tell them, or if another character tells them in-fiction. Dice can decide whether a secret leaks.

### 4.5 Stats and inputs

- Stats are **purely game state**. No real energy or health data is entered or modelled.
- Tasks and habits are real. You tick them in an Obsidian todo note, using a checklist plugin that records the time of day of each tick (plugin name to be confirmed).
- External sync is a later feature. The todo note is the integration point.
- **Five skills:** Focus (deep work and project progress), Vitality (sleep, food, movement, self-care), Craft (making and finishing things), Mind (learning, planning, admin) and Presence (social and relationships).
- Each task or habit feeds exactly one skill through a short tag such as `#focus`.

### 4.6 Daily MP budget

- MP has a maximum of **10** and refills to full every morning.
- **Plan in the morning** with a one-button pick-list. Planned tasks cost their normal MP. Unplanned tasks cost **+1 MP**.
- Task size sets the cost: small 1, medium 3, large 5.
- **XP** for a task equals its size (1, 3 or 5), plus 50% if it is important and plus 50% if it is urgent. A task with neither flag earns base XP only.
- **Overdraft:** past 0 MP you can keep ticking tasks. They earn half XP (rounded up) and roll with a −1 "Tired" penalty. HP is untouched.
- **Wounded** (0 HP): every task costs +1 MP until you recover. Habits are exempt (my assumption, to confirm).

### 4.7 Tasks, dice and story

- Ticking a task is a game turn. It rolls **2d6 + skill dice bonus − HP penalty − Tired penalty** (if any), and the story moves forward.
- The task's skill tag chooses which skill the roll uses.
- Every task uses the same thresholds. Task size changes how big the story result is, not your odds.
- A roll only changes the story. It never changes the XP or MP of the real task (my assumption, to confirm).

| Total     | Outcome                                                     |
| --------- | ----------------------------------------------------------- |
| 9 or more | Success                                                     |
| 6 to 8    | Partial success (it works, with a complication)             |
| 5 or less | Setback (a twist that moves the story on, never a dead end) |

| HP          | Dice penalty |
| ----------- | ------------ |
| 7 to 10     | None         |
| 4 to 6      | −1           |
| 1 to 3      | −2           |
| 0 (Wounded) | −3           |

### 4.8 Habits and HP

- You pick **3 to 5 core habits**. Each belongs to a flexible block (morning, afternoon or evening) that you set once.
- **HP** has a maximum of 10. Completing a core habit within its block restores 1 HP. A late tick still earns skill XP but restores no HP.
- Missing a block's deadline costs 1 HP, capped at 2 HP lost per day.
- At 0 HP you are **Wounded**: dice penalty −3, tasks cost +1 MP, and you can't start boss encounters. The narrator switches to a recovery arc with gentle Vitality quests and self-care rewards. One completed habit lifts you out of it.
- **Habits cost MP, much less than tasks.** The cost depends on how many of the past 30 days you completed the habit on time. Only on-time completions count (my assumption, to confirm). A new habit starts at 2 MP.
- A habit gives HP and XP at every cost level, including 0 MP. Habit XP is small, 1 per tick (my assumption, to confirm).
- Habits get **no story beat and no dice roll**. Ticking one shows a single status line, for example: "Morning routine complete! +1 HP, +1 XP, −2 MP (MP 8/10)".

| On-time days in the last 30 | Habit cost       |
| --------------------------- | ---------------- |
| 0 to 9                      | 2 MP             |
| 10 to 19                    | 1 MP             |
| 20 or more                  | 0 MP (automatic) |

### 4.9 Skill levels

- Each skill has **10 levels** with its own XP.
- The **dice bonus** is +1 at levels 2, 4, 6, 8 and 10, so +5 at the top.
- At levels **5 and 10**, tasks in that skill cost 1 MP less each. No task ever costs less than 1 MP.
- The XP curve is a rough guide: level 2 at 10 XP, level 3 at 25, level 4 at 45 and level 5 at 70, then slowing so level 10 takes months.

## 5. Leaning (to confirm)

- Special gear and items unlock at certain skill levels (details later).
- Further debuffs beyond the HP penalty and "Tired" may be added once the basic version has been played.

## 6. Open questions

| Open question                                                                                                                | Current recommendation                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Which plugins and AI tools are installed, including which checklist plugin records tick times (Q33, asked, not yet answered) | Paste your plugin list. The design needs a time-stamped checklist, buttons, a stats display and a script runner                     |
| How size, urgent, important and skill tags are written on a task in the todo note                                            | To discuss                                                                                                                          |
| Who maintains the scripts, and how are they documented                                                                       | The agent writes and maintains them, with each script owned by one button                                                           |
| Folder structure: where hero state, the habit tracker and the daily journal live                                             | Hero state in one file, daily note stays a journal                                                                                  |
| Random tables and encounters: table contents, what counts as a boss                                                          | Start with a few small tables                                                                                                       |
| Skill XP curve and gear unlock details                                                                                       | Use the rough curve in 4.9 until tested                                                                                             |
| Role of the Atlas map and visual presentation                                                                                | Later layer on top of the narrator and characters                                                                                   |
| Third-party character API versus building the persona agents yourself                                                        | Build your own. Character.AI has no public API, and persona files plus a system prompt and memory notes live naturally in the vault |
| Onboarding quiz content and the first party members                                                                          | To discuss                                                                                                                          |
| Rewritten success metrics and final scope split                                                                              | See sections 7 and 8                                                                                                                |

## 7. Goals and success metrics (aspirational)

The old metrics are kept as aspirational, but several no longer fit and need rewriting:

- "At least one task completed on MP of 4 or less days" is obsolete because MP no longer means real energy.
- Journal entries per week and unfinished planned tasks per day need a new definition once the journal's role is decided.
- Story continuity (the AI references the correct prior plot) remains a good target. It would be a manual spot-check.
- New candidates: days with a morning plan, share of ticked tasks that were planned, important and urgent tasks completed per week, habits that reached 0 MP (automatic), skill level growth, conversations held per week.

## 8. Scope (draft)

**Must-have (v1, provisional):**

- Todo and habit note with time-stamped ticks, skill tags, size and urgent or important flags
- "Plan my day" button and daily MP budget
- Dice roll with random tables on every task tick, and one-line status for habits
- Hero sheet: HP, MP and per-skill XP and level, plus the 30-day habit tracker
- Narrator persona with onboarding quiz
- Party persona files, layered memory and session summarisation
- Dashboard of stats

**Should-have:** Gear and items, Atlas map, NPC generator, weekly review, live AI narration button ("continue-story", "make-move").

**Won't-have (v1):** External task or habit sync, health-data sync, multiplayer, custom chat UI or plugin, AI-written story on every tick.

## 9. Assumptions

- Obsidian desktop.
- A checklist plugin that stores the time of day of each tick.
- An AI agent with read and write access to the vault folder.
- You set each task's size and flags when you add it, and you tick tasks and habits in the todo note.
- Core plugins and folders are installed, and you are willing to restructure.
- Items marked "my assumption" in section 4 are still to be confirmed.

## 10. Future versions

- Sync with Todoist, Google Tasks, Trello, Kanban or Habitica through plugins. The todo note is designed as the integration point.
- Samsung watch health data feeding stats (out of scope for now).
- Live AI narration on every tick.
- Custom chat UI for the characters.
- More sophisticated AI-driven story generation based on player actions and journal entries.
