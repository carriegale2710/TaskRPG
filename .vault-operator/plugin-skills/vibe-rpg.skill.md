---
id: vibe-rpg
name: Life RPG
source: vault-native
plugin-type: community
status: disabled
class: PARTIAL
description: "Dashboard for habits, XP, rewards, wallet, water, and daily progress."
has-settings: true
needs-setup: true
commands:
  - id: "vibe-rpg:open-vibe-rpg"
    name: "Life RPG: Открыть Vibe RPG"
  - id: "vibe-rpg:open-vibe-rpg-sidebar"
    name: "Life RPG: Открыть виджет Vibe RPG"
---

# Life RPG

**Description:** Dashboard for habits, XP, rewards, wallet, water, and daily progress.
**Status:** Disabled
**Plugin ID:** vibe-rpg

## Setup Required

Plugin is disabled. Use enable_plugin to activate it first.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `vibe-rpg:open-vibe-rpg` -- Life RPG: Открыть Vibe RPG
- `vibe-rpg:open-vibe-rpg-sidebar` -- Life RPG: Открыть виджет Vibe RPG

## Configuration File

Settings path: `.obsidian/plugins/vibe-rpg/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/vibe-rpg/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/vibe-rpg/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
player:
  name: Hero
  classId: habit_warrior
  className: Habit Warrior
  goal: complete at least 3 habits per day
settings:
  waterGoal: 8
  waterGlassMl: 250
  questStatsCards:
    dailyXp:
      enabled: true
      label: XP for the day
    minimum:
      enabled: true
      label: Daily minimum
    total:
      enabled: true
      label: Habits of the day
    strongDays:
      enabled: true
      label: Strong days this week
    streak:
      enabled: true
      label: Streak
  homeLayout:
    widgets: [10 items]
  interfaceLayout:
    appSize: comfortable
    homeLayoutMode: grid
    columns: 12
    rowHeight: 96
  interfaceTheme:
    themeId: brand-dark
    accentPreset: purple
habits: [8 items: {...}, {...}, {...}...]
rewards: [4 items]
```

For full settings, read: `.obsidian/plugins/vibe-rpg/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/vibe-rpg.readme.md")

## Usage

This plugin is currently disabled. Use enable_plugin("vibe-rpg") to activate it first.
After enabling, the plugin's commands will become available for execute_command.
