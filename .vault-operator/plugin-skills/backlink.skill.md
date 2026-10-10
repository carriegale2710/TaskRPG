---
id: backlink
name: Backlinks
source: core
plugin-type: core
status: enabled
class: FULL
description: "View and navigate backlinks between notes"
has-settings: false
needs-setup: true
commands:
  - id: "backlink:open"
    name: "Open backlinks pane"
  - id: "backlink:open-backlinks"
    name: "Open backlinks for current note"
  - id: "backlink:toggle-backlinks-in-document"
    name: "Toggle backlinks in document"
---

Plugin "Backlinks" shows which notes link to the current note.

Available commands:
- backlink:open -- Open the backlinks pane in the sidebar
- backlink:open-backlinks -- Open backlinks for the current note
- backlink:toggle-backlinks-in-document -- Toggle inline backlinks at the bottom of the note

Use this skill when the user asks about connections between notes, what links to a specific note, or wants to see the backlink panel. For programmatic backlink analysis, prefer the get_linked_notes tool.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/backlink.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/backlink.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/backlink.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/backlink.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
