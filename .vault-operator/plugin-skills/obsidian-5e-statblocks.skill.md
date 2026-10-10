---
id: obsidian-5e-statblocks
name: Fantasy Statblocks
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Create Fantasy Statblocks in Obsidian.md"
has-settings: true
commands:
  - id: "obsidian-5e-statblocks:parse-frontmatter"
    name: "Fantasy Statblocks: Parse Frontmatter for Creatures"
  - id: "obsidian-5e-statblocks:open-creature-view"
    name: "Fantasy Statblocks: Open Creature pane"
  - id: "obsidian-5e-statblocks:reveal-creature-view"
    name: "Fantasy Statblocks: Reveal Creature pane"
  - id: "obsidian-5e-statblocks:open-new-creature-view"
    name: "Fantasy Statblocks: Open new Creature pane"
---

# Fantasy Statblocks

**Description:** Create Fantasy Statblocks in Obsidian.md
**Status:** Enabled
**Plugin ID:** obsidian-5e-statblocks

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-5e-statblocks:parse-frontmatter` -- Fantasy Statblocks: Parse Frontmatter for Creatures
- `obsidian-5e-statblocks:open-creature-view` -- Fantasy Statblocks: Open Creature pane
- `obsidian-5e-statblocks:reveal-creature-view` -- Fantasy Statblocks: Reveal Creature pane
- `obsidian-5e-statblocks:open-new-creature-view` -- Fantasy Statblocks: Open new Creature pane

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `getVersion` -- call via call_plugin_api("obsidian-5e-statblocks", "getVersion", [args])
- `getBestiary` -- call via call_plugin_api("obsidian-5e-statblocks", "getBestiary", [args])
- `getBestiaryCreatures` -- call via call_plugin_api("obsidian-5e-statblocks", "getBestiaryCreatures", [args])
- `getBestiaryNames` -- call via call_plugin_api("obsidian-5e-statblocks", "getBestiaryNames", [args])
- `hasCreature` -- call via call_plugin_api("obsidian-5e-statblocks", "hasCreature", [args])
- `getCreatureFromBestiary` -- call via call_plugin_api("obsidian-5e-statblocks", "getCreatureFromBestiary", [args])
- `getCreature` -- call via call_plugin_api("obsidian-5e-statblocks", "getCreature", [args])
- `getSortedBy` -- call via call_plugin_api("obsidian-5e-statblocks", "getSortedBy", [args])
- `onSortedBy` -- call via call_plugin_api("obsidian-5e-statblocks", "onSortedBy", [args])
- `registerSorter` -- call via call_plugin_api("obsidian-5e-statblocks", "registerSorter", [args])
- `getIndices` -- call via call_plugin_api("obsidian-5e-statblocks", "getIndices", [args])
- `getIndex` -- call via call_plugin_api("obsidian-5e-statblocks", "getIndex", [args])
- `registerIndex` -- call via call_plugin_api("obsidian-5e-statblocks", "registerIndex", [args])
- `onIndexUpdated` -- call via call_plugin_api("obsidian-5e-statblocks", "onIndexUpdated", [args])
- `isResolved` -- call via call_plugin_api("obsidian-5e-statblocks", "isResolved", [args])
- `onResolved` -- call via call_plugin_api("obsidian-5e-statblocks", "onResolved", [args])
- `onUpdated` -- call via call_plugin_api("obsidian-5e-statblocks", "onUpdated", [args])
- `isStatblockLink` -- call via call_plugin_api("obsidian-5e-statblocks", "isStatblockLink", [args])
- `parseStatblockLink` -- call via call_plugin_api("obsidian-5e-statblocks", "parseStatblockLink", [args])
- `stringifyLinks` -- call via call_plugin_api("obsidian-5e-statblocks", "stringifyLinks", [args])
- `transformLinks` -- call via call_plugin_api("obsidian-5e-statblocks", "transformLinks", [args])
- `renderMarkdown` -- call via call_plugin_api("obsidian-5e-statblocks", "renderMarkdown", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/obsidian-5e-statblocks/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-5e-statblocks/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-5e-statblocks/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
default: basic-5e-layout
useDice: true
renderDice: false
export: true
showAdvanced: false
paths: [/]
autoParse: false
disableSRD: false
tryToRenderLinks: true
debug: false
notifiedOfFantasy: false
hideConditionHelp: false
alwaysImport: false
defaultLayoutsIntegrated: true
atomicWrite: false
```

For full settings, read: `.obsidian/plugins/obsidian-5e-statblocks/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-5e-statblocks.readme.md")

## Usage

When the user asks for functionality related to Fantasy Statblocks:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-5e-statblocks/data.json). If it does not exist, that is normal -- create it with the required settings
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
