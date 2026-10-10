---
id: obsidian-day-planner
name: Day Planner
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Turn tasks from daily notes, the Tasks plugin, and calendars into time blocks on an editable timeline, with built-in time tracker."
has-settings: true
commands:
  - id: "obsidian-day-planner:re-sync"
    name: "Day Planner: Re-sync tasks"
  - id: "obsidian-day-planner:jump-to-active-clock"
    name: "Day Planner: Jump to active clock"
  - id: "obsidian-day-planner:show-day-planner-timeline"
    name: "Day Planner: Show timeline"
  - id: "obsidian-day-planner:show-timeline-tab"
    name: "Day Planner: Show timeline in regular tab"
  - id: "obsidian-day-planner:show-weekly-view"
    name: "Day Planner: Show week planner"
  - id: "obsidian-day-planner:show-multi-day-view"
    name: "Day Planner: Show multi-day planner"
  - id: "obsidian-day-planner:show-time-tracker"
    name: "Day Planner: Show time tracker"
  - id: "obsidian-day-planner:show-time-tracker-tab"
    name: "Day Planner: Show time tracker in regular tab"
  - id: "obsidian-day-planner:show-day-planner-today-note"
    name: "Day Planner: Open today's Day Planner"
  - id: "obsidian-day-planner:reorder-tasks-by-time"
    name: "Day Planner: Sort tasks under cursor by time"
  - id: "obsidian-day-planner:clock-in"
    name: "Day Planner: Clock in"
  - id: "obsidian-day-planner:clock-out"
    name: "Day Planner: Clock out"
  - id: "obsidian-day-planner:cancel-clock"
    name: "Day Planner: Cancel clock"
  - id: "obsidian-day-planner:clock-in-on-anything"
    name: "Day Planner: Clock in on anything..."
---

# Day Planner

**Description:** Turn tasks from daily notes, the Tasks plugin, and calendars into time blocks on an editable timeline, with built-in time tracker.
**Status:** Enabled
**Plugin ID:** obsidian-day-planner

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `obsidian-day-planner:re-sync` -- Day Planner: Re-sync tasks
- `obsidian-day-planner:jump-to-active-clock` -- Day Planner: Jump to active clock
- `obsidian-day-planner:show-day-planner-timeline` -- Day Planner: Show timeline
- `obsidian-day-planner:show-timeline-tab` -- Day Planner: Show timeline in regular tab
- `obsidian-day-planner:show-weekly-view` -- Day Planner: Show week planner
- `obsidian-day-planner:show-multi-day-view` -- Day Planner: Show multi-day planner
- `obsidian-day-planner:show-time-tracker` -- Day Planner: Show time tracker
- `obsidian-day-planner:show-time-tracker-tab` -- Day Planner: Show time tracker in regular tab
- `obsidian-day-planner:show-day-planner-today-note` -- Day Planner: Open today's Day Planner
- `obsidian-day-planner:reorder-tasks-by-time` -- Day Planner: Sort tasks under cursor by time
- `obsidian-day-planner:clock-in` -- Day Planner: Clock in
- `obsidian-day-planner:clock-out` -- Day Planner: Clock out
- `obsidian-day-planner:cancel-clock` -- Day Planner: Cancel clock
- `obsidian-day-planner:clock-in-on-anything` -- Day Planner: Clock in on anything...

## Configuration File

Settings path: `.obsidian/plugins/obsidian-day-planner/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/obsidian-day-planner/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/obsidian-day-planner/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
snapStepMinutes: 10
progressIndicator: mini-timeline
showTaskNotification: false
zoomLevel: 2
timelineIcon: calendar-with-checkmark
endLabel: All done
startHour: 6
timelineDateFormat: YYYY-MM-DD
centerNeedle: false
plannerHeading: Day planner
plannerHeadingLevel: 1
timelineColored: false
timelineStartColor: #006466
timelineEndColor: #4d194d
timestampFormat: HH:mm
hourFormat: H
extendDurationUntilNext: false
defaultDurationMinutes: 30
minimalDurationMinutes: 10
showTimestampInTaskBlock: false
showUnscheduledNestedTasks: true
showNow: true
showNext: true
pluginVersion: 0.35.1
showCompletedTasks: true
showSubtasksInTaskBlocks: true
releaseNotes: true
taskStatusOnCreation:  
eventFormatOnCreation: task
sortTasksInPlanAfterEdit: false
firstDayOfWeek: monday
multiDayRange: 3-days
showActiveClockInStatusBar: true
timelineColumns:
  planner: true
  timeTracker: false
```

For full settings, read: `.obsidian/plugins/obsidian-day-planner/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/obsidian-day-planner.readme.md")

## Usage

When the user asks for functionality related to Day Planner:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/obsidian-day-planner/data.json). If it does not exist, that is normal -- create it with the required settings
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
