---
id: image-converter
name: Image Converter
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Convert, compress, resize, annotate, markup, draw, crop, rotate, flip, align images directly in Obsidian. Drag-resize, rename with variables, batch process. WEBP, JPG, PNG, HEIC, TIF."
has-settings: false
needs-setup: true
commands:
  - id: "image-converter:process-all-vault-images"
    name: "Image Converter: Process all vault images"
  - id: "image-converter:process-all-images-current-note"
    name: "Image Converter: Process all images in current note"
  - id: "image-converter:open-image-converter-settings"
    name: "Image Converter: Open Image Converter Settings"
  - id: "image-converter:reload-plugin"
    name: "Image Converter: Reload plugin"
---

# Image Converter

**Description:** Convert, compress, resize, annotate, markup, draw, crop, rotate, flip, align images directly in Obsidian. Drag-resize, rename with variables, batch process. WEBP, JPG, PNG, HEIC, TIF.
**Status:** Enabled
**Plugin ID:** image-converter

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `image-converter:process-all-vault-images` -- Image Converter: Process all vault images
- `image-converter:process-all-images-current-note` -- Image Converter: Process all images in current note
- `image-converter:open-image-converter-settings` -- Image Converter: Open Image Converter Settings
- `image-converter:reload-plugin` -- Image Converter: Reload plugin

## Configuration File

Settings path: `.obsidian/plugins/image-converter/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/image-converter/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/image-converter/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/image-converter.readme.md")

## Usage

When the user asks for functionality related to Image Converter:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/image-converter/data.json). If it does not exist, that is normal -- create it with the required settings
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
