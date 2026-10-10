---
id: global-search
name: Search
source: core
plugin-type: core
status: enabled
class: PARTIAL
description: "Full-text search across the vault"
has-settings: false
needs-setup: true
commands:
  - id: "global-search:open"
    name: "Open search"
---

Plugin "Search" provides full-text search across all vault notes.

Available commands:
- global-search:open -- Open the search pane

Use this skill only when the user explicitly wants to open the search UI. For programmatic searching, prefer the search_files or semantic_search tools.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/global-search.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/global-search.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/global-search.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/global-search.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
