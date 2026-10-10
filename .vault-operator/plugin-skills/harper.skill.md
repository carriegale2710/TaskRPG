---
id: harper
name: Harper
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "The Grammar Checker for Developers"
has-settings: true
commands:
  - id: "harper:harper-toggle-auto-lint"
    name: "Harper: Toggle automatic grammar checking"
  - id: "harper:harper-toggle-sidebar"
    name: "Harper: Toggle spellcheck sidebar"
  - id: "harper:harper-ignore-all-in-buffer"
    name: "Harper: Ignore all errors in the open file"
  - id: "harper:harper-jump-to-next-suggestion"
    name: "Harper: Jump to next suggestion"
  - id: "harper:harper-jump-to-previous-suggestion"
    name: "Harper: Jump to previous suggestion"
  - id: "harper:harper-apply-suggestion-1"
    name: "Harper: Apply suggestion #1"
  - id: "harper:harper-apply-suggestion-2"
    name: "Harper: Apply suggestion #2"
  - id: "harper:harper-apply-suggestion-3"
    name: "Harper: Apply suggestion #3"
  - id: "harper:harper-add-word-to-dictionary"
    name: "Harper: Add current word to dictionary"
  - id: "harper:harper-ignore-focused-diagnostic"
    name: "Harper: Ignore focused diagnostic"
  - id: "harper:harper-dismiss-focused-tooltip"
    name: "Harper: Dismiss focused suggestion tooltip"
---

# Harper

**Description:** The Grammar Checker for Developers
**Status:** Enabled
**Plugin ID:** harper

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `harper:harper-toggle-auto-lint` -- Harper: Toggle automatic grammar checking
- `harper:harper-toggle-sidebar` -- Harper: Toggle spellcheck sidebar
- `harper:harper-ignore-all-in-buffer` -- Harper: Ignore all errors in the open file
- `harper:harper-jump-to-next-suggestion` -- Harper: Jump to next suggestion
- `harper:harper-jump-to-previous-suggestion` -- Harper: Jump to previous suggestion
- `harper:harper-apply-suggestion-1` -- Harper: Apply suggestion #1
- `harper:harper-apply-suggestion-2` -- Harper: Apply suggestion #2
- `harper:harper-apply-suggestion-3` -- Harper: Apply suggestion #3
- `harper:harper-add-word-to-dictionary` -- Harper: Add current word to dictionary
- `harper:harper-ignore-focused-diagnostic` -- Harper: Ignore focused diagnostic
- `harper:harper-dismiss-focused-tooltip` -- Harper: Dismiss focused suggestion tooltip

## Configuration File

Settings path: `.obsidian/plugins/harper/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/harper/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/harper/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
useWebWorker: true
lintEnabled: true
```
(1 sensitive field(s) redacted)

For full settings, read: `.obsidian/plugins/harper/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/harper.readme.md")

## Usage

When the user asks for functionality related to Harper:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/harper/data.json). If it does not exist, that is normal -- create it with the required settings
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
