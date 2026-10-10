---
id: outline
name: Outline
source: core
plugin-type: core
status: enabled
class: PARTIAL
description: "View heading structure of the current note"
has-settings: false
needs-setup: true
commands:
  - id: "outline:open"
    name: "Open outline pane"
  - id: "outline:open-for-current"
    name: "Open outline for current file"
---

Plugin "Outline" shows the heading hierarchy of the current note.

Available commands:
- outline:open -- Open the outline pane in the sidebar
- outline:open-for-current -- Open outline for the currently active file

Use this skill when the user wants to see the document structure or navigate by headings.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/outline.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/outline.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/outline.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/outline.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
