## Folder structure

```
TaskRPG/
├── 00 Dashboard/
│   ├── Campaign Dashboard.md
│   ├── Next Session.md
│   └── Open Threads.md
│
├── 01 Campaigns/
│   └── Campaign Name/
│       ├── Campaign Home.md
│       ├── Sessions/
│       │   ├── Upcoming/
│       │   └── Completed/
│       ├── Adventures/
│       ├── Locations/
│       ├── Characters/
│       │   ├── PCs/
│       │   └── NPCs/
│       ├── Factions/
│       ├── Quests/
│       ├── Encounters/
│       ├── Items/
│       ├── Lore/
│       └── Player Handouts/
│
├── 02 VTT/
│   ├── Scenes/
│   ├── Actors/
│   ├── Journals/
│   ├── Encounters/
│   ├── Playlists/
│   ├── Macros/
│   └── Import Queue/
│
├── 03 Asset Library/
│   ├── Maps/
│   │   ├── Settlements/
│   │   ├── Buildings/
│   │   ├── Dungeons/
│   │   └── Wilderness/
│   ├── Tokens/
│   │   ├── PCs/
│   │   ├── NPCs/
│   │   └── Creatures/
│   ├── Portraits/
│   ├── Handouts/
│   └── Audio/
│
├── 04 Rules/
│   ├── House Rules/
│   ├── Mechanics/
│   └── Reference/
│
├── 05 Templates/
│   ├── Session.md
│   ├── NPC.md
│   ├── Location.md
│   ├── Quest.md
│   ├── Encounter.md
│   └── VTT Scene.md
│
├── 90 Inbox/
└── 99 Archive/
```

## Separation rules

- **Campaign folders:** Canonical facts, plans, relationships and session history.
- **VTT folder:** Deployment records describing what has been prepared or imported into the VTT.
- **Asset Library:** Reusable maps, tokens, portraits and audio—not campaign knowledge.
- **Inbox:** Unprocessed downloads, ideas and quick notes.
- **Archive:** Retired campaigns and abandoned material.
- Avoid copying entire campaign notes into `02 VTT`; store links back to canonical notes instead.

## VTT scene note

```
---
type: vtt-scene
campaign: Ashes of Aster
status: prepared
vtt: Foundry
vtt_id:
location: "[[Ruined Observatory]]"
session: "[[Session 08]]"
visibility: gm
map: "[[Observatory Battlemap]]"
actors:
  - "[[Professor Vale]]"
  - "[[Star Spawn]]"
---
```

```
# Ruined Observatory

## Purpose

Final encounter for the observatory investigation.

## VTT checklist

- [ ] Import map
- [ ] Configure grid
- [ ] Add walls and lighting
- [ ] Place actors
- [ ] Add journal pins
- [ ] Test player visibility

## Linked material

- Encounter: [[Observatory Ambush]]
- Location: [[Ruined Observatory]]
- Handout: [[Professor Vale's Letter]]
```

## Session workflow

1. Build the session in `Sessions/Upcoming`.
2. Link its locations, NPCs, quests and encounters rather than moving those notes.
3. Create records in `02 VTT` only for content requiring VTT preparation.
4. Add unprocessed material to `02 VTT/Import Queue`.
5. After play, move only the session note to `Sessions/Completed`.
6. Update canonical NPC, quest and location notes with lasting changes.
7. Archive VTT records when their scenes are no longer active.

Use properties such as `campaign`, `type`, `status`, `location`, `session`, `visibility` and `vtt_id` for Dataview filtering. This lets one NPC appear in several sessions, locations and encounters without duplicating its note—the core limitation players encounter with folder-only organisation.[[foundryvtt](https://foundryvtt.com/article/compendium/)][[docs.owlbear](https://docs.owlbear.rodeo/docs/scenes/)][[docs.owlbear](https://docs.owlbear.rodeo/docs/managing-assets/)]

> Running GAIA Code 3.4 in Perplexity using GPT-5.4