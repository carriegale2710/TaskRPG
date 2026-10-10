---
id: canvas
name: Canvas
source: core
plugin-type: core
status: enabled
class: FULL
description: "Visual canvas with cards, links, and spatial notes"
has-settings: false
needs-setup: true
commands:
  - id: "canvas:new-file"
    name: "Create new canvas"
  - id: "canvas:export-as-image"
    name: "Export canvas as image"
  - id: "canvas:convert-to-file"
    name: "Convert to file"
---

Plugin "Canvas" provides visual thinking boards with cards and connections.

Available commands:
- canvas:new-file -- Create a new empty canvas file (.canvas)
- canvas:export-as-image -- Export the current canvas as an image
- canvas:convert-to-file -- Convert a canvas card to a standalone note file

Use this skill when the user wants to create visual boards, mind maps, or spatial note arrangements. Note: For programmatic canvas creation with nodes and edges, prefer the generate_canvas tool instead.

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/canvas.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/canvas.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/canvas.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/canvas.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
