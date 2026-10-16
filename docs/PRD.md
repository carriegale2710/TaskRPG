# PRD: TaskRPG, v2 (Draft)

**Status:** Ready to build (v2), updated through Q77 of the grilling session. Decisions are marked **Settled**, **Leaning** (you said "maybe") or **Open**. Small details I set myself are labelled defaults and can be changed. The items in section 6 are defaults to refine during the build.

## 1. Overview

| Field        | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product      | TaskRPG, an immersive character-driven RPG layer on an Obsidian vault                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| User         | Solo founder / full-stack dev, AuDHD, novelty-driven                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Core barrier | Boredom and lack of novelty stop projects from being finished and habits and routines from sticking                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Strategy     | Make the game layer immersive first, because immersion is how the productivity gets delivered. External sync comes later                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Stack        | Obsidian (QuickAdd, Meta Bind, Dice Roller, Templater, Bases, Lazy Plugin Loader) plus Vault Operator (an AI agent inside Obsidian, using Gemini or GitHub Copilot) for the narrator and characters, and VS Code with GitHub Copilot to build the engine. Vault backed up on GitHub                                                                                                                                                                                                                                                                                        |
| Core loop    | Each morning, plan today in TaskNotes: create or schedule tasks and set skill, size, urgent and important user fields. MP refills to 10. The narrator gives a morning briefing that frames your planned tasks as quests and recaps yesterday. Through the day, mark tasks Done in TaskNotes, then run TaskRPG’s manual Task done command (instant dice roll and table result); press Done on core habits for their one-line status. HP, MP and skill XP recalculate from the event log. Talk to characters any time. Sessions write summaries and proposals back to memory |

## 2. What changed from v1

| Area             | v1                                                                | v2                                                                                                                      |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Motivation       | Fix overcommitment and guilt by scaling quests to real energy     | Beat boredom with novelty and visible progression, and learn to prioritise real work over distractions                  |
| MP               | Real daily energy, typed into the daily note                      | In-game budget of 10 MP, refilled each morning and spent on tasks and habits                                            |
| Finishing a task | Do real work, then a story beat                                   | Pressing Done is a game turn: a dice roll and an instant table result                                                   |
| Tasks            | Deadlines in the daily note frontmatter                           | TaskNotes owns task creation, planning, statuses and user fields; TaskRPG owns RPG resolution and undo                  |
| Source of truth  | The daily journal                                                 | An event log. The daily note is a journal with a "Today's turns" section                                                |
| Priority         | Productivity mechanics with a story wrapper                       | Immersive RPG layer first, external sync later                                                                          |
| Interest         | Lore, map and campaign                                            | Characters, relationships and personalisation                                                                           |
| Automation       | None across plugins in v1                                         | QuickAdd macros run the game engine, and a coding agent in VS Code (GitHub Copilot) writes and maintains the scripts    |
| Custom agents    | Won't-have                                                        | Core feature: persona agents for the narrator and party. These are persona files and prompts, not a new agent framework |
| Metrics          | Journal entries per week, unfinished tasks, MP on low-energy days | Aspirational, to be rewritten (see section 7)                                                                           |

## 3. Purpose and problem

**Purpose:** Turn daily habits and project work into an interactive campaign you want to return to. It has real randomness, visible growth and a cast of characters who remember you.

**Problem:** Systems that rely on discipline go stale. Boredom and lack of novelty are the main reasons you drop projects and routines.

**Design principles:**

- Novelty has to be generated by the system, not by your own effort each day.
- Every Done press on a task or habit gets an immediate reward.
- Progress must be visible: skills, stats, relationships and plot.
- The daily MP budget exists to practise prioritising: choosing real, important work over distractions and busy work.
- Surprise matters: the narrator learns your tastes through the story, not through questionnaires you read.
- No death and no guilt. Falling behind creates a recovery arc, not a punishment.

## 4. Settled decisions

### 4.1 Novelty and randomness

- Dice and random tables decide **what** happens. The AI narrates **how**.
- The narrator writes the random tables (events, complications, rewards) in your world's voice, using your quiz answers. Tables are plain notes that dice roll against, so the randomness is real.
- The event log records how often each entry comes up. Overused entries are retired and new ones are added.
- New entries go live **unseen**, to keep the surprise. Every result has a "not for me" button that retires that entry and teaches the narrator your taste. The hard limits from the quiz ("never include") are checked before anything goes live.
- Progression comes from skill levels, stats, the plot and relationships with characters.

### 4.2 Architecture

- **Task ownership:** TaskNotes is the task layer; TaskRPG is the RPG resolution and undo wrapper. Native task creation, scheduling, statuses and user fields are not duplicated in QuickAdd.
- **Hybrid:** Obsidian is the UI (buttons, hero sheet, dashboard, map). The narrator and characters run in Vault Operator, an AI agent plugin inside Obsidian that reads and writes the vault. It is desktop only, and it uses Gemini or GitHub Copilot as the model (see 4.24 and 4.38).
- **One agent per character,** and one for the narrator, each with its own persona file. You chat with them in the Obsidian sidebar, not in a terminal. The agent loads the persona file, relevant character-scoped memory and the selected campaign's story log (see 4.4). Treat every vault file as potentially model-visible.
- When a session ends, the agent writes a **summary plus extracted changes** (new facts, relationship shifts, plot events) back to the vault. Full transcripts are not saved.
- The same agent setup runs the narrator, the morning briefing and the random-table refresh.
- **Story output when you press Done on a task (v1):** a script rolls the dice and instantly shows a short result drawn from the tables. The narrator turns the day's results into prose in the next morning briefing.
- **Later:** a button calls the narrator live (for example "continue-story" or "make-move"). The dice and tables are built so only the narration step changes.
- Obsidian can't run anything while closed, so deadline checks run when you open the vault or press a button, and they back-fill any windows that closed in the meantime.
- Vault Operator can't run a terminal, so it can't build or test the engine. A coding agent does that (see 4.23).

### 4.3 Narrator and characters

- The **narrator** is a wise-wizard or fortune-teller persona who speaks to you directly. It has a persona file with the same structure as the characters.
- **Onboarding** is one longer quiz of about 20 questions (genre, tone, character types, themes, pet peeves), plus a short "never include" list of hard limits. Answers are saved as you go to a GM-only preferences note. You can pause and resume. The narrator builds the world, the party and the first tables from the answers.
- **The narrator keeps learning through the story**, using forks in the plot and character reactions, and infers your tastes from your choices. The preferences note is for the GM's workflow, not a privacy boundary. Direct questions are rare and skippable.
- **Cast:** a core party of recurring characters, each with a deep persona file, plus occasional NPCs generated from a shared template.
- Each character has a relationship note with you. Affinity changes are **proposed** by the agent in its session summary, a dice roll sets how big the shift is, and you approve them at the end of each session.
- **Morning briefing:** after you plan today in TaskNotes, the narrator opens the day, frames your planned tasks as quests and gives a short recap of yesterday's results. Sessions at other times are optional. Skipping a briefing costs nothing, and the next one just covers more days.
- **Write permissions:** the narrator and characters write only designated Story, Campaigns, World and Characters files (summaries, memory, story log, relationship notes, quest board, preferences, tables and approved canon), enforced by the folder rules in 4.15. HP, MP and skill XP are owned by the engine.
- Multiple campaigns may take place in the same world. They reuse shared world lore, characters and approved canon, while keeping campaign story logs, arcs and quest boards separate. A campaign-specific event becomes shared canon only when explicitly approved.
- Talking to characters costs no MP.

### 4.4 Memory (layered)

- A **shared story log** holds world-level events approved as canon across campaigns. Each campaign also has its own story log, so campaign-specific events do not silently become shared canon.
- **Character-scoped memory** holds one-on-one conversations. This is narrative organization, not a privacy boundary: these files are still potentially model-visible.
- A short "who knows what" note tracks in-fiction secrets. A character learns a fact only if you tell them, or if another character tells them in-fiction. Dice can decide whether a secret leaks.
- **Layered memory keeps each character manageable over months.** A short core facts note (under about a page) is always loaded, the last 10 sessions are kept in detail, and older sessions are compressed into monthly digests (defaults). You can **pin** key moments, such as a promise or a big win, so they are never compressed. Every original summary stays in GitHub history. The narrator and characters do the compression in their assigned folders.

### 4.5 Stats and inputs

- Stats are **purely game state**. No real energy or health data is entered or modelled.
- Tasks and habits are real. For tasks, mark Done in TaskNotes, then run TaskRPG’s manual **Task done** command. Habit Done remains a separate macro. The RPG macro stamps the event time itself.
- A TaskNotes status change alone does not resolve an RPG event in phase 1. Run Task done explicitly; an automatic Workflows trigger is optional phase 2.
- External sync is a later feature.
- **Five skills:** Focus (deep work and project progress), Vitality (sleep, food, movement, self-care), Craft (making and finishing things), Mind (learning, planning, admin) and Presence (social and relationships).
- Each task or habit feeds exactly one skill.

### 4.6 Daily MP budget

- MP has a maximum of **10** and refills to full every morning.
- **Plan in TaskNotes** (see 4.10). TaskRPG reads the TaskNotes scheduled date: scheduled for today means planned and normal MP cost; otherwise the task costs **+1 MP**. This replaces the custom Plan task script and its plannedDate field; no separate plan-lock mechanism is required for this phase.
- Task size sets the cost: small 1, medium 3, large 5.
- **XP** for a task equals its size (1, 3 or 5), plus 50% if it is important and plus 50% if it is urgent. A task with neither flag earns base XP only.
- **Overdraft:** past 0 MP you can keep pressing Done on tasks. They earn half XP (rounded up) and roll with a −1 "Tired" penalty. HP is untouched.
- **Wounded** (0 HP): every task costs +1 MP until you recover. Habits are exempt.

### 4.7 Tasks, dice and story

- Pressing Done on a task is a game turn. The script rolls **2d6 + skill dice bonus − HP penalty − Tired penalty** (if any), shows an instant table result, and the story moves forward.
- The task's skill chooses which skill the roll uses.
- Every task uses the same thresholds. Task size changes how big the story result is, not your odds.
- A roll only changes the story. It never changes the XP or MP of the real task.

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

- You pick **3 to 5 core habits**. Each has its **own note**. Its frontmatter holds its block (morning, afternoon or evening) and its skill. Its body is a dated log of on-time, late and missed entries.
- A habit's Done button runs a macro that stamps the time, adds a line to that habit's note and shows the status line.
- **HP** has a maximum of 10. Completing a core habit within its block restores 1 HP. A late tick still earns skill XP but restores no HP.
- Missing a block's deadline costs 1 HP, capped at 2 HP lost per day. Rest days, pause and weekends are exempt (see 4.17).
- At 0 HP you are **Wounded**: dice penalty −3, tasks cost +1 MP, and you can't start boss challenges. The narrator switches to a recovery arc with gentle Vitality quests and self-care rewards. One completed habit lifts you out of it.
- **Habits cost MP, much less than tasks.** The cost depends on the share of eligible days in the last 30 that you completed the habit on time, counted from that habit's own note. Only on-time completions count. A new habit starts at 2 MP. Eligible days are weekdays that aren't rest or pause days, and a weekend, rest or pause day counts only if you did the habit.
- A habit gives HP and XP at every cost level, including 0 MP. Habit XP is small, 1 per press.
- Habits get **no story beat and no dice roll**. Pressing Done shows a single status line, for example: "Morning routine complete! +1 HP, +1 XP, −2 MP (MP 8/10)".

| Share of eligible days completed on time (last 30) | Habit cost       |
| -------------------------------------------------- | ---------------- |
| Under one third                                    | 2 MP             |
| One third to under two thirds                      | 1 MP             |
| Two thirds or more                                 | 0 MP (automatic) |

### 4.9 Skill levels

- Each skill has **10 levels** with its own XP.
- The **dice bonus** is +1 at levels 2, 4, 6, 8 and 10, so +5 at the top.
- At levels **5 and 10**, tasks in that skill cost 1 MP less each. No task ever costs less than 1 MP.
- The XP curve is a rough guide: level 2 at 10 XP, level 3 at 25, level 4 at 45 and level 5 at 70, then slowing so level 10 takes months.

### 4.10 Tasks, planning and the daily note

- **Task layer:** TaskNotes owns creating tasks, planning/scheduling, statuses, and skill, size, urgent and important user fields. Use its native task interface and views; do not recreate these with QuickAdd New task or Plan task scripts.
- **Field mapping:** TaskRPG reads a stable task identity, skill, size, urgency, importance and the TaskNotes scheduled date. Confirm property mappings and configured status values against the installed TaskNotes version rather than assuming a fixed schema.
- **Planning:** schedule tasks in TaskNotes. A scheduled date matching today supplies the engine’s planned flag and avoids the unplanned MP surcharge. The old plannedDate property is not the planning source.
- **Phase 1:** finish the work, mark the task Done in TaskNotes, then run the manual Task done command with that note open. TaskRPG rolls dice, appends to Engine/Events.md, applies XP/MP and displays the result card. Task completion status and RPG resolution are distinct: duplicate protection must use recorded RPG resolution, not reject a note merely because TaskNotes already marks it Done.
- **Optional phase 2, later:** investigate TaskNotes Workflows invoking /task-done on an In Progress → Done transition. This is not an implemented integration or a verified command/API; validate the trigger and task context separately before enabling it.
- **Undo last:** reverse the newest eligible RPG action with a correcting event, preserving original dice and history. TaskNotes owns task statuses; any task-status restoration must use verified configured mappings, not hard-coded backlog/planned values.
- A task may optionally link to a campaign for story framing. Resolution records one global game event and awards shared progression once, even if it advances a campaign story.
- **Unfinished tasks:** remain managed in TaskNotes and may be rescheduled there without a penalty. No custom nightly reset or automatic status rewrite is required for Step 3. The briefing may mention unfinished quests without creating catch-up work.
- **Daily note:** your journal, plus a "Today's turns" section pulled from the event log (task results, habit status lines, and a link to the session summary).
- **Quest board:** the narrator writes a "Today's quests" note in the selected campaign's files. Each quest links to its real task. The daily note can show each quest's title beside its task. The narrator never edits task records or task state.
- **Pruning:** only the last 30 daily notes stay in the vault. Older ones live in GitHub history. This is safe only because nothing the game needs lives only in a daily note, so the event log, story log, hero note, habit notes, quest board, character memory and preferences are never pruned. Each daily note must be committed before it is removed.

### 4.11 Game state and engine

- An **event log** is the source of truth for the player's shared game progression. It is one shared file, and every action (a task Done, a habit Done, a missed deadline, an overdraft, a rest day, a pause, a session) adds one line.
- A task linked to a campaign records that campaign ID as narrative metadata in its event; it does not create a second event or separate game progression.
- If you log on your phone and your desktop before syncing, Fit saves the conflicting copy in its `_fit` folder. You merge it by hand and press recalculate.
- After each action the script **recalculates** HP, MP and skill XP from the log and saves them to the hero note, which the Meta Bind panels display. A recalculate button repairs any drift or hand-edit.
- The hero's game progression is shared across campaigns because it reflects one player's real tasks and habits. Each campaign has separate arcs, quests, story history and campaign-specific outcomes. A task may be linked to one campaign for narration; shared progression is awarded once.
- TaskNotes owns task creation, planning, statuses and user fields. QuickAdd wrappers own Task done resolution, Undo last, habit Done, rest day, pause/resume, recalculate and missed-habit back-filling as those features are built.
- A coding agent in VS Code (GitHub Copilot) writes and maintains the scripts, with each script owned by one button.

### 4.12 Plugin stack

About 20 of the 70 plugins on your list were read in full on their community pages. The rest were sorted by name and purpose only.

| Group   | Plugins                                                                                                                        | Note                                                                                                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core    | QuickAdd, Meta Bind, Dice Roller, Templater, Bases (built in), Lazy Plugin Loader                                              | QuickAdd calls the standalone engine; Meta Bind provides buttons and panels. Add Dataview only if you need calculated inline values. Lazy Plugin Loader delays plugins to keep startup fast                      |
| Backlog | TaskNotes                                                                                                                      | Owns task creation, planning, statuses, user fields and views; TaskRPG wraps resolution and undo. Verify installed field mappings.                                                                               |
| Later   | Storyteller Suite or Atlas VTT, Text Generator or Vault Operator, presentation plugins                                         | Storyteller Suite covers party notes and maps. Atlas VTT is for tactical battle maps and is desktop-only. Text Generator or Vault Operator would only be needed for a live narration button                      |
| Skip    | Buttons, Life RPG, LifeQuest, RPG Stat Tracker, tabletop prep plugins, Checklist, calendar and sync plugins, general utilities | Buttons is discontinued and replaced by Meta Bind. The gamification plugins keep their own XP rules, which clash with yours. Local REST API is optional, needed only if the agent must trigger Obsidian commands |

### 4.13 Boss challenges

- A boss is a **short-term challenge** you beat in the real world, not a dice fight. For example: meditate 3 days in a row at max HP.
- A challenge unlocks when a skill reaches **level 5 or 10**, or when a **story arc finishes**.
- The engine has a **fixed menu of challenge types**, such as "do habit X for N days in a row", "stay at HP of Y or more" and "finish N tasks in skill Z within W days". The narrator picks one, fills in the numbers within the engine's limits (for example a minimum of 7 days, and a goal near what you've recently managed) and wraps it in story. New types can be added to the menu later.
- You see the criteria when the boss is announced. The engine checks the event log automatically, so success is never an honour system.
- One challenge is active at a time, failing costs nothing, and you can retry it. A Wounded day can't start one.
- **Reward:** a story reward plus an item. The item carries one small perk from a fixed list the engine owns, such as +1 to dice rolls in that skill or 1 MP off its tasks. The narrator only names and describes the item. There is a cap of one perk per skill.

### 4.14 Build order

- Build **one small piece at a time** and try each before the next (see 4.33). The first piece is a **thin slice of everything**: one habit, one task, the engine, a starter table, the quiz, the narrator, one companion and the morning briefing, all wired together end to end. The narrator, the companion and the tables can't be placeholders.
- The first slice uses one campaign. Keep campaign identity explicit in narrative records so other campaigns can later reuse the same world and player progression without sharing campaign-specific plot state.
- The slice starts with the **full onboarding quiz**, run by the narrator as your first interaction. You can pause and resume it. The slice begins on the day the quiz finishes.
- After the first week, you decide whether to widen or fix before adding anything new. Then widen one thing at a time: more habits, skills, tables and characters, then projects and arcs, companion team-ups, and boss challenges.

### 4.15 Vault folders and campaign boundaries

The vault is organized by ownership and by what is shared across campaigns. A world can contain multiple campaigns; campaign notes never replace or duplicate shared world canon.

| Folder                                | Contents                                                                                                                    | Who writes it                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `Engine/`                             | Shared event log, derived hero state, habit records and settings                                                            | QuickAdd macros only                        |
| `Scripts/`                            | Standalone engine and thin QuickAdd scripts; visible because QuickAdd requires it                                           | Coding agent                                |
| `World/`                              | Shared world canon: rules, regions, factions and reusable NPC facts                                                         | Narrator, with approval                     |
| `Story/`                              | Shared story log for events approved as cross-campaign canon, shared random tables, narrator preferences and campaign index | Narrator, with approval                     |
| `Campaigns/<campaign-id>/`            | One campaign's story log and timeline, arcs/projects, quest board and campaign-specific outcomes                            | Narrator, with approval                     |
| `Characters/`                         | Stable hero and companion profiles plus shared character facts                                                              | User and narrator/characters, with approval |
| `Campaigns/<campaign-id>/Characters/` | Campaign-scoped character session summaries and relationship changes                                                        | Relevant character agent, with approval     |
| `Journal/`                            | Daily notes and generated "Today's turns" view; only this folder is pruned after backup                                     | User and macros                             |
| `TaskNotes/`                          | TaskNotes-owned task records, scheduling, statuses and user fields, optionally linked to a campaign                         | User and TaskNotes                          |

- The hero's profile contains stable identity information only (for example name, appearance, background, class, personality and goals). It does not hold HP, MP, XP, skill levels, inventory, active quests or other live state. Shared live game state belongs to the engine and is recalculated from its event log.
- Shared progression belongs to the player, not to an individual campaign. Campaign story state is isolated by campaign ID; one task completion can advance shared progression only once.
- The existing `Campaign/` folder remains the current campaign's legacy location until a separate, approved migration. New campaign support follows `Campaigns/<campaign-id>/`; do not mass-move existing notes as part of this documentation change.
- Folder boundaries and plugin permissions protect ownership and prevent accidental edits. They do not make any content confidential or guarantee that an agent cannot read it. There is no `Private/` area.
- Vault Operator may write only to the designated Story, Campaigns, World and Characters areas; it must not write Engine state, task lines or user-authored journal content. The user approves model access and writes. These restrictions protect data integrity, not privacy.
- The macro scripts live in the visible `Scripts/` folder. A coding agent in VS Code writes and maintains them.

### 4.16 Devices and sync

- **Phone for quick taps, desktop for everything else.** Task resolution, habit presses and TaskNotes task creation are intended to work on your phone; integration remains subject to device validation. Planning, engine changes and character chats stay on desktop.
- Fit syncs the vault between your phone and desktop. Safe changes merge automatically, and genuine conflicts are saved in a `_fit` folder for you to resolve.
- Plugin settings are not synced by default, so the QuickAdd macros and Meta Bind panels need those settings opted in or set up again on the phone.
- Mobile support for the QuickAdd macros and TaskNotes is untested. It gets checked in the thin slice (see 4.14).

### 4.17 Rest days, pause and weekends

- **Rest day:** a one-day pass that you press before or after the day. No HP loss and no morning plan needed. Default: 4 a month.
- **Pause:** freezes the game for as long as you need. There is no HP loss, and paused days are left out of every habit's 30-day measure. The narrator checks in gently after 7 days (default). Resuming asks for nothing and leaves no backlog to catch up.
- **Weekends are optional.** Missed blocks on Saturday and Sunday cost no HP and don't count against a habit. If you do a habit or task anyway, it earns full XP and HP and counts as an on-time day.
- **If you disappear without pressing pause,** the game carries on. HP keeps draining (capped at 2 a day) and you return Wounded. One on-time habit lifts you out of Wounded, and the narrator offers a gentle first quest.

### 4.18 Projects, arcs and quests

- A **project** is an epic story, for example "build the app". Each **work stage** is an **arc**, and each arc has a backlog of **quests**, which are real tasks dressed in story.
- **Limit (default):** at most 3 projects open at once. A new project waits on a shelf until you finish or park one. The narrator weaves your open projects into one world.
- **Planning a project:** you describe it in a few sentences. The narrator proposes the arcs and a starting quest list, and you edit and approve it. Only the current arc is fully detailed. Later arcs stay as a one-line placeholder until the previous arc finishes, and then the narrator proposes the detail for the next one.
- **Gate (default):** the next arc unlocks when all the required quests in the current arc are done. You can mark any quest optional or cut it with no penalty, so one stuck task can't freeze the story.
- **Finale (default):** finishing an arc can unlock a boss challenge (see 4.13).
- **Weekly focus project:** when you plan on Monday you pick one project as your focus. Its quests earn +25% XP (default), stacking with the important and urgent bonuses. Nothing else is restricted.
- This replaces the idea of fixed-length seasons. Novelty inside a long arc comes from the dice, the tables and conversations with characters.

### 4.19 Companions and the accountability partner

- Each party member is tied to one of your five skills, which is their **specialty**.
- At affinity milestones a companion gives a small perk in their specialty skill: +1 on that skill's dice rolls or 1 MP off its tasks (defaults). There is a cap of one companion perk per skill.
- **Team-up:** when you plan your day you can optionally tag a task with a party member. It costs no extra MP. Finishing the task earns the companion XP in their specialty skill and raises affinity, by a dice-sized change that the agent proposes and you approve.
- Companions level only through team-ups, on the same XP curve as your skills (default).
- **Accountability partner in v1:** when you press Done on a team-up task, the partner reacts with an instant line from a table, and the fuller reaction comes in your next chat. Chats for advice (a kickoff before a task and a debrief after) are available any time, since talking to characters is free.
- Live work sessions with periodic check-ins are a later feature, because they need a running session on your desktop.

### 4.20 Journal access and real talk

- Agents receive only the notes needed for the current interaction, not the whole journal by default. Any note they do read may be sent to the configured model provider. No vault file or folder is private by guarantee; do not store content in the vault that you would not consent to sending to that provider. Agents write only to their designated Story, Campaigns, World and Characters areas (see 4.15).
- Only the narrator or game system gives **real-talk lines**: a short, plain, out-of-story line that follows an in-character one. Characters stay in the fiction. They give advice only when you ask, and otherwise react to your stats and actions.
- Defaults: at most one real-talk line a day, and only when planned MP is over budget, a focus project has been untouched for a week, or HP is at 0. The wording is neutral and kind, with no guilt.

### 4.21 Rewards, loot and inventory

- Rewards stay inside the game. There is no real-world reward list and no coin economy.
- A successful task roll can drop **loot**: a flavour item that the narrator names and describes from the quiz tone and the current arc. Default: a one-in-three chance on a success (a die roll where a 5 or 6 drops loot).
- Only boss rewards carry a stat perk (see 4.13). Loot never changes the maths.
- The engine stores the inventory, and the narrator only names and describes items.
- You can give items to party members as gifts, which raises affinity. The agent proposes the change, a dice roll sizes it, and you approve it.

### 4.22 Morning briefing trigger

- A "morning briefing" button in Obsidian runs a QuickAdd macro that starts Vault Operator (through an Obsidian command) after you plan your day. The briefing appears in a note.
- This is desktop only. If the button route doesn't work reliably in the thin slice, the fallback is to open the narrator agent in the sidebar and paste a short prompt, or to save the prompt as a Vault Operator skill and run it by name.
- Whether a QuickAdd button can start Vault Operator with a prepared prompt is untested, so it gets checked early in the thin slice.

### 4.23 Engine design

- All the rules live in **one engine script**: plain JavaScript with no dependencies. The QuickAdd macros only call it. It reads the event log and returns HP, MP, XP and results.
- A coding agent in VS Code (GitHub Copilot) writes automated tests for the engine and runs them in the terminal. The same script runs from the terminal without Obsidian open. Vault Operator can't run a terminal, so it neither builds nor tests the engine.
- It should run the same in QuickAdd on desktop and on your phone, though the phone is untested.

### 4.24 AI models by job

- A stronger model runs the character chats, the narrator and the morning briefing, because personality is the part most sensitive to model quality. Default: the strongest model your provider offers (Gemini, or a model available through GitHub Copilot).
- A smaller, faster model runs session summaries, memory compression and housekeeping. Default: a smaller model from the same provider, if Vault Operator lets you choose per agent (untested).
- After the first week, check whether the characters feel alive, and measure the real running cost and any rate limits during the thin slice. Review the configured provider's data terms before sending vault content; never rely on a folder name, ignore file or plugin setting to make a note private (see 4.38).

### 4.25 Reminders and result display

- **Reminders:** you set 3 to 5 recurring alarms or calendar events on your phone, one per core habit block. The wording is a gentle prompt, such as "morning routine block closes at 10". They aren't linked to the game and don't know whether you've already pressed Done.
- **Task result card:** pressing Done on a task opens a card showing the 2d6 roll, the outcome tier, the table result, the XP and MP changes and any loot drop. You tap anywhere to dismiss it. The result is also logged under "Today's turns" in the daily note.
- **Habit toast:** pressing Done on a habit shows a quick one-line status message (the format in 4.8).
- How pop-ups behave on mobile is untested, so it gets checked in the thin slice.

### 4.26 Hero and party growth

- **The hero** is an alter ego you design, who shares some of your traits and goals. The narrator proposes a name, background and class from your quiz answers and you edit it. You can change them at any time without affecting your stats.
- Your five skills are the hero's stats, and your projects are the hero's epic stories. The hero has a persona file like the other characters. Companions talk to the hero in character. The narrator's real-talk lines speak to you directly, outside the story.
- **Party growth:** you start with one companion. The quiz picks the skill that companion covers, based on what you most want to improve. New companions join through the story when you finish an arc or a boss challenge, each covering a skill that has no companion yet. You approve each arrival.
- The limit is 5 companions, one per skill (default). Other characters can be added as NPCs from the shared template, without the skill, perk or XP system.

### 4.27 Undo

- An **"undo last" button** adds a correcting line to the event log that reverses the last action (MP, XP, HP and any loot). The log keeps its full history and nothing is erased.
- Defaults: undo works only for actions from the same day, one at a time, newest first. It can't be used to re-roll, because pressing Done again uses a fresh roll that is logged as a repeat.
- There is no confirmation step before a press, so the instant reward isn't slowed.

### 4.28 Dice threat level

- Each project has a **threat level** that rises by 1 for every finished arc, capped at +4 (default). It raises that project's roll thresholds. At threat +3, for example, a success needs 12 or more and a partial success needs 9 to 11.
- Rolls for tasks that don't belong to a project use the base thresholds (9 or more, 6 to 8, 5 or less). Boss challenges aren't dice-based, so they are unaffected.
- This keeps setbacks possible and rolls tense as your skill bonus grows to +5.

### 4.29 Task sizing help

- Size is a TaskNotes user field selected by the user. The custom New task form and its usual-size suggestion are removed from Step 3; any future sizing assistance requires a separate decision.
- On Sundays the recap adds one neutral line flagging tasks that stayed open much longer than their size suggests, for example "Two tasks you sized small were open more than 7 days. Larger next time?" It uses only the dates already in the event log.

### 4.30 Reviewing progress

- A live dashboard shows HP, MP, skill levels, habit measures and tasks done.
- On Sundays the narrator adds a weekly recap to the morning briefing (default): planned versus completed MP, which project got your focus, which habits changed cost tier, and one thing the narrator noticed. The wording is neutral, with no guilt.
- A lightweight monthly page updates on its own.

### 4.31 Keeping it fresh

- The narrator offers a **shake-up** when it spots staleness: your Done presses drop below half your 4-week average for 7 days, or you use "not for me" three times in a week. There is at most one offer every two weeks (defaults).
- A shake-up is one of: a tone shift, a new place or character, a side event, or new table entries. The narrator picks one from your quiz options, and you can ask for a different one.
- The offer is a single line in the briefing, with no pressure to accept. A "shake it up" button is also available any time.
- The signals come from the event log, so this works without the AI.

### 4.32 Day boundary, offline mode and portraits

- **Day boundary (default):** your day rolls over at 4:00 AM, so a habit done at 1 AM counts for the previous day and late nights don't cost HP.
- **Offline engine (default):** the game works without the AI. If Vault Operator or your model provider is unavailable or you reach a usage limit, the buttons, dice and stats still run, and the narrator catches up on the story later.
- **Portraits:** characters are text only for now, except that each character profile (the hero and the companions) holds a single portrait image. Ambient sound, scene images and spoken voices are later features.

### 4.33 Build plan

- Build one small piece at a time, and try each before the next. Default order: the engine with its tests, a habit button, the task button with dice and a placeholder table, the quiz and narrator, then one companion and the morning briefing.
- Each step ends with something you can press and see.
- The build is itself a project, so each step can be a quest in your first arc.

### 4.34 Tutorial arc and unlocks

- The first weeks are a **tutorial arc**. The narrator introduces roughly one new mechanic a week, in character, and a skip-ahead command unlocks the next one early (defaults).
- Week 1: habits, Done and the dice, with no HP loss. Week 2: the daily MP budget and planning. Week 3: HP deadlines, weekends and rest days. Week 4: projects, the focus project and the threat level. Companion team-ups and loot arrive after that.
- Rules that aren't unlocked yet appear in the settings note but stay switched off.

### 4.35 Settings note

- One **settings note** holds every tunable number (max MP, habit cost tiers, XP bonuses, loot chance, rest days a month, threat cap, day rollover, shake-up triggers) and your preferences (real talk on or off, briefing length, which model runs which job). The engine reads it, and the defaults in this PRD are its starting values.
- Meta Bind shows the values as simple fields on one page. The engine ignores values outside a sensible range, so a typo can't break the game.
- **A setting change never rewrites your past.** Each change is logged with its date. The engine uses the old rules for earlier days and the new rules from then on, so earned XP, levels and streaks never shift. A "re-run history with new rules" command could be added later.

### 4.36 Finished tasks and low points

- **Finished tasks:** after 30 days they are folded into one note per month, with a line for each task (name, skill, size, project and date done). The individual notes are removed, and the originals stay in GitHub history. The cleanup runs in the same step as the daily-note pruning when you open the vault. Tasks in an unfinished arc are kept until the arc is done.
- **If your journal shows you're struggling:** the narrator carries on as normal. There are no proactive check-ins and no automatic pause. Rest days and pause are always yours to use.

### 4.37 Trial week and sharing

- **Trial week:** the first week uses a light setup: one habit, a few tasks and the narrator. Your current routines keep running alongside. At the end you answer a one-minute check (did you want to open it, did anything feel like a chore, did you miss anything). The answers are written to the event log so they can be compared with the week-4 gut check. Then you decide to continue, adjust or stop.
- **Built for you, shareable later:** the engine reads skills, names and numbers from the settings note and doesn't contain them. The engine, shared world, campaigns, characters and journal stay in separate folders, so the vault could be packaged as a starter vault later. Sharing is decided after the first month of real use.

### 4.38 Vault Operator and building tools

- **The narrator and characters run in Vault Operator,** an AI agent plugin for Obsidian (desktop only). The narrator and each character is a separate agent with its own persona file. The model is Gemini (a free key) or GitHub Copilot.
- **Building tools:** the engine, its tests and the QuickAdd macros are built in VS Code with the GitHub Copilot extension. Vault Operator can't run a terminal, so it can't build or test the engine. Check which coding agent features your Copilot plan includes before step 1.
- **Model visibility:** treat every vault file as potentially model-visible. Agents should receive only the context needed for a task, but do not rely on folders, ignore files or plugin permissions for confidentiality. Do not store content in the vault that you would not consent to sending to the configured provider.
- **Free Gemini data use:** Google's terms say the free tier uses what you send to improve its products, and human reviewers may read it. The exception for the EEA, Switzerland and the UK doesn't cover Australia. GitHub Copilot's data terms haven't been checked.
- **Tested in the thin slice:** whether Vault Operator's memory can be kept per character and campaign so story continuity does not mix; whether write approvals keep agents inside their designated Story, Campaigns, World and Characters areas; whether a QuickAdd button can start a chat with a prepared prompt; whether you can choose a model per agent; and how well the models hold a character's voice, within the provider's rate limits. Read/write restrictions are not privacy guarantees.
- How a Gemini or Copilot model responds to distressing journal entries isn't something this PRD controls (see Q74: no check-ins).

## 5. Leaning (to confirm)

- Further debuffs beyond the HP penalty and "Tired" may be added once the basic version has been played.
- Storyteller Suite for party notes and maps, with Atlas VTT only if you want tactical combat.

## 6. Build defaults (refine during the build)

| Item                                                     | Default                                                                                                                                                                                                                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Event log and hero state                                 | Plain readable text, one line per action (date, time, type, skill, size, roll, outcome, XP, MP). Engine-owned derived state holds HP, MP, XP and skill levels, inventory, project threat and unlocked rules; the hero profile contains stable identity only |
| Engine                                                   | Takes the event log plus the settings note and returns the new state and the action's result. One automated test per rule in this PRD, plus tests for setting changes and undo                                                                              |
| Settings note                                            | One table with a minimum and maximum beside each value                                                                                                                                                                                                      |
| Monthly task archive                                     | One line per task (date done, name, skill, size, project)                                                                                                                                                                                                   |
| Memory notes                                             | A core facts note under a page (who they are, what they know about you, promises, running jokes), and one paragraph per month in the digest                                                                                                                 |
| Hero persona file                                        | Name, background, class, personality, goals, flaws and how they relate to each skill                                                                                                                                                                        |
| Multiple campaigns in one world                          | Shared world canon and player progression; each campaign has an independent story log, arcs and quest board                                                                                                                                                 |
| Phone                                                    | Test the habit button in step 2. Fallback: log on desktop, with a catch-up button reading a plain note from your phone. Fit syncs only the plugin settings the buttons need                                                                                 |
| QuickAdd starting Vault Operator with a prepared prompt  | Test in step 4. Fallback: paste the prompt into the narrator chat, or save it as a Vault Operator skill                                                                                                                                                     |
| Result card                                              | One screen, tap to dismiss. If pop-ups misbehave on mobile, the phone shows a short notice instead                                                                                                                                                          |
| Undo                                                     | Same-day tasks and habits only. Boss challenges and gifts can't be undone                                                                                                                                                                                   |
| Projects                                                 | One note per project, with arcs as headings and quests as TaskNotes tasks linked to it. The narrator's proposals are saved as a draft note, and you approve one by moving it into the project                                                               |
| Companions                                               | Affinity runs from 0 to 10, with a perk at 5 and a second at 10                                                                                                                                                                                             |
| Loot                                                     | Each item note has a name, description, rarity (common or rare), where found and who got it. About 10 item templates to start, with no inventory limit                                                                                                      |
| Random tables                                            | One note per table, with one weighted line per entry. About 5 tables to start. "Not for me" adds the entry to a retired list                                                                                                                                |
| Portraits                                                | Any image tool, decided when you write the first persona files                                                                                                                                                                                              |
| Boss challenges                                          | The three example types, with perks of +1 dice in a skill or −1 MP on its tasks                                                                                                                                                                             |
| Threat level, shake-up triggers, XP curve, tutorial pace | Use the defaults in this PRD and review after the first arc or month                                                                                                                                                                                        |
| Later                                                    | Live work sessions, the Google feed, maps and the live narration button                                                                                                                                                                                     |

## 7. Goals and success metrics (aspirational)

All of these are aspirational targets, to aim at and not to pass or fail. They replace the old metrics (MP on low-energy days, journal entries per week, unfinished planned tasks).

- **Using it:** at least one Done press on 5 of 7 days, for 4 weeks in a row, with upkeep under 10 minutes a day.
- **Routines:** one core habit reaches 20 on-time days out of 30 (the automatic tier) within 8 weeks.
- **Finishing:** the number of important tasks completed each week goes up.
- **Boredom check:** at week 4, a gut check on whether you still want to open it. This is your own call, and it covers the one thing the event log can't measure.
- **Story continuity:** the AI references the correct prior plot. This stays a manual spot-check.
- **Other things the log can show:** days with a morning plan, share of tasks that were planned, habits that reached 0 MP, skill level growth, conversations held per week, and how many table entries get a "not for me" veto.

## 8. Scope (draft)

**Must-have (v1, provisional), built in the order in 4.14:**

- Onboarding quiz, narrator persona, hero persona (with a portrait) and GM-only preferences note
- Tutorial arc that unlocks the rules in stages
- Trial week and a one-minute end-of-week check
- One tested engine script that all the macros call
- TaskNotes task creation, planning, statuses and user fields; QuickAdd wrappers for Task done, habit Done, rest day, pause/resume, Undo last and recalculate
- Event log and hero note, with Meta Bind panels for HP, MP and skill XP and levels
- Settings note for the game mechanics and your preferences
- TaskNotes backlog and scheduling views with skill, size, urgent and important user fields; no custom New task or Plan task macros
- Habit notes for 3 to 5 core habits, with the 30-day cost
- Dice Roller rolls (2d6) and narrator-built random tables, with a "not for me" button
- One companion at the start (up to 5 as the party grows), layered memory, session summaries and one Vault Operator agent per character
- Morning briefing (started by a button) and "Today's quests" note
- Result card for tasks and toast for habits
- Daily note with a "Today's turns" section, and 30-day pruning with GitHub backup
- Monthly archive of finished tasks
- Live dashboard and a Sunday recap in the morning briefing
- Projects with arcs and quests (up to 3 open), a weekly focus project and the threat level
- Companion specialty perks and team-up tags
- Loot drops and inventory, with gifts to party members
- Staleness shake-up offers
- Boss challenges with engine-checked criteria and perk items

**Should-have:** Catch-up button, Storyteller Suite maps or Atlas VTT, NPC generator, weekly review, live AI narration button ("continue-story", "make-move"), presentation plugins.

**Won't-have (v1):** Two-way sync with external apps (Todoist, Habitica, Trello), health-data sync, multiplayer, custom chat UI or plugin, AI-written story on every Done press.

## 9. Assumptions

- Obsidian on desktop, plus the mobile app for quick taps, synced with Fit.
- Vault Operator (desktop only) with Gemini or GitHub Copilot as the model, with read and write access to the vault. VS Code with GitHub Copilot for building and testing the engine.
- The vault is backed up on GitHub.
- You mark tasks Done in TaskNotes, then manually run Task done in phase 1. Habit Done remains a separate macro; each RPG macro stamps its event time.
- Core plugins and folders are installed, and you are willing to restructure.
- The small rules that were previously marked as assumptions (a roll never changes the real task's XP or MP, habits are exempt from the Wounded surcharge, late-added tasks count as unplanned, a catch-up button, free retries on boss challenges, pausing the quiz) were confirmed in Q56.
- Small details set as defaults (for example 4 rest days a month) can be changed.

## 10. User Flows for Scripts

### Completing a habit

```txt
 [Done button: Meta Bind or QuickAdd]
                  |
                  v
 [Habit note] --> [habit-done.js] --> [engine.js]
 (habitId, skill)  QuickAdd script     (owns every rule)
                  |
                  v
 +-- Then writes, in this order ---------------------------+
 |                                                         |
 |  [Events.md] --> [Habit note] --> [Hero.md]             |
 |   log line        History line     HP, MP, XP           |
 |   appended        added            rewritten            |
 +---------------------------------------------------------+
                  |
                  v
 [Notice: 8s, or 12s if it fails]
```

### Finishing a task

tba

### Undoing a task

tba

### Undoing a habit

tba

### Completing the day

tba

## 10. Future versions

- Sync with Todoist, Google Tasks, Trello, Kanban or Habitica through plugins. The backlog is designed as the integration point.
- Samsung watch health data feeding stats (out of scope for now).
- Live AI narration on every Done press.
- Live work sessions: the accountability partner checks in every 20 to 30 minutes while you work at your desktop.
- Ambient sound for each arc, scene images and spoken character voices.
- Custom chat UI for the characters.
- Learning your tastes from your behaviour in the event log, with proposals you approve.
- Packaging the vault as a starter others could use, decided after the first month of real use.
