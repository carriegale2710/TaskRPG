---
id: obsidian-reminder-plugin
name: Reminder
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Manage TODOs with reminders and get notified when they are due."
has-settings: false
needs-setup: true
commands:
  - id: "obsidian-reminder-plugin:scan-reminders"
    name: "Reminder: Rescan all files"
  - id: "obsidian-reminder-plugin:show-reminders"
    name: "Reminder: Open list view"
  - id: "obsidian-reminder-plugin:convert-reminder-time-format"
    name: "Reminder: Convert time format"
  - id: "obsidian-reminder-plugin:show-date-chooser"
    name: "Reminder: Show calendar popup"
  - id: "obsidian-reminder-plugin:toggle-checklist-status"
    name: "Reminder: Toggle checklist status"
  - id: "obsidian-reminder-plugin:set-date-display-format"
    name: "Reminder: Set date display format"
  - id: "obsidian-reminder-plugin:pause-notifications"
    name: "Reminder: Pause notifications"
  - id: "obsidian-reminder-plugin:resume-notifications"
    name: "Reminder: Resume notifications"
  - id: "obsidian-reminder-plugin:mute-all-reminders"
    name: "Reminder: Mute all current notifications"
---

# Reminder

**Description:** Manage TODOs with reminders and get notified when they are due.
**Status:** Enabled
**Plugin ID:** obsidian-reminder-plugin

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-reminder-plugin:scan-reminders` -- Reminder: Rescan all files
- `obsidian-reminder-plugin:show-reminders` -- Reminder: Open list view
- `obsidian-reminder-plugin:convert-reminder-time-format` -- Reminder: Convert time format
- `obsidian-reminder-plugin:show-date-chooser` -- Reminder: Show calendar popup
- `obsidian-reminder-plugin:toggle-checklist-status` -- Reminder: Toggle checklist status
- `obsidian-reminder-plugin:set-date-display-format` -- Reminder: Set date display format
- `obsidian-reminder-plugin:pause-notifications` -- Reminder: Pause notifications
- `obsidian-reminder-plugin:resume-notifications` -- Reminder: Resume notifications
- `obsidian-reminder-plugin:mute-all-reminders` -- Reminder: Mute all current notifications

## Configuration File

Settings path: `.obsidian/plugins/obsidian-reminder-plugin/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-reminder-plugin/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-reminder-plugin/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-reminder-plugin.readme.md")

## Usage

When the user asks for functionality related to Reminder:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-reminder-plugin/data.json). If it does not exist, that is normal -- create it with the required settings
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
