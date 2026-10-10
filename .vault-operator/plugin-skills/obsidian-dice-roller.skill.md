---
id: obsidian-dice-roller
name: Dice Roller
source: vault-native
plugin-type: community
status: disabled
class: PARTIAL
description: "Inline dice rolling for Obsidian.md"
has-settings: true
needs-setup: true
commands:
  - id: "obsidian-dice-roller:open-view"
    name: "Dice Roller: Open Dice View"
  - id: "obsidian-dice-roller:reroll"
    name: "Dice Roller: Re-roll Dice"
---

# Dice Roller

**Description:** Inline dice rolling for Obsidian.md
**Status:** Disabled
**Plugin ID:** obsidian-dice-roller

## Setup Required

Plugin is disabled. Use enable_plugin to activate it first.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-dice-roller:open-view` -- Dice Roller: Open Dice View
- `obsidian-dice-roller:reroll` -- Dice Roller: Re-roll Dice

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `initialize` -- call via call_plugin_api("obsidian-dice-roller", "initialize", [args])
- `getParametersForRoller` -- call via call_plugin_api("obsidian-dice-roller", "getParametersForRoller", [args])
- `registerSource` -- call via call_plugin_api("obsidian-dice-roller", "registerSource", [args])
- `getRoller` -- call via call_plugin_api("obsidian-dice-roller", "getRoller", [args])
- `getRollerString` -- call via call_plugin_api("obsidian-dice-roller", "getRollerString", [args])
- `getArrayRoller` -- call via call_plugin_api("obsidian-dice-roller", "getArrayRoller", [args])
- `parseDice` -- call via call_plugin_api("obsidian-dice-roller", "parseDice", [args])
- `getRollerOptions` -- call via call_plugin_api("obsidian-dice-roller", "getRollerOptions", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/obsidian-dice-roller/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-dice-roller/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-dice-roller/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
position: RIGHT
showFudgeIcon: false
rollLinksForTags: false
copyContentButton: true
displayFormulaForMod: true
displayResultsInline: false
displayFormulaAfter: false
escapeDiceMod: true
signed: false
displayLookupRoll: true
defaultRoll: 1
defaultFace: 100
renderer: false
renderAllDice: false
addToView: false
renderTime: 2000
colorfulDice: false
scaler: 1
diceColor: #202020
textColor: #ffffff
textFont: Arial
showLeafOnStartup: true
narrativeSymbolSet: Genesys
displayAsSymbols: false
displayAsEmbed: true
round: None
initialDisplay: Roll
icons: [7 items]
showRenderNotice: true
replaceDiceModInLivePreview: true
```

For full settings, read: `.obsidian/plugins/obsidian-dice-roller/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-dice-roller.readme.md")

## Usage

This plugin is currently disabled. Use enable_plugin("obsidian-dice-roller") to activate it first.
After enabling, the plugin's commands will become available for execute_command.
