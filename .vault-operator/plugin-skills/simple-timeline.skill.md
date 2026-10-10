---
id: simple-timeline
name: TTRPG Tools - Timeline
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Timeline-Renderer for Calendarium-Frontmatter (fc-date/fc-end). Picture, Callout-Stil, native Popover, mobile friendly."
has-settings: true
commands:
  - id: "simple-timeline:set-cal-date"
    name: "TTRPG Tools - Timeline: Set date"
  - id: "simple-timeline:set-cal-range"
    name: "TTRPG Tools - Timeline: Set date range"
  - id: "simple-timeline:edit-timelines"
    name: "TTRPG Tools - Timeline: Edit timelines"
  - id: "simple-timeline:set-summary"
    name: "TTRPG Tools - Timeline: Set summary"
  - id: "simple-timeline:adopt-first-image"
    name: "TTRPG Tools - Timeline: Use first image as tl image"
---

# TTRPG Tools - Timeline

**Description:** Timeline-Renderer for Calendarium-Frontmatter (fc-date/fc-end). Picture, Callout-Stil, native Popover, mobile friendly.
**Status:** Enabled
**Plugin ID:** simple-timeline

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `simple-timeline:set-cal-date` -- TTRPG Tools - Timeline: Set date
- `simple-timeline:set-cal-range` -- TTRPG Tools - Timeline: Set date range
- `simple-timeline:edit-timelines` -- TTRPG Tools - Timeline: Edit timelines
- `simple-timeline:set-summary` -- TTRPG Tools - Timeline: Set summary
- `simple-timeline:adopt-first-image` -- TTRPG Tools - Timeline: Use first image as tl image

## Configuration File

Settings path: `.obsidian/plugins/simple-timeline/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/simple-timeline/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/simple-timeline/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
dateFormat: D MMMM YYYY
cardWidth: 200
cardHeight: 315
boxHeight: 289
sideGapLeft: 40
sideGapRight: 40
maxSummaryLines: 7
migratedLegacy: true
enableBasesIntegration: false
```

For full settings, read: `.obsidian/plugins/simple-timeline/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/simple-timeline.readme.md")

## Usage

When the user asks for functionality related to TTRPG Tools - Timeline:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/simple-timeline/data.json). If it does not exist, that is normal -- create it with the required settings
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
