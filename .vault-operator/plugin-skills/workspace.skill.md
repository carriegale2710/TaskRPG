---
id: workspace
name: Workspace
source: core
plugin-type: core
status: enabled
class: FULL
description: "Native workspace operations: PDF export, tab/pane management, file paths"
has-settings: true
commands:
  - id: "workspace:export-pdf"
    name: "Export current note to PDF"
  - id: "workspace:close"
    name: "Close current tab"
  - id: "workspace:split-horizontal"
    name: "Split horizontally"
  - id: "workspace:split-vertical"
    name: "Split vertically"
  - id: "workspace:new-tab"
    name: "New tab"
  - id: "workspace:copy-path"
    name: "Copy file path"
  - id: "workspace:copy-url"
    name: "Copy Obsidian URL"
  - id: "workspace:edit-file-title"
    name: "Rename file"
  - id: "workspace:toggle-pin"
    name: "Toggle pin"
---

Plugin "Workspace" provides core Obsidian workspace operations.

Available commands:
- workspace:export-pdf -- Export the currently open note to PDF using Obsidian's built-in renderer
- workspace:close -- Close the currently active tab
- workspace:split-horizontal -- Split the current pane horizontally
- workspace:split-vertical -- Split the current pane vertically
- workspace:new-tab -- Open a new empty tab
- workspace:copy-path -- Copy the active file's vault-relative path to clipboard
- workspace:copy-url -- Copy an obsidian:// URL for the active file
- workspace:edit-file-title -- Rename the active file inline
- workspace:toggle-pin -- Pin or unpin the active tab (pinned tabs stay open)

workspace:export-pdf is a native Obsidian command -- zero external dependencies, always available.
It renders the note exactly as Obsidian displays it (theme, CSS, plugins applied).
Note: Opens an export dialog. The user must confirm settings and save location.

Use workspace:export-pdf for quick PDF exports. For advanced conversion (custom LaTeX templates, bibliography, DOCX): use execute_recipe with Pandoc instead.

## Configuration File

Settings path: `.obsidian/workspace.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/workspace.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/workspace.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Current Configuration

```
main:
  id: fe93e83316c25b45
  type: split
  children: [1 items]
  direction: vertical
left:
  id: f47a6dfecb99b477
  type: split
  children: [1 items: {...}...]
  direction: horizontal
  width: 209.5
right:
  id: d49c2867cc4d787d
  type: split
  children: [1 items: {...}...]
  direction: horizontal
  width: 300
  collapsed: true
left-ribbon:
  hiddenItems:
    switcher:Open quick switcher: false
    graph:Open graph view: false
    canvas:Create new canvas: false
    daily-notes:Open today's daily note: false
    templates:Insert template: false
    command-palette:Open command palette: false
    bases:Create new base: false
    fit:Sync to GitHub: false
    templater-obsidian:Templater: false
    obsidian-kanban:Create new board: false
    vibe-rpg:Открыть Vibe RPG: false
    obsidian-textgenerator-plugin:Generate Text!: false
    obsidian-textgenerator-plugin:Text Generator: Templates Packages Manager: false
active: 27ac3a931d4e283d
lastOpenFiles: [47 items: Areas/Job Applications/resume - full ver.pdf, Templates/textgenerator/GM-Campaign Continuity Audit.md, Projects/obsilo-shared/knowledge.db.bak...]
```

For full settings, read: `.obsidian/workspace.json`

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/workspace.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
