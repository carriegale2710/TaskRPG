---
id: atlas-vtt
name: Atlas VTT
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Run tabletop RPG battle maps with tokens, fog of war, grids, dice and a separate player view."
has-settings: false
needs-setup: true
commands:
  - id: "atlas-vtt:report-issue"
    name: "Atlas VTT: Report an issue…"
  - id: "atlas-vtt:view-changelog"
    name: "Atlas VTT: View changelog"
  - id: "atlas-vtt:insert-atlas-link"
    name: "Atlas VTT: Insert link to scene or encounter"
  - id: "atlas-vtt:display-image-on-player-view"
    name: "Atlas VTT: Display image on player view"
  - id: "atlas-vtt:dismiss-image-from-player-view"
    name: "Atlas VTT: Dismiss image from player view"
  - id: "atlas-vtt:send-map-to-player-view"
    name: "Atlas VTT: Send current map to player view"
  - id: "atlas-vtt:open-player-window"
    name: "Atlas VTT: Open player window"
  - id: "atlas-vtt:open-dashboard"
    name: "Atlas VTT: Open dashboard"
  - id: "atlas-vtt:open-scene-browser"
    name: "Atlas VTT: Open scene browser"
  - id: "atlas-vtt:toggle-initiative-tracker"
    name: "Atlas VTT: Toggle initiative tracker"
  - id: "atlas-vtt:toggle-loot-roller"
    name: "Atlas VTT: Toggle loot roller"
  - id: "atlas-vtt:toggle-dice-log"
    name: "Atlas VTT: Toggle dice log"
  - id: "atlas-vtt:clean-up-missing-assets"
    name: "Atlas VTT: Clean up missing assets in current map"
  - id: "atlas-vtt:import-statblock-tokens"
    name: "Atlas VTT: Import tokens from Fantasy Statblocks"
  - id: "atlas-vtt:create-token-from-statblock"
    name: "Atlas VTT: Create token from statblock image"
---

# Atlas VTT

**Description:** Run tabletop RPG battle maps with tokens, fog of war, grids, dice and a separate player view.
**Status:** Enabled
**Plugin ID:** atlas-vtt

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `atlas-vtt:report-issue` -- Atlas VTT: Report an issue…
- `atlas-vtt:view-changelog` -- Atlas VTT: View changelog
- `atlas-vtt:insert-atlas-link` -- Atlas VTT: Insert link to scene or encounter
- `atlas-vtt:display-image-on-player-view` -- Atlas VTT: Display image on player view
- `atlas-vtt:dismiss-image-from-player-view` -- Atlas VTT: Dismiss image from player view
- `atlas-vtt:send-map-to-player-view` -- Atlas VTT: Send current map to player view
- `atlas-vtt:open-player-window` -- Atlas VTT: Open player window
- `atlas-vtt:open-dashboard` -- Atlas VTT: Open dashboard
- `atlas-vtt:open-scene-browser` -- Atlas VTT: Open scene browser
- `atlas-vtt:toggle-initiative-tracker` -- Atlas VTT: Toggle initiative tracker
- `atlas-vtt:toggle-loot-roller` -- Atlas VTT: Toggle loot roller
- `atlas-vtt:toggle-dice-log` -- Atlas VTT: Toggle dice log
- `atlas-vtt:clean-up-missing-assets` -- Atlas VTT: Clean up missing assets in current map
- `atlas-vtt:import-statblock-tokens` -- Atlas VTT: Import tokens from Fantasy Statblocks
- `atlas-vtt:create-token-from-statblock` -- Atlas VTT: Create token from statblock image

## Configuration File

Settings path: `.obsidian/plugins/atlas-vtt/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/atlas-vtt/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/atlas-vtt/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/atlas-vtt.readme.md")

## Usage

When the user asks for functionality related to Atlas VTT:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/atlas-vtt/data.json). If it does not exist, that is normal -- create it with the required settings
3. Configure the plugin by writing data.json with the values needed for the task
4. Execute the task using the appropriate tool:
   - For Obsidian-native commands (including file export): use execute_command
   - For CLI-based conversion needing Pandoc/LaTeX: use execute_recipe
   - For data queries: use call_plugin_api
5. If a command opens a UI dialog, tell the user what to click.

CRITICAL RULES:
- Prefer native Obsidian commands over external tools when both can accomplish the task.
- NEVER create fake output files. If the user asks for a PDF/DOCX/image export, use execute_recipe -- do NOT write content to a .pdf file yourself.
- If a dependency is missing (e.g. Pandoc), tell the user what to install.
IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
