---
id: obsidian-meta-bind-plugin
name: Meta Bind
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Make your notes interactive with inline input fields, metadata displays, and buttons."
has-settings: true
commands:
  - id: "obsidian-meta-bind-plugin:open-docs"
    name: "Meta Bind: Open docs"
  - id: "obsidian-meta-bind-plugin:open-playground"
    name: "Meta Bind: Open playground"
  - id: "obsidian-meta-bind-plugin:open-help"
    name: "Meta Bind: Open help"
  - id: "obsidian-meta-bind-plugin:open-button-builder"
    name: "Meta Bind: Open button builder"
  - id: "obsidian-meta-bind-plugin:copy-command-id"
    name: "Meta Bind: Select and copy command ID"
---

# Meta Bind

**Description:** Make your notes interactive with inline input fields, metadata displays, and buttons.
**Status:** Enabled
**Plugin ID:** obsidian-meta-bind-plugin

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-meta-bind-plugin:open-docs` -- Meta Bind: Open docs
- `obsidian-meta-bind-plugin:open-playground` -- Meta Bind: Open playground
- `obsidian-meta-bind-plugin:open-help` -- Meta Bind: Open help
- `obsidian-meta-bind-plugin:open-button-builder` -- Meta Bind: Open button builder
- `obsidian-meta-bind-plugin:copy-command-id` -- Meta Bind: Select and copy command ID

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `wrapInMDRC` -- call via call_plugin_api("obsidian-meta-bind-plugin", "wrapInMDRC", [args])
- `constructMDRCWidget` -- call via call_plugin_api("obsidian-meta-bind-plugin", "constructMDRCWidget", [args])
- `reactiveMetadata` -- call via call_plugin_api("obsidian-meta-bind-plugin", "reactiveMetadata", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-meta-bind-plugin/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-meta-bind-plugin/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
devMode: false
ignoreCodeBlockRestrictions: false
preferredDateFormat: YYYY-MM-DD
firstWeekday: Monday
syncInterval: 200
enableJs: false
viewFieldDisplayNullAsEmpty: false
enableSyntaxHighlighting: true
enableEditorRightClickMenu: true
excludedFolders: [templates]
```

For full settings, read: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-meta-bind-plugin.readme.md")

## Usage

When the user asks for functionality related to Meta Bind:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-meta-bind-plugin/data.json). If it does not exist, that is normal -- create it with the required settings
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
