---
id: file-explorer
name: File Explorer
source: core
plugin-type: core
status: enabled
class: FULL
description: "File explorer: create, move, and reveal files"
has-settings: false
needs-setup: true
commands:
  - id: "file-explorer:new-file"
    name: "Create new note"
  - id: "file-explorer:move-file"
    name: "Move file to another folder"
  - id: "file-explorer:reveal-active-file"
    name: "Reveal active file in navigation"
---

Plugin "File Explorer" provides file management commands.

Available commands:
- file-explorer:new-file -- Create a new note (opens an untitled note in the editor)
- file-explorer:move-file -- Move the active file to a different folder (opens folder picker)
- file-explorer:reveal-active-file -- Scroll the file explorer to reveal and highlight the active file

Note: For programmatic file creation, prefer write_file. For moving files, prefer the move_file tool. Use file-explorer commands when the user wants the native UI interaction.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/file-explorer.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/file-explorer.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/file-explorer.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/file-explorer.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
