---
id: obsidian-banners
name: Banners
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Add banner images to your notes!"
has-settings: false
needs-setup: true
commands:
  - id: "obsidian-banners:banners:addBanner"
    name: "Banners: Add/Change banner with local image"
  - id: "obsidian-banners:banners:addIcon"
    name: "Banners: Add/Change emoji icon"
  - id: "obsidian-banners:banners:pasteBanner"
    name: "Banners: Paste banner from clipboard"
  - id: "obsidian-banners:banners:lockBanner"
    name: "Banners: Lock/Unlock banner position"
  - id: "obsidian-banners:banners:removeBanner"
    name: "Banners: Remove banner"
  - id: "obsidian-banners:banners:removeIcon"
    name: "Banners: Remove icon"
---

# Banners

**Description:** Add banner images to your notes!
**Status:** Enabled
**Plugin ID:** obsidian-banners

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-banners:banners:addBanner` -- Banners: Add/Change banner with local image
- `obsidian-banners:banners:addIcon` -- Banners: Add/Change emoji icon
- `obsidian-banners:banners:pasteBanner` -- Banners: Paste banner from clipboard
- `obsidian-banners:banners:lockBanner` -- Banners: Lock/Unlock banner position
- `obsidian-banners:banners:removeBanner` -- Banners: Remove banner
- `obsidian-banners:banners:removeIcon` -- Banners: Remove icon

## Configuration File

Settings path: `.obsidian/plugins/obsidian-banners/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-banners/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-banners/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-banners.readme.md")

## Usage

When the user asks for functionality related to Banners:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-banners/data.json). If it does not exist, that is normal -- create it with the required settings
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
