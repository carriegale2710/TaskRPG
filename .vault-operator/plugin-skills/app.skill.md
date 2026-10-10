---
id: app
name: App
source: core
plugin-type: core
status: enabled
class: FULL
description: "Core app operations: navigation, delete, reload, sidebars"
has-settings: true
commands:
  - id: "app:delete-file"
    name: "Delete current file"
  - id: "app:go-back"
    name: "Navigate back"
  - id: "app:go-forward"
    name: "Navigate forward"
  - id: "app:reload"
    name: "Reload app"
  - id: "app:open-vault"
    name: "Open another vault"
  - id: "app:open-settings"
    name: "Open settings"
  - id: "app:toggle-left-sidebar"
    name: "Toggle left sidebar"
  - id: "app:toggle-right-sidebar"
    name: "Toggle right sidebar"
---

Plugin "App" provides global Obsidian app commands.

Available commands:
- app:delete-file -- Delete the currently active file (moves to trash)
- app:go-back -- Navigate to the previous file in history
- app:go-forward -- Navigate to the next file in history
- app:reload -- Reload the Obsidian app
- app:open-vault -- Open a different vault
- app:open-settings -- Open the Obsidian settings dialog
- app:toggle-left-sidebar -- Show or hide the left sidebar
- app:toggle-right-sidebar -- Show or hide the right sidebar

Note: For programmatic file deletion, prefer the delete_file tool. Use app:delete-file only when the user explicitly wants the native Obsidian delete behavior (trash + UI confirmation).

## Configuration File

Settings path: `.obsidian/app.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/app.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/app.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Current Configuration

```
userIgnoreFilters: [Archives/]
alwaysUpdateLinks: true
```

For full settings, read: `.obsidian/app.json`

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/app.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
