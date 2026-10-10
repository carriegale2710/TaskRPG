---
id: obsidian42-strange-new-worlds
name: Strange New Worlds
source: vault-native
plugin-type: community
status: enabled
class: PARTIAL
description: "Help see how your vault is interconnected with visual indicators."
has-settings: false
needs-setup: true
commands:
  - id: "obsidian42-strange-new-worlds:SNW-ToggleActiveState"
    name: "Strange New Worlds: Toggle active state of SNW plugin on/off"
  - id: "obsidian42-strange-new-worlds:SNW-ActivateView"
    name: "Strange New Worlds: Show SNW"
---

# Strange New Worlds

**Description:** Help see how your vault is interconnected with visual indicators.
**Status:** Enabled
**Plugin ID:** obsidian42-strange-new-worlds

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian42-strange-new-worlds:SNW-ToggleActiveState` -- Strange New Worlds: Toggle active state of SNW plugin on/off
- `obsidian42-strange-new-worlds:SNW-ActivateView` -- Strange New Worlds: Show SNW

## Configuration File

Settings path: `.obsidian/plugins/obsidian42-strange-new-worlds/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian42-strange-new-worlds/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian42-strange-new-worlds/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian42-strange-new-worlds.readme.md")

## Usage

When the user asks for functionality related to Strange New Worlds:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian42-strange-new-worlds/data.json). If it does not exist, that is normal -- create it with the required settings
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
