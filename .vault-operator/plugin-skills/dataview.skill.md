---
id: dataview
name: Dataview
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Complex data views for the data-obsessed."
has-settings: false
needs-setup: true
commands:
  - id: "dataview:dataview-force-refresh-views"
    name: "Dataview: Force refresh all views and blocks"
  - id: "dataview:dataview-drop-cache"
    name: "Dataview: Drop all cached file metadata"
  - id: "dataview:dataview-rebuild-current-view"
    name: "Dataview: Rebuild current view"
---

# Dataview

**Description:** Complex data views for the data-obsessed.
**Status:** Enabled
**Plugin ID:** dataview

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `dataview:dataview-force-refresh-views` -- Dataview: Force refresh all views and blocks
- `dataview:dataview-drop-cache` -- Dataview: Drop all cached file metadata
- `dataview:dataview-rebuild-current-view` -- Dataview: Rebuild current view

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `pagePaths` -- call via call_plugin_api("dataview", "pagePaths", [args])
- `page` -- call via call_plugin_api("dataview", "page", [args])
- `pages` -- call via call_plugin_api("dataview", "pages", [args])
- `array` -- call via call_plugin_api("dataview", "array", [args])
- `isArray` -- call via call_plugin_api("dataview", "isArray", [args])
- `isDataArray` -- call via call_plugin_api("dataview", "isDataArray", [args])
- `fileLink` -- call via call_plugin_api("dataview", "fileLink", [args])
- `sectionLink` -- call via call_plugin_api("dataview", "sectionLink", [args])
- `blockLink` -- call via call_plugin_api("dataview", "blockLink", [args])
- `date` -- call via call_plugin_api("dataview", "date", [args])
- `duration` -- call via call_plugin_api("dataview", "duration", [args])
- `parse` -- call via call_plugin_api("dataview", "parse", [args])
- `literal` -- call via call_plugin_api("dataview", "literal", [args])
- `clone` -- call via call_plugin_api("dataview", "clone", [args])
- `compare` -- call via call_plugin_api("dataview", "compare", [args])
- `equal` -- call via call_plugin_api("dataview", "equal", [args])
- `query` -- call via call_plugin_api("dataview", "query", [args])
- `tryQuery` -- call via call_plugin_api("dataview", "tryQuery", [args])
- `queryMarkdown` -- call via call_plugin_api("dataview", "queryMarkdown", [args])
- `tryQueryMarkdown` -- call via call_plugin_api("dataview", "tryQueryMarkdown", [args])
- `evaluate` -- call via call_plugin_api("dataview", "evaluate", [args])
- `tryEvaluate` -- call via call_plugin_api("dataview", "tryEvaluate", [args])
- `evaluateInline` -- call via call_plugin_api("dataview", "evaluateInline", [args])
- `list` -- call via call_plugin_api("dataview", "list", [args])
- `table` -- call via call_plugin_api("dataview", "table", [args])
- `taskList` -- call via call_plugin_api("dataview", "taskList", [args])
- `renderValue` -- call via call_plugin_api("dataview", "renderValue", [args])
- `markdownTable` -- call via call_plugin_api("dataview", "markdownTable", [args])
- `markdownList` -- call via call_plugin_api("dataview", "markdownList", [args])
- `markdownTaskList` -- call via call_plugin_api("dataview", "markdownTaskList", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/dataview/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/dataview/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/dataview/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/dataview.readme.md")

## Usage

When the user asks for functionality related to Dataview:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/dataview/data.json). If it does not exist, that is normal -- create it with the required settings
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
