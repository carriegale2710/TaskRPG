---
id: obsidian-auto-link-title
name: Auto Link Title
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "This plugin automatically fetches the titles of links from the web"
has-settings: false
needs-setup: true
commands:
  - id: "obsidian-auto-link-title:auto-link-title-paste"
    name: "Auto Link Title: Paste URL and auto fetch title"
  - id: "obsidian-auto-link-title:auto-link-title-normal-paste"
    name: "Auto Link Title: Normal paste (no fetching behavior)"
  - id: "obsidian-auto-link-title:enhance-url-with-title"
    name: "Auto Link Title: Enhance existing URL with link and title"
---

# Auto Link Title

**Description:** This plugin automatically fetches the titles of links from the web
**Status:** Enabled
**Plugin ID:** obsidian-auto-link-title

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-auto-link-title:auto-link-title-paste` -- Auto Link Title: Paste URL and auto fetch title
- `obsidian-auto-link-title:auto-link-title-normal-paste` -- Auto Link Title: Normal paste (no fetching behavior)
- `obsidian-auto-link-title:enhance-url-with-title` -- Auto Link Title: Enhance existing URL with link and title

## Configuration File

Settings path: `.obsidian/plugins/obsidian-auto-link-title/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-auto-link-title/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-auto-link-title/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-auto-link-title.readme.md")

## Usage

When the user asks for functionality related to Auto Link Title:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-auto-link-title/data.json). If it does not exist, that is normal -- create it with the required settings
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
