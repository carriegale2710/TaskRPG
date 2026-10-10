---
id: advanced-canvas
name: Advanced Canvas
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Supercharge your canvas experience! Create presentations, flowcharts and more!"
has-settings: false
needs-setup: true
commands:
  - id: "advanced-canvas:toggle-collapse-group"
    name: "Advanced Canvas: Toggle collapse group"
  - id: "advanced-canvas:create-new-slide"
    name: "Advanced Canvas: Create new slide"
  - id: "advanced-canvas:set-start-node"
    name: "Advanced Canvas: Set start node"
  - id: "advanced-canvas:start-presentation"
    name: "Advanced Canvas: Start presentation"
  - id: "advanced-canvas:continue-presentation"
    name: "Advanced Canvas: Continue presentation"
  - id: "advanced-canvas:end-presentation"
    name: "Advanced Canvas: End presentation"
  - id: "advanced-canvas:previous-node"
    name: "Advanced Canvas: Previous node"
  - id: "advanced-canvas:next-node"
    name: "Advanced Canvas: Next node"
  - id: "advanced-canvas:toggle-readonly"
    name: "Advanced Canvas: Toggle readonly"
  - id: "advanced-canvas:create-text-node"
    name: "Advanced Canvas: Create text node"
  - id: "advanced-canvas:create-file-node"
    name: "Advanced Canvas: Create file node"
  - id: "advanced-canvas:select-all-edges"
    name: "Advanced Canvas: Select all edges"
  - id: "advanced-canvas:zoom-to-selection"
    name: "Advanced Canvas: Zoom to selection"
  - id: "advanced-canvas:zoom-to-fit"
    name: "Advanced Canvas: Zoom to fit"
  - id: "advanced-canvas:clone-node-up"
    name: "Advanced Canvas: Clone node up"
  - id: "advanced-canvas:expand-node-up"
    name: "Advanced Canvas: Expand node up"
  - id: "advanced-canvas:navigate-up"
    name: "Advanced Canvas: Navigate up"
  - id: "advanced-canvas:clone-node-down"
    name: "Advanced Canvas: Clone node down"
  - id: "advanced-canvas:expand-node-down"
    name: "Advanced Canvas: Expand node down"
  - id: "advanced-canvas:navigate-down"
    name: "Advanced Canvas: Navigate down"
  - id: "advanced-canvas:clone-node-left"
    name: "Advanced Canvas: Clone node left"
  - id: "advanced-canvas:expand-node-left"
    name: "Advanced Canvas: Expand node left"
  - id: "advanced-canvas:navigate-left"
    name: "Advanced Canvas: Navigate left"
  - id: "advanced-canvas:clone-node-right"
    name: "Advanced Canvas: Clone node right"
  - id: "advanced-canvas:expand-node-right"
    name: "Advanced Canvas: Expand node right"
  - id: "advanced-canvas:navigate-right"
    name: "Advanced Canvas: Navigate right"
  - id: "advanced-canvas:flip-selection-horizontally"
    name: "Advanced Canvas: Flip selection horizontally"
  - id: "advanced-canvas:flip-selection-vertically"
    name: "Advanced Canvas: Flip selection vertically"
  - id: "advanced-canvas:select-connected-edges"
    name: "Advanced Canvas: Select connected edges"
  - id: "advanced-canvas:select-incoming-edges"
    name: "Advanced Canvas: Select incoming edges"
  - id: "advanced-canvas:select-outgoing-edges"
    name: "Advanced Canvas: Select outgoing edges"
  - id: "advanced-canvas:swap-nodes"
    name: "Advanced Canvas: Swap nodes"
  - id: "advanced-canvas:copy-wikilink-to-node"
    name: "Advanced Canvas: Copy wikilink to node"
  - id: "advanced-canvas:pull-outgoing-links-to-canvas"
    name: "Advanced Canvas: Pull outgoing links to canvas"
  - id: "advanced-canvas:pull-backlinks-to-canvas"
    name: "Advanced Canvas: Pull backlinks to canvas"
  - id: "advanced-canvas:create-group-around-selection"
    name: "Advanced Canvas: Group selected nodes"
  - id: "advanced-canvas:save-node-as-template"
    name: "Advanced Canvas: Save node as template"
  - id: "advanced-canvas:export-all-as-image"
    name: "Advanced Canvas: Export canvas as image"
  - id: "advanced-canvas:export-selected-as-image"
    name: "Advanced Canvas: Export selected nodes as image"
---

# Advanced Canvas

**Description:** Supercharge your canvas experience! Create presentations, flowcharts and more!
**Status:** Enabled
**Plugin ID:** advanced-canvas

## Setup Required

No settings file found (data.json). Plugin may need initial setup via Obsidian Settings.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `advanced-canvas:toggle-collapse-group` -- Advanced Canvas: Toggle collapse group
- `advanced-canvas:create-new-slide` -- Advanced Canvas: Create new slide
- `advanced-canvas:set-start-node` -- Advanced Canvas: Set start node
- `advanced-canvas:start-presentation` -- Advanced Canvas: Start presentation
- `advanced-canvas:continue-presentation` -- Advanced Canvas: Continue presentation
- `advanced-canvas:end-presentation` -- Advanced Canvas: End presentation
- `advanced-canvas:previous-node` -- Advanced Canvas: Previous node
- `advanced-canvas:next-node` -- Advanced Canvas: Next node
- `advanced-canvas:toggle-readonly` -- Advanced Canvas: Toggle readonly
- `advanced-canvas:create-text-node` -- Advanced Canvas: Create text node
- `advanced-canvas:create-file-node` -- Advanced Canvas: Create file node
- `advanced-canvas:select-all-edges` -- Advanced Canvas: Select all edges
- `advanced-canvas:zoom-to-selection` -- Advanced Canvas: Zoom to selection
- `advanced-canvas:zoom-to-fit` -- Advanced Canvas: Zoom to fit
- `advanced-canvas:clone-node-up` -- Advanced Canvas: Clone node up
- `advanced-canvas:expand-node-up` -- Advanced Canvas: Expand node up
- `advanced-canvas:navigate-up` -- Advanced Canvas: Navigate up
- `advanced-canvas:clone-node-down` -- Advanced Canvas: Clone node down
- `advanced-canvas:expand-node-down` -- Advanced Canvas: Expand node down
- `advanced-canvas:navigate-down` -- Advanced Canvas: Navigate down
- `advanced-canvas:clone-node-left` -- Advanced Canvas: Clone node left
- `advanced-canvas:expand-node-left` -- Advanced Canvas: Expand node left
- `advanced-canvas:navigate-left` -- Advanced Canvas: Navigate left
- `advanced-canvas:clone-node-right` -- Advanced Canvas: Clone node right
- `advanced-canvas:expand-node-right` -- Advanced Canvas: Expand node right
- `advanced-canvas:navigate-right` -- Advanced Canvas: Navigate right
- `advanced-canvas:flip-selection-horizontally` -- Advanced Canvas: Flip selection horizontally
- `advanced-canvas:flip-selection-vertically` -- Advanced Canvas: Flip selection vertically
- `advanced-canvas:select-connected-edges` -- Advanced Canvas: Select connected edges
- `advanced-canvas:select-incoming-edges` -- Advanced Canvas: Select incoming edges
- `advanced-canvas:select-outgoing-edges` -- Advanced Canvas: Select outgoing edges
- `advanced-canvas:swap-nodes` -- Advanced Canvas: Swap nodes
- `advanced-canvas:copy-wikilink-to-node` -- Advanced Canvas: Copy wikilink to node
- `advanced-canvas:pull-outgoing-links-to-canvas` -- Advanced Canvas: Pull outgoing links to canvas
- `advanced-canvas:pull-backlinks-to-canvas` -- Advanced Canvas: Pull backlinks to canvas
- `advanced-canvas:create-group-around-selection` -- Advanced Canvas: Group selected nodes
- `advanced-canvas:save-node-as-template` -- Advanced Canvas: Save node as template
- `advanced-canvas:export-all-as-image` -- Advanced Canvas: Export canvas as image
- `advanced-canvas:export-selected-as-image` -- Advanced Canvas: Export selected nodes as image

## Configuration File

Settings path: `.obsidian/plugins/advanced-canvas/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/advanced-canvas/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/advanced-canvas/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/advanced-canvas.readme.md")

## Usage

When the user asks for functionality related to Advanced Canvas:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/advanced-canvas/data.json). If it does not exist, that is normal -- create it with the required settings
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
