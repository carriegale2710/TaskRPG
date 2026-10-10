---
id: highlightr-plugin
name: Highlightr
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "A minimal and aesthetically pleasing highlighting menu that makes color-coded highlighting much easier with a configurable assortment of highlight colors 🎨."
has-settings: false
needs-setup: true
commands:
  - id: "highlightr-plugin:highlighter-plugin-menu"
    name: "Highlightr: Open Highlightr"
  - id: "highlightr-plugin:Pink"
    name: "Highlightr: Pink"
  - id: "highlightr-plugin:unhighlight"
    name: "Highlightr: Remove highlight"
  - id: "highlightr-plugin:Red"
    name: "Highlightr: Red"
  - id: "highlightr-plugin:Orange"
    name: "Highlightr: Orange"
  - id: "highlightr-plugin:Yellow"
    name: "Highlightr: Yellow"
  - id: "highlightr-plugin:Green"
    name: "Highlightr: Green"
  - id: "highlightr-plugin:Cyan"
    name: "Highlightr: Cyan"
  - id: "highlightr-plugin:Blue"
    name: "Highlightr: Blue"
  - id: "highlightr-plugin:Purple"
    name: "Highlightr: Purple"
  - id: "highlightr-plugin:Grey"
    name: "Highlightr: Grey"
---

# Highlightr

**Description:** A minimal and aesthetically pleasing highlighting menu that makes color-coded highlighting much easier with a configurable assortment of highlight colors 🎨.
**Status:** Enabled
**Plugin ID:** highlightr-plugin

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `highlightr-plugin:highlighter-plugin-menu` -- Highlightr: Open Highlightr
- `highlightr-plugin:Pink` -- Highlightr: Pink
- `highlightr-plugin:unhighlight` -- Highlightr: Remove highlight
- `highlightr-plugin:Red` -- Highlightr: Red
- `highlightr-plugin:Orange` -- Highlightr: Orange
- `highlightr-plugin:Yellow` -- Highlightr: Yellow
- `highlightr-plugin:Green` -- Highlightr: Green
- `highlightr-plugin:Cyan` -- Highlightr: Cyan
- `highlightr-plugin:Blue` -- Highlightr: Blue
- `highlightr-plugin:Purple` -- Highlightr: Purple
- `highlightr-plugin:Grey` -- Highlightr: Grey

## Configuration File

Settings path: `.obsidian/plugins/highlightr-plugin/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/highlightr-plugin/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/highlightr-plugin/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/highlightr-plugin.readme.md")

## Usage

When the user asks for functionality related to Highlightr:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/highlightr-plugin/data.json). If it does not exist, that is normal -- create it with the required settings
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
