---
id: editor
name: Editor
source: core
plugin-type: core
status: enabled
class: FULL
description: "Editor operations: formatting, headings, inserts, folding, view mode"
has-settings: false
needs-setup: true
commands:
  - id: "editor:save-file"
    name: "Save current file"
  - id: "editor:attach-file"
    name: "Attach file"
  - id: "editor:insert-link"
    name: "Insert link"
  - id: "editor:insert-callout"
    name: "Insert callout"
  - id: "editor:insert-tag"
    name: "Insert tag"
  - id: "editor:set-heading-0"
    name: "Set as paragraph (remove heading)"
  - id: "editor:set-heading-1"
    name: "Set as heading 1"
  - id: "editor:set-heading-2"
    name: "Set as heading 2"
  - id: "editor:set-heading-3"
    name: "Set as heading 3"
  - id: "editor:set-heading-4"
    name: "Set as heading 4"
  - id: "editor:set-heading-5"
    name: "Set as heading 5"
  - id: "editor:set-heading-6"
    name: "Set as heading 6"
  - id: "editor:rename-heading"
    name: "Rename heading"
  - id: "editor:toggle-bold"
    name: "Toggle bold"
  - id: "editor:toggle-italic"
    name: "Toggle italic"
  - id: "editor:toggle-code"
    name: "Toggle inline code"
  - id: "editor:toggle-highlight"
    name: "Toggle highlight"
  - id: "editor:toggle-strikethrough"
    name: "Toggle strikethrough"
  - id: "editor:fold-all"
    name: "Fold all headings and lists"
  - id: "editor:unfold-all"
    name: "Unfold all headings and lists"
  - id: "editor:toggle-source"
    name: "Toggle reading/source view"
---

Plugin "Editor" provides text editing commands for the active note.

Available commands:
- editor:save-file -- Force-save the current file
- editor:attach-file -- Open the attachment picker to embed a file
- editor:insert-link -- Insert a wikilink or markdown link
- editor:insert-callout -- Insert a callout block (> [!type])
- editor:insert-tag -- Insert a tag (#tag)
- editor:set-heading-0..6 -- Set the current line to paragraph (0) or heading level 1-6
- editor:rename-heading -- Rename a heading and update all links pointing to it
- editor:toggle-bold/italic/code/highlight/strikethrough -- Toggle formatting on selection
- editor:fold-all -- Collapse all foldable sections
- editor:unfold-all -- Expand all foldable sections
- editor:toggle-source -- Switch between source/live-preview and reading view

Note: These commands operate on the currently active editor. For programmatic content changes, prefer edit_file or append_to_file tools. Use editor commands when the user wants interactive editing behavior (e.g., "make this bold", "add a callout").

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.

## Configuration File

Settings path: `.obsidian/editor.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/editor.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/editor.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/editor.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
