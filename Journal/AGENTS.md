# Journal-Specific Agent Rules

## Purpose
Hybrid daily notes: bujo + diary + campaign log. These rules override root for this folder.

## Daily Note Structure (do not reorder)
1. YAML frontmatter
2. # [date]
3. ## Character Status
4. ## Today's plan
5. ## Quest / story update
6. ## Reflection / diary

## Reading Rules
- Morning: read mp/energy/plan, cross-ref Story So Far, don't touch diary
- Evening: read quest section + last 1-2 beats + Story So Far, don't touch status/plan

## Writing Rules
### Appending story beat
Append under "## Quest / story update" after existing quest info:
```md
**Story beat:**

_[beat text]_

**Next chapter hook:**
_[hook]_
```
- Never overwrite existing beat, ask first

### Frontmatter
- Only modify mp/energy/habits_done/quests_completed if I state the value
- Never guess or auto-increment

### Timeline row
- After beat, add row to Story So Far timeline
- Format: | date | summary (max 80 chars) | [[Journal/date]] |
- Insert below |---|---|---| header

## Style
- 120-180 words, lore-heavy, humorous D&D
- Low MP = tactical retreat, never shame
- Preserve diary verbatim

## Safety
- Ask before deleting/reverting
- Never move/rename without permission
