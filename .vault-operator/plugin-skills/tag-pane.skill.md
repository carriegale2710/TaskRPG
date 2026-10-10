---
id: tag-pane
name: Tags
source: core
plugin-type: core
status: enabled
class: PARTIAL
description: "Browse all tags used in the vault"
has-settings: false
needs-setup: true
commands:
  - id: "tag-pane:open"
    name: "Open tags pane"
---

Plugin "Tags" shows a browsable list of all tags used across vault notes.

Available commands:
- tag-pane:open -- Open the tags pane in the sidebar

Use this skill when the user wants to browse or explore tags. For programmatic tag searching, prefer the search_by_tag tool.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/tag-pane.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/tag-pane.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/tag-pane.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/tag-pane.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
