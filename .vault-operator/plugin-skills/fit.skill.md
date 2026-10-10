---
id: fit
name: Fit
source: vault-native
plugin-type: community
status: enabled
class: PARTIAL
description: "Minimalist File gIT (FIT) to sync your files across mobile and desktop devices using GitHub."
has-settings: true
commands:
  - id: "fit:fit-sync"
    name: "Fit: Fit Sync"
---

# Fit

**Description:** Minimalist File gIT (FIT) to sync your files across mobile and desktop devices using GitHub.
**Status:** Enabled
**Plugin ID:** fit

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `fit:fit-sync` -- Fit: Fit Sync

## Configuration File

Settings path: `.obsidian/plugins/fit/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/fit/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/fit/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
pat: 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
owner: carriegale2710
avatarUrl: https://avatars.githubusercontent.com/u/202268528?v=4
repo: SecondBrainRPG
branch: main
checkEveryXMinutes: 5
autoSync: off
notifyChanges: true
notifyConflicts: true
enableDebugLogging: true
```
(1 sensitive field(s) redacted)

For full settings, read: `.obsidian/plugins/fit/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/fit.readme.md")

## Usage

When the user asks for functionality related to Fit:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/fit/data.json). If it does not exist, that is normal -- create it with the required settings
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
