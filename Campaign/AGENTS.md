# Campaign-Specific Agent Rules

## Purpose

This folder contains the campaign's progression state: hero stats, master plot
summary, quest board, and rewards. These rules override the root AGENTS.md for
anything related to reading, writing, or editing files in this folder.

## Folder Structure (do not reorder)

- `00 Hero.md` — character stats, XP, skills, inventory
- `01 Campaign Rules.md` — world rules, MP thresholds, active plot threads
- `02 Story So Far.md` — master plot summary + timeline linking to daily notes
- `03 Quest Board.md` — Dataview dashboard of active quests
- `04 Rewards & Loot.md` — reward shop, loot inventory

Never rename, move, or delete these files unless I explicitly ask.

## Hero File (`00 Hero.md`)

### Structure (do not reorder)
1. YAML frontmatter (hero, level, xp, xp_next, mp, mp_max, gold, campaign)
2. `# [hero name]`
3. `## Stats`
4. `## Skills`
5. `## Inventory`
6. `## Active Quest Line`
7. `## Notes`

### Writing rules
- Update `xp`, `mp`, `gold`, `level`, or skill XP only when I explicitly state
  the new value or a quest completion triggers it
- Never auto-increment XP/MP/gold—always confirm the amount with me first
- When adding a skill level-up, append to the relevant skill row, never create
  a new row unless I ask
- Preserve all other frontmatter and section content exactly as-is

## Story So Far (`02 Story So Far.md`)

### Structure (do not reorder)
1. `# Story So Far`
2. `## Current arc`
3. `## Story timeline` (table with date | event | daily entry link)
4. `## Active