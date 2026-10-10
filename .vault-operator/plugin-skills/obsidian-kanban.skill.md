---
id: obsidian-kanban
name: Kanban
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Create markdown-backed Kanban boards in Obsidian."
has-settings: false
needs-setup: true
commands:
  - id: "obsidian-kanban:create-new-kanban-board"
    name: "Kanban: Create new board"
  - id: "obsidian-kanban:archive-completed-cards"
    name: "Kanban: Archive completed cards in active board"
  - id: "obsidian-kanban:toggle-kanban-view"
    name: "Kanban: Toggle between Kanban and markdown mode"
  - id: "obsidian-kanban:convert-to-kanban"
    name: "Kanban: Convert empty note to Kanban"
  - id: "obsidian-kanban:add-kanban-lane"
    name: "Kanban: Add a list"
  - id: "obsidian-kanban:view-board"
    name: "Kanban: View as board"
  - id: "obsidian-kanban:view-table"
    name: "Kanban: View as table"
  - id: "obsidian-kanban:view-list"
    name: "Kanban: View as list"
  - id: "obsidian-kanban:open-board-settings"
    name: "Kanban: Open board settings"
---

# Kanban

**Description:** Create markdown-backed Kanban boards in Obsidian.
**Status:** Enabled
**Plugin ID:** obsidian-kanban

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-kanban:create-new-kanban-board` -- Kanban: Create new board
- `obsidian-kanban:archive-completed-cards` -- Kanban: Archive completed cards in active board
- `obsidian-kanban:toggle-kanban-view` -- Kanban: Toggle between Kanban and markdown mode
- `obsidian-kanban:convert-to-kanban` -- Kanban: Convert empty note to Kanban
- `obsidian-kanban:add-kanban-lane` -- Kanban: Add a list
- `obsidian-kanban:view-board` -- Kanban: View as board
- `obsidian-kanban:view-table` -- Kanban: View as table
- `obsidian-kanban:view-list` -- Kanban: View as list
- `obsidian-kanban:open-board-settings` -- Kanban: Open board settings

## Configuration File

Settings path: `.obsidian/plugins/obsidian-kanban/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-kanban/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-kanban/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-kanban.readme.md")

## Usage

When the user asks for functionality related to Kanban:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-kanban/data.json). If it does not exist, that is normal -- create it with the required settings
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
