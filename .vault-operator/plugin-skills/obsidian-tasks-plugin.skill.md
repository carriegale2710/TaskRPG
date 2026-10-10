---
id: obsidian-tasks-plugin
name: Tasks
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Track tasks across your vault. Supports due dates, recurring tasks, done dates, sub-set of checklist items, and filtering."
has-settings: false
needs-setup: true
commands:
  - id: "obsidian-tasks-plugin:edit-task"
    name: "Tasks: Create or edit task"
  - id: "obsidian-tasks-plugin:toggle-done"
    name: "Tasks: Toggle task done"
  - id: "obsidian-tasks-plugin:quick-search"
    name: "Tasks: Quick search"
  - id: "obsidian-tasks-plugin:add-query-file-defaults-properties"
    name: "Tasks: Add all Query File Defaults properties"
  - id: "obsidian-tasks-plugin:set-status-symbol-to-space"
    name: "Tasks: Change status to: [ ] Todo"
  - id: "obsidian-tasks-plugin:set-status-symbol-to-x"
    name: "Tasks: Change status to: [x] Done"
  - id: "obsidian-tasks-plugin:set-status-symbol-to-/"
    name: "Tasks: Change status to: [/] In Progress"
  - id: "obsidian-tasks-plugin:set-status-symbol-to--"
    name: "Tasks: Change status to: [-] Cancelled"
---

# Tasks

**Description:** Track tasks across your vault. Supports due dates, recurring tasks, done dates, sub-set of checklist items, and filtering.
**Status:** Enabled
**Plugin ID:** obsidian-tasks-plugin

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-tasks-plugin:edit-task` -- Tasks: Create or edit task
- `obsidian-tasks-plugin:toggle-done` -- Tasks: Toggle task done
- `obsidian-tasks-plugin:quick-search` -- Tasks: Quick search
- `obsidian-tasks-plugin:add-query-file-defaults-properties` -- Tasks: Add all Query File Defaults properties
- `obsidian-tasks-plugin:set-status-symbol-to-space` -- Tasks: Change status to: [ ] Todo
- `obsidian-tasks-plugin:set-status-symbol-to-x` -- Tasks: Change status to: [x] Done
- `obsidian-tasks-plugin:set-status-symbol-to-/` -- Tasks: Change status to: [/] In Progress
- `obsidian-tasks-plugin:set-status-symbol-to--` -- Tasks: Change status to: [-] Cancelled

## Configuration File

Settings path: `.obsidian/plugins/obsidian-tasks-plugin/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-tasks-plugin/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-tasks-plugin/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-tasks-plugin.readme.md")

## Usage

When the user asks for functionality related to Tasks:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-tasks-plugin/data.json). If it does not exist, that is normal -- create it with the required settings
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
