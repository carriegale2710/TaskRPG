# World-Specific Agent Rules

## Purpose

This folder contains the campaign's canonical lore: quests, regions, NPCs, and
factions. These rules override the root AGENTS.md for anything related to
reading, writing, or editing files in this folder.

## Folder Structure (do not reorder)

- `Quests/` — one note per quest, linked from daily notes and Story So Far
- `Regions/` — location lore, linked from quests and daily notes
- `NPCs/` — character notes, linked from quests and regions
- `Factions/` — group/faction notes

Never rename, move, or delete these folders or their contents unless I
explicitly ask.

## Quest Notes

### Structure (do not reorder)
Every quest note follows this frontmatter + section order:

1. YAML frontmatter (quest, project, region, status, xp, skills, date_created)
2. `# [quest title]`
3. `## Real objective`
4. `## Campaign framing`
5. `## Acceptance criteria`
6. `## Reward`
7. `## Story result`

### Status transitions
- `active` → `complete` only when I explicitly say the quest is done
- Never auto-complete a quest based on task checkboxes alone
- Never reopen a `complete` quest without my explicit request

### Writing rules
- When generating a completion beat, read `status`, `xp`, `region`, and
  `## Campaign framing` from the quest note
- After writing the beat, update `status` to `complete` only if I confirmed
  completion
- Append the beat text under `## Story result` using this format:

```md
## Story result

_[generated beat text]_
```

- Never overwrite an existing `## Story result`—ask first if one exists

## Region Notes

### Structure
Every region note follows this frontmatter + section order:

1. YAML frontmatter (region, status, map)
2. `# [region name]`
3. `## Projects anchored here`
4. `## Active quests`

### Writing rules
- When a new quest is created in a region, add its wikilink under
  `## Active quests`
- When a quest completes, move its link from `## Active quests` to a new
  `## Completed quests` section (create if it doesn't exist)
- Never delete a region note or its linked projects unless I ask

## NPC Notes

### Structure
Every NPC note follows this frontmatter + section order:

1. YAML frontmatter (npc, role, faction, status)
2. `# [NPC name]`
3. `## Description`
4. `## Relationships`
5. `## Plot involvement`

### Writing rules
- When a story beat references an NPC, update `## Plot involvement` with a
  one-line dated entry (e.g., `- 2026-10-12: Confronted the artificer in the
  Deep Vault`)
- Never invent new NPCs unless I explicitly ask
- Never change an NPC's `role` or `faction` without my approval

## Cross-Referencing

- Always use [[wikilinks]] when linking quests ↔ regions ↔ NPCs
- Before generating any beat, read the linked region note and any NPCs mentioned
  in Story So Far for continuity
- If a referenced note doesn't exist, flag it rather than silently inventing one

## Style & Tone

- Match the lore-heavy, slightly humorous D&D tone established in Campaign Rules
- Preserve all existing frontmatter, formatting, and embeds unless I ask for changes
- Lead with the result, then explain only what helps me act

## Safety

- Ask before deleting any note, reverting changes, or bulk-editing multiple files
- Never move or rename files without explicit permission
- If a quest/region/NPC note doesn't exist, ask before creating one