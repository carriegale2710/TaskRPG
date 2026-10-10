---
id: graph
name: Graph View
source: core
plugin-type: core
status: enabled
class: PARTIAL
description: "Visualize note connections as a graph"
has-settings: true
commands:
  - id: "graph:open"
    name: "Open graph view"
  - id: "graph:open-local"
    name: "Open local graph"
---

Plugin "Graph View" visualizes connections between notes.

Available commands:
- graph:open -- Open the full vault graph view
- graph:open-local -- Open a local graph showing connections of the active note

Use this when the user wants to visualize note relationships or explore the knowledge graph.

## Configuration File

Settings path: `.obsidian/graph.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/graph.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/graph.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify config directly.

## Current Configuration

```
collapse-filter: false
showTags: false
showAttachments: false
hideUnresolved: false
showOrphans: true
collapse-color-groups: true
collapse-display: false
showArrow: false
textFadeMultiplier: -1.5
nodeSizeMultiplier: 1
lineSizeMultiplier: 1
collapse-forces: true
centerStrength: 0.518713248970312
repelStrength: 10
linkStrength: 1
linkDistance: 250
scale: 0.19571211490043902
close: true
```

For full settings, read: `.obsidian/graph.json`

## Documentation

For detailed documentation:
read_file(".vault-operator/plugin-skills/graph.readme.md")

IMPORTANT: After reading this file, ALWAYS take action or respond. Never end silently.
