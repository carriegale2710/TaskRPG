---
id: fantasy-content-generator
name: TTRPG Content Generator
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Generate names, inns, settlements, loot and more for your TTRPG and worldbuilding notes, or build your own generators."
has-settings: false
needs-setup: true
commands:
  - id: "fantasy-content-generator:open-fantasy-generator"
    name: "TTRPG Content Generator: Open generator"
  - id: "fantasy-content-generator:new-generator"
    name: "TTRPG Content Generator: New custom generator"
  - id: "fantasy-content-generator:add-starter-set"
    name: "TTRPG Content Generator: Add a starter set"
  - id: "fantasy-content-generator:add-village-example"
    name: "TTRPG Content Generator: Add the village example"
---

# TTRPG Content Generator

**Description:** Generate names, inns, settlements, loot and more for your TTRPG and worldbuilding notes, or build your own generators.
**Status:** Enabled
**Plugin ID:** fantasy-content-generator

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `fantasy-content-generator:open-fantasy-generator` -- TTRPG Content Generator: Open generator
- `fantasy-content-generator:new-generator` -- TTRPG Content Generator: New custom generator
- `fantasy-content-generator:add-starter-set` -- TTRPG Content Generator: Add a starter set
- `fantasy-content-generator:add-village-example` -- TTRPG Content Generator: Add the village example

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `hasOwnProperty` -- call via call_plugin_api("fantasy-content-generator", "hasOwnProperty", [args])
- `isPrototypeOf` -- call via call_plugin_api("fantasy-content-generator", "isPrototypeOf", [args])
- `propertyIsEnumerable` -- call via call_plugin_api("fantasy-content-generator", "propertyIsEnumerable", [args])
- `toString` -- call via call_plugin_api("fantasy-content-generator", "toString", [args])
- `valueOf` -- call via call_plugin_api("fantasy-content-generator", "valueOf", [args])
- `toLocaleString` -- call via call_plugin_api("fantasy-content-generator", "toLocaleString", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/fantasy-content-generator/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/fantasy-content-generator/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/fantasy-content-generator/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/fantasy-content-generator.readme.md")

## Usage

When the user asks for functionality related to TTRPG Content Generator:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/fantasy-content-generator/data.json). If it does not exist, that is normal -- create it with the required settings
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
