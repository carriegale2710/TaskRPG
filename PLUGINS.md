
I opened the pages for about 20 of the 70 plugins, the ones that decide how the system works: tasks and timestamps, buttons and scripting, dice, gamification, maps, AI and startup speed. The rest I’ve sorted by name and purpose only, so treat those as first guesses.

**Findings that change the plan**

- **Buttons is out.** Meta Bind’s own docs call it the spiritual successor to the discontinued Buttons plugin. [moritzjung](https://www.moritzjung.dev/obsidian-meta-bind-plugin-docs)
- **The gamification plugins don’t fit your rules.** Life RPG tracks habits, water, rewards, XP and a wallet. LifeQuest (also labelled “Life RPG”) runs quests, XP, levels and streaks. RPG Stat Tracker awards XP for time spent in the vault. Your HP deadlines, MP budget and skill tags are custom, so I’d build that logic ourselves. [vibe rpg +2](https://community.obsidian.md/plugins/vibe-rpg)
- **Time-of-day stamps are a gap in the Tasks plugin.** An older forum thread says its done date is date-only, so it’s worth re-checking. TaskNotes stores completion as a full timestamp. Tasks custom date (not on your list) also writes completion times. [Task + Dateview. Timpestamp on task completed +2](https://forum.obsidian.md/t/task-dateview-timpestamp-on-task-completed/60804)
- **Habitica Sync would duplicate your game.** It shows Habitica’s own HP, XP and coins, so I’d save it for the later sync phase. [obsidian](https://community.obsidian.md/plugins/obsidian-habitica-integration)
- **Local REST API is optional.** It only serves while Obsidian is open. An agent can read the same Markdown straight from the vault folder. You’d only need it if the agent must trigger Obsidian commands. [mcp](https://mcp.directory/blog/obsidian-mcp-complete-guide-2026)[contextbolt](https://contextbolt.com/tools/mcp-server-directory/obsidian-rest/)**Suggested core stack (about 6 plugins)**

|Plugin|Job|
|---|---|
|QuickAdd|The game engine. Macros chain commands and your own JavaScript. A macro can also run at Obsidian startup.|
|Meta Bind|Buttons and display fields bound to frontmatter, such as HP/MP bars and “plan my day”. It makes buttons, input fields and view fields tied to properties.|
|Dice Roller|2d6 plus modifiers. It has 271k downloads and can return random lines or blocks from your notes. Its API can be called from Templater or Meta Bind buttons.|
|Templater|Daily note and persona templates (not re-checked).|
|Bases (built in), plus Dataview only if needed|Dashboards. Dice Roller can read Dataview inline fields, which is the one reason to add Dataview.|
|Lazy Plugin Loader|It delays plugin loading to get startup under a second. [quickadd.obsidian.guide +6](https://quickadd.obsidian.guide/docs/Choices/MacroChoice.md)|

**Add later, for immersion**

- **Storyteller Suite** covers party notes and maps in one plugin. It handles characters, locations, events and a Leaflet-based map system. [obsidianstats](https://www.obsidianstats.com/plugins/storyteller-suite)
- **Atlas VTT** is for tactical battle maps. It has tokens, fog of war, grids and dice and is desktop-only. Its 3D dice use graphics memory. It’s overkill for a story-first game unless you want tactical combat. [community.obsidian.md +2](https://community.obsidian.md/users/clutterfox)
- **Text Generator or Vault Operator** for a live “continue-story” button. Text Generator supports Anthropic. Vault Operator is an autonomous agent that can run commands and call other plugins’ APIs, but it needs Obsidian 1.13 or newer. I’d wait on both. [obsidian-textgenerator-plugin  by nhaouari +2](https://www.sourcepulse.org/projects/1228127)
- **Polish and visuals:** Homepage, Style Settings, Pretty Properties, Banners and Heatmap Calendar (not opened).

**Skip for now**

- **TTRPG prep tools:** RPG Manager, TTRPG Campaign Manager, World Builder, Town Forge, Fantasy Content Generator, Fantasy Statblocks, Initiative Tracker, TTRPG Tools – Controls, Moulinette. They’re built for a GM running a party at a table. Campaign Manager has under 1,000 downloads, and World Builder is similar. [obsidian](https://community.obsidian.md/plugins/ttrpg-campaign-manager)
- **Checklist:** It consolidates checklists into a sidebar, and its author is looking for a maintainer. It adds no timestamps. [obsidian](https://community.obsidian.md/plugins/obsidian-checklist-plugin)
- **Calendar and sync group:** Google Calendar, Sync Google Calendar, Google Tasks, GitHobs, GitHub Embeds, Zotero, Kanban, Reminder and Rollover Daily Todos. These are for the later sync phase, or not needed.
- **General utilities:** Linter, Harper, Omnisearch and similar. Nothing in the game needs them, and each one adds startup load.