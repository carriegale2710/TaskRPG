# TaskRPG: Build brief for Claude Code

**Companion to PRD v2.** Give Claude Code this brief and the PRD together (export both as Markdown). Build one step at a time, and stop at the end of each step so the user can try it before you continue.

## 1. Ground rules

- **Work in small steps.** Finish a step, say what to press to try it, and wait.
- **The engine is plain JavaScript** in one standalone module with no dependencies and no Obsidian code inside it. QuickAdd macros are thin wrappers that call it.
- **Every number lives in the settings note**, not in code. The engine reads skills, names and values from it, so the vault could be shared later.
- **Don't change rules without asking.** If a rule is unclear, ask the user. Placeholders are marked below.
- **Use the folder layout in PRD section 4.15.** Keep the engine, story, characters and journal in separate folders. Don't touch the user's other notes.
- **Scripts must live in a visible folder** (not a hidden one) so QuickAdd can load them.
- **Plugins to confirm in the vault first:** QuickAdd, Meta Bind, Dice Roller, Templater, TaskNotes (with the built-in Bases plugin switched on), Lazy Plugin Loader and Fit.

## 2. Step 0: Setup

Create the folders and a stub settings note, confirm the plugins above are installed, and check that QuickAdd can run a script from the scripts folder.

**Done when:** a QuickAdd macro runs a "hello" script on desktop.

## 3. Step 1: The engine and its tests

The engine takes the event log plus the settings note and returns the new state and the result of an action.

**Time:** the day rolls over at 4:00 AM.

**MP**

- Maximum 10, refilled each morning.
- Task cost by size: small 1, medium 3, large 5. An unplanned task costs +1. When Wounded, every task costs +1. At skill levels 5 and 10, tasks in that skill cost 1 less each. A task never costs less than 1.
- Past 0 MP you can keep going, but XP is halved (rounded up) and the roll gets a −1 "Tired" penalty. HP is unaffected.
- Habit cost depends on the share of eligible days in the last 30 that the habit was done on time. Under one third: 2 MP. One third to under two thirds: 1 MP. Two thirds or more: 0 MP. A new habit starts at 2 MP.
- Eligible days are weekdays that are not rest or pause days. A weekend, rest or pause day counts only if the habit was done.

**XP and levels**

- Task XP equals its size (1, 3 or 5), plus 50% if important, plus 50% if urgent, plus 25% if it belongs to the weekly focus project. The bonuses add together. Placeholder: round up to a whole number.
- Habit XP is 1 per press, including at 0 MP.
- Each of the five skills has 10 levels. Placeholder XP thresholds: level 2 at 10, 3 at 25, 4 at 45, 5 at 70, 6 at 100, 7 at 140, 8 at 190, 9 at 250, 10 at 320. Keep them in the settings note.
- The dice bonus is +1 at levels 2, 4, 6, 8 and 10.

**The roll**

- Roll 2d6, add the skill's dice bonus, and subtract the HP penalty and the Tired penalty. Each project has a threat level that raises every threshold: +1 per finished arc, capped at +4.
- Base thresholds: success at 9 or more, partial success at 6 to 8, setback at 5 or less. With threat T, success is 9+T or more, partial success is 6+T to 8+T, and setback is 5+T or less. Tasks that don't belong to a project use T = 0.
- A success has a one-in-three chance of loot (a die roll where a 5 or 6 drops). The engine only flags the drop. The narrator names it later.
- A roll never changes the XP or MP of the real task.

**HP**

- Maximum 10. An on-time core habit restores 1. A late press earns XP but no HP and doesn't count as an on-time day.
- A missed block deadline costs 1 HP, capped at 2 HP lost per day. Rest days, pause and weekends are exempt.
- Dice penalty by HP: 7 to 10 is 0, 4 to 6 is −1, 1 to 3 is −2, and 0 is −3. At 0 HP you are Wounded: tasks cost +1 MP and boss challenges are blocked.
- Missed blocks are back-filled when the vault opens.

**Rest and pause**

- Rest day: a one-day pass, 4 a month, no HP loss and no plan needed.
- Pause: freezes the game, with no HP loss. Paused days are left out of every habit's measure.

**Settings changes and undo**

- A settings change is logged with its date. The engine uses the rules in force on each day and never rewrites the past.
- Undo reverses the last action from the same day by adding a correcting line to the log. Nothing is deleted, and an undo can't be used to re-roll.

**Event log:** one shared plain-text file, one line per action (date, time, type, skill, size, roll, outcome, XP, MP). The hero note is a saved copy that a recalculate command can rebuild from the log.

**Tests:** one automated test per rule above, plus tests for settings changes, undo, the day boundary and back-filling.

**Done when:** all tests pass, and the same inputs give the same results when run from the terminal, for example `node engine.js recalc`.

## 4. Step 2: The habit button

Build a QuickAdd macro for "Done" on a habit, with one note per habit, the hero note and Meta Bind panels showing HP, MP and skill XP.

- Pressing Done stamps the time, adds a line to the event log and the habit's note, and shows a one-line toast, for example: "Morning routine complete! +1 HP, +1 XP, −2 MP (MP 8/10)".
- Habits get no dice roll and no story beat.

**Done when:** you press Done on a habit and see the toast, the log line and the changed HP. Test the same press **on the phone** and record the result. If it fails, log on desktop and use a catch-up button instead, and tell the user.

## 5. Step 3: The task button

- A **New task** form asks for the name, skill, size and flags (urgent and important), then creates the TaskNotes task. The form suggests the size used most often for that skill, with medium as the start.
- A button beside each backlog task adds it to today's list. This is the plan-my-day step.
- **Done for a task** deducts MP, rolls 2d6, picks a result from a placeholder table, applies XP and shows the result card (the roll, the outcome, the table result, XP and MP changes, and any loot). The user taps to dismiss it.
- An **undo last** button.

**Done when:** you add a task, add it to today, press Done and get the card, and then undo it. Check the card on the phone and use a short notice if pop-ups misbehave.

## 6. Step 4: The quiz, the narrator and the tables

Build Claude Code commands for:

- The **onboarding quiz** (pausable), run by the narrator as the user's first interaction.
- The **narrator persona** and a GM-only preferences note.
- The **hero persona** (an alter ego the narrator proposes and the user edits), with a portrait in the profile.
- About 5 **starter random tables**, written by the narrator from the quiz answers, one note per table with one weighted line per entry. The user approves them before they go live. The "not for me" button adds an entry to a retired list.

**Done when:** the quiz is finished, the hero is proposed and edited, and Dice Roller draws from the new tables when a task is done.

## 7. Step 5: One companion and the morning briefing

- One **companion** persona with a command like "talk to Elara". It loads her persona file, her private memory and the shared story log. At the end of a session it writes a summary and the extracted changes. The core facts note stays under about a page.
- A **morning briefing** button in Obsidian that launches Claude Code. It writes a briefing note and a "Today's quests" note, with each quest linked to its real task. If the button can't launch Claude Code, the fallback is typing `/briefing`.

**Done when:** you plan a day, press the briefing button, get the quests and have a first conversation that is remembered in the next one.

## 8. The trial week

The first week uses only one habit, a few tasks and the narrator, with the user's current routines running alongside. At the end the user answers a one-minute check (did you want to open it, did anything feel like a chore, did you miss anything), written to the event log. Then the user decides to continue, adjust or stop. Don't widen anything before that.

## 9. After the trial week

Widen one thing at a time, in this order: more habits and skills, then projects and arcs (up to 3 open, with a weekly focus project and the threat level), companion team-ups and perks, loot and inventory, then boss challenges. Follow the PRD for each.

## 10. Rules for the agent characters

- The narrator and characters write only to the Story and Characters folders. They never edit task lines.
- They can read the whole journal.
- Only the narrator or game system gives real-talk lines (at most one a day, kind and neutral). Characters stay in the fiction and give advice only when asked.
- Use a stronger model for chats, the narrator and the briefing, and a smaller one for summaries and housekeeping.
- The game must work without the AI. If Claude Code is unavailable, the buttons, dice and stats still run, and the narrator catches up later.
