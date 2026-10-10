---
id: templater-obsidian
name: Templater
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Advanced templating and automation using handlebars-like syntax."
has-settings: false
needs-setup: true
commands:
  - id: "templater-obsidian:insert-templater"
    name: "Templater: Open insert template modal"
  - id: "templater-obsidian:replace-in-file-templater"
    name: "Templater: Replace templates in the active file"
  - id: "templater-obsidian:jump-to-next-cursor-location"
    name: "Templater: Jump to next cursor location"
  - id: "templater-obsidian:create-new-note-from-template"
    name: "Templater: Create new note from template"
---

# Templater

**Description:** Advanced templating and automation using handlebars-like syntax.
**Status:** Enabled
**Plugin ID:** templater-obsidian

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `templater-obsidian:insert-templater` -- Templater: Open insert template modal
- `templater-obsidian:replace-in-file-templater` -- Templater: Replace templates in the active file
- `templater-obsidian:jump-to-next-cursor-location` -- Templater: Jump to next cursor location
- `templater-obsidian:create-new-note-from-template` -- Templater: Create new note from template

## Configuration File

Settings path: `.obsidian/plugins/templater-obsidian/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/templater-obsidian/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/templater-obsidian/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/templater-obsidian.readme.md")

## Usage

When the user asks for functionality related to Templater:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/templater-obsidian/data.json). If it does not exist, that is normal -- create it with the required settings
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
