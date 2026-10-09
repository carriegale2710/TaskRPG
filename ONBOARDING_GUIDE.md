## Onboarding Guide

New to SecondBrainRPG (or second brains in general)? This 15-minute guide gets you from zero to your first quest.

### Step 1 — Install Obsidian (5 min)

1. Download Obsidian from [obsidian.md](https://obsidian.md/) for your platform (Windows/macOS/Linux).
2. Create a new vault (e.g., `MyVault`) and open it.
3. Optional but recommended: enable the **Daily Notes** core plugin (Settings → Core plugins → Daily notes) and set the default folder to `Journal/`.

Obsidian is free for personal use and stores everything as plain Markdown files on your device.

### Step 2 — Create the folder structure (2 min)

Copy this exact tree into your vault (or use the provided `archivists-coast-setup.zip` and extract it):

```
MyVault/
├── 00 Inbox/
├── 01 Areas/
├── 02 Projects/
├── 03 Resources/
├── 04 Archive/
├── Campaign/
├── Journal/
├── World/
├── Templates/
└── atlas-vtt/   (created later by Atlas VTT)
```

This structure separates your second brain (`00`–`04`) from the campaign layer (`Campaign/`, `World/`, `Journal/`), so neither contaminates the other.

### Step 3 — Install the core plugins (5 min)

Install these from **Settings → Community plugins → Browse**:

|Plugin|Why|
|---|---|
|**Templater**|Dynamic daily/quest templates|
|**Dataview**|Live quest/MP dashboards|
|**Periodic Notes**|Weekly review notes|
|**Calendar**|Visual navigation of daily notes|
|**Text Generator**|AI Game Master (configure an AI provider)|
|**Life RPG**|Hero, XP, habits, reward shop|
|**Atlas VTT**|Maps, pins, fog of war (desktop only)|
|**Kanban**|Quest board view|

Set Templater’s template folder to `Templates/` and Periodic Notes’ daily folder to `Journal/`.

### Step 4 — Configure your GM (2 min)

1. Open **Text Generator** settings and add an AI provider (Anthropic, OpenAI, OpenRouter, or local Ollama).
2. Copy the provided `AGENTS.md` (root) and nested `Journal/AGENTS.md`, `World/AGENTS.md`, `Campaign/AGENTS.md` into your vault.
3. Bind the “GM Morning Quest” and “GM Evening Completion” templates to hotkeys (or use the Command Palette).

The `AGENTS.md` files teach your agent the campaign rules, MP thresholds, and journal structure automatically.

### Step 5 — Run your first quest (1 min)

1. Open today’s daily note (Calendar or Periodic Notes).
2. Fill in MP, energy, capacity, and 1–2 tasks.
3. Run **GM Morning Quest** → paste the framing into “Quest / story update.”
4. Do the work.
5. Run **GM Evening Completion** → the beat auto-writes into your journal and updates Story So Far.

That’s it—your first quest is complete, and your campaign has begun.

### Need help?

- **No second brain yet?** Start with just a `Journal/` folder and one daily note—add the rest later.
- **No AI provider?** Use a local model via Ollama (free, private) or skip AI entirely and write story beats manually.
- **Overwhelmed?** Start with only `Journal/` + `Campaign/02 Story So Far.md` + one quest. Add Atlas VTT and Life RPG once the habit forms.

## Troubleshooting

### Plugin conflicts or nothing happens

- **Check plugin order**: Templater and Dataview should be enabled before Text Generator, Life RPG, or Atlas VTT.
- **Restart Obsidian** after installing or updating any plugin—some only register their commands on launch.
- **Disable Safe Mode** if you’re manually installing plugins from GitHub (Settings → Community plugins → Safe mode → Off)

### MP/energy not updating in Dataview

- **Check frontmatter syntax**: `mp: 3` must be valid YAML (no missing colon, no extra spaces).
- **Confirm the field name matches** your Dataview query exactly (`mp`, not `MP` or `mana`).
- **Enable JavaScript queries** in Dataview settings if you’re using `dataviewjs` blocks.

### Story beats drift or contradict earlier plot

- **Always read Story So Far before generating**—your GM prompt should explicitly pull from `Campaign/02 Story So Far.md`.
- **Refresh the summary every 3–5 quests**—run the `summary` mode (or Text Generator template) to rewrite Story So Far with recent beats.
- **Add a rule to your AGENTS.md**: “Only advance existing plot threads; never invent new major arcs unless I ask.”

### Atlas VTT pins not linking to quests

- **Confirm the note path**—Atlas pins link to a specific Markdown file; if you moved a quest note, re-pin it.
- **Check that the quest note exists** in `World/Quests/` before trying to pin it.
- **Use the Note Pin Tool (`P`)**—click the map location, then select the quest note from the picker.

### Life RPG XP/habits not syncing with quests

- **Life RPG and SecondBrainRPG are separate systems**—there’s no auto-sync. Manually mark quest completion in both, or use the `gm_bridge.py` script to keep them aligned.
- **Check that habit XP values match** your quest template rewards if you want them to feel consistent.

### Journal structure getting messy

- **Lock the section order** in your `Journal/AGENTS.md` (Character Status → Today’s plan → Quest/story update → Reflection/diary).
- **Never let the AI reorder or delete sections**—add a rule: “Preserve existing section order and formatting unless I explicitly ask.”
- **Archive old daily notes** monthly if the folder gets crowded—move them to `04 Archive/Journal/`.

### AI generating irrelevant or generic beats

- **Add more context to your prompt**—include the last 2–3 story beats, not just the current quest.
- **Tighten your AGENTS.md style rules**: “Reference active plot threads by name; avoid generic fantasy filler.”
- **Use a higher-quality model** (Claude Sonnet/Opus, GPT-4) if local models produce weak prose.

### Still stuck?

- **Start a new Agent Chat** after editing any `AGENTS.md`—backends only pick up the latest version on a fresh session.
- **Simplify before adding**: if MP + habits + deadlines feels like too much, drop back to MP-only until the habit forms.
- **Check the Obsidian console** (`Ctrl/Cmd + Shift + I`) for plugin errors if nothing works at all.