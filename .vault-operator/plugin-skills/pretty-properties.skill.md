---
id: pretty-properties
name: Pretty Properties
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Transform the way properties in the note are displayed: add colors, custom formats and additional elements, or even hide unused properties. Also you can add decorative images to the note like banners, icons and covers."
has-settings: true
commands:
  - id: "pretty-properties:toggle-hidden-properties"
    name: "Pretty Properties: Toggle reveal / hide hidden properties"
  - id: "pretty-properties:select-banner-image"
    name: "Pretty Properties: Select banner image"
  - id: "pretty-properties:remove-banner"
    name: "Pretty Properties: Remove banner"
  - id: "pretty-properties:select-icon"
    name: "Pretty Properties: Select icon"
  - id: "pretty-properties:remove-icon"
    name: "Pretty Properties: Remove icon"
  - id: "pretty-properties:select-cover-image"
    name: "Pretty Properties: Select cover image"
  - id: "pretty-properties:remove-cover"
    name: "Pretty Properties: Remove cover"
  - id: "pretty-properties:select-cover-shape"
    name: "Pretty Properties: Select cover shape"
  - id: "pretty-properties:select-image-for-file"
    name: "Pretty Properties: Show images menu"
  - id: "pretty-properties:insert-image"
    name: "Pretty Properties: Insert image"
  - id: "pretty-properties:insert-emoji"
    name: "Pretty Properties: Insert emoji"
---

# Pretty Properties

**Description:** Transform the way properties in the note are displayed: add colors, custom formats and additional elements, or even hide unused properties. Also you can add decorative images to the note like banners, icons and covers.
**Status:** Enabled
**Plugin ID:** pretty-properties

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `pretty-properties:toggle-hidden-properties` -- Pretty Properties: Toggle reveal / hide hidden properties
- `pretty-properties:select-banner-image` -- Pretty Properties: Select banner image
- `pretty-properties:remove-banner` -- Pretty Properties: Remove banner
- `pretty-properties:select-icon` -- Pretty Properties: Select icon
- `pretty-properties:remove-icon` -- Pretty Properties: Remove icon
- `pretty-properties:select-cover-image` -- Pretty Properties: Select cover image
- `pretty-properties:remove-cover` -- Pretty Properties: Remove cover
- `pretty-properties:select-cover-shape` -- Pretty Properties: Select cover shape
- `pretty-properties:select-image-for-file` -- Pretty Properties: Show images menu
- `pretty-properties:insert-image` -- Pretty Properties: Insert image
- `pretty-properties:insert-emoji` -- Pretty Properties: Insert emoji

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `getPropertyBackgroundColorValue` -- call via call_plugin_api("pretty-properties", "getPropertyBackgroundColorValue", [args])
- `getPropertyTextColorValue` -- call via call_plugin_api("pretty-properties", "getPropertyTextColorValue", [args])
- `getPropertyBackgroundColorSetting` -- call via call_plugin_api("pretty-properties", "getPropertyBackgroundColorSetting", [args])
- `getPropertyTextColorSetting` -- call via call_plugin_api("pretty-properties", "getPropertyTextColorSetting", [args])
- `setPPColorStyles` -- call via call_plugin_api("pretty-properties", "setPPColorStyles", [args])
- `setPPTextColor` -- call via call_plugin_api("pretty-properties", "setPPTextColor", [args])
- `setPPBackgroundColor` -- call via call_plugin_api("pretty-properties", "setPPBackgroundColor", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/pretty-properties/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/pretty-properties/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/pretty-properties/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
coverProperties: [1 items]
```

For full settings, read: `.obsidian/plugins/pretty-properties/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/pretty-properties.readme.md")

## Usage

When the user asks for functionality related to Pretty Properties:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/pretty-properties/data.json). If it does not exist, that is normal -- create it with the required settings
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
