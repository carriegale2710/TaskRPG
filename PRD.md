# PRD: **SecondBrainRPG** — Story-Driven Productivity System

## 1. Overview
| Field        | Value                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| Product name | SecondBrainRPG (PKM gamification system)                                                              |
| Type         | Personal Obsidian vault system                                                                        |
| User         | Solo founder / full-stack dev, AuDHD, fluctuating energy                                              |
| Status       | Draft / ready to build                                                                                |
| Core loop    | Log state -> GM frames quest -> do real work -> complete -> story beat -> map update -> weekly review |

Purpose: Turn daily project work into a lore-heavy D&D-style campaign where quest difficulty, scope, and rewards adapt to real-time capacity (MP/energy/habits/deadlines), while the daily journal remains the single source of truth for both life and story.

Problem: Overcommitment, guilt over unfinished tasks, motivation loss on low-energy days, story/context drift in long-running gamified systems.

## 2. Goals & Success Metrics
| Goal | Metric |
|---|---|
| Sustain daily use without burnout | >=5 journal entries/week for 4+ weeks |
| Prevent overcommitment | <=2 unfinished planned tasks/day avg |
| Maintain story continuity | AI references correct prior plot in >=90% of beats |
| Low-energy productivity | >=1 task completed on MP<=4 days |
| Reduce maintenance | <10 min/day vault upkeep |

## 3. User Stories
- Log MP/energy each morning so story scales to real capacity
- GM generates quest framing matching stated capacity
- Completing tasks produces a story beat advancing the plot
- Daily journal = diary + campaign record, linked to master summary
- Review week's quests/XP/story in one place

## 4. Scope
### Must-have (v1)
- Daily note with MP/energy/habits/deadlines frontmatter
- GM templates (morning/evening)
- Story So Far master summary with timeline
- Atlas VTT map with region/quest pins
- Life RPG hero/XP/habits
- Dataview dashboard

### Should-have (v1.1)
- QuickAdd New Quest macro
- Dice Roller
- Weekly review template

### Won't-have (v1)
- Auto-sync between plugins
- Multiplayer
- Custom agent development

## 5. Assumptions
- Obsidian desktop (Atlas requirement)
- AI provider configured (Anthropic/OpenAI/local)
- User commits to filling MP each morning
- No cross-plugin automation in v1
