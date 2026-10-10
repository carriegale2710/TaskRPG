---
id: breadcrumbs
name: Breadcrumbs
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Add structured hierarchies to your notes."
has-settings: true
commands:
  - id: "breadcrumbs:rebuild-graph"
    name: "Breadcrumbs: Rebuild graph"
  - id: "breadcrumbs:open-matrix-view"
    name: "Breadcrumbs: Open matrix view"
  - id: "breadcrumbs:open-tree-view"
    name: "Breadcrumbs: Open tree view"
  - id: "breadcrumbs:create-list-index"
    name: "Breadcrumbs: Create list index"
  - id: "breadcrumbs:graph-stats"
    name: "Breadcrumbs: Show/copy graph stats"
  - id: "breadcrumbs:generate-edge-audit-report"
    name: "Breadcrumbs: Generate edge audit report"
  - id: "breadcrumbs:freeze-implied-edges-to-note"
    name: "Breadcrumbs: Freeze implied edges to note"
  - id: "breadcrumbs:freeze-implied-edges-to-vault"
    name: "Breadcrumbs: Freeze implied edges to all notes in vault"
  - id: "breadcrumbs:export-to-canvas"
    name: "Breadcrumbs: Export to canvas"
  - id: "breadcrumbs:jump-to-neighbour-picker"
    name: "Breadcrumbs: Jump to neighbour (picker)"
  - id: "breadcrumbs:jump-to-first-neighbour-group:ups"
    name: "Breadcrumbs: Jump to first neighbour by group:ups"
  - id: "breadcrumbs:jump-to-first-neighbour-group:downs"
    name: "Breadcrumbs: Jump to first neighbour by group:downs"
  - id: "breadcrumbs:jump-to-first-neighbour-group:sames"
    name: "Breadcrumbs: Jump to first neighbour by group:sames"
  - id: "breadcrumbs:jump-to-first-neighbour-group:nexts"
    name: "Breadcrumbs: Jump to first neighbour by group:nexts"
  - id: "breadcrumbs:jump-to-first-neighbour-group:prevs"
    name: "Breadcrumbs: Jump to first neighbour by group:prevs"
  - id: "breadcrumbs:jump-to-first-neighbour-field:up"
    name: "Breadcrumbs: Jump to first neighbour by field:up"
  - id: "breadcrumbs:jump-to-first-neighbour-field:down"
    name: "Breadcrumbs: Jump to first neighbour by field:down"
  - id: "breadcrumbs:jump-to-first-neighbour-field:same"
    name: "Breadcrumbs: Jump to first neighbour by field:same"
  - id: "breadcrumbs:jump-to-first-neighbour-field:next"
    name: "Breadcrumbs: Jump to first neighbour by field:next"
  - id: "breadcrumbs:jump-to-first-neighbour-field:prev"
    name: "Breadcrumbs: Jump to first neighbour by field:prev"
  - id: "breadcrumbs:thread-field:up"
    name: "Breadcrumbs: Thread by field:up"
  - id: "breadcrumbs:thread-field:down"
    name: "Breadcrumbs: Thread by field:down"
  - id: "breadcrumbs:thread-field:same"
    name: "Breadcrumbs: Thread by field:same"
  - id: "breadcrumbs:thread-field:next"
    name: "Breadcrumbs: Thread by field:next"
  - id: "breadcrumbs:thread-field:prev"
    name: "Breadcrumbs: Thread by field:prev"
  - id: "breadcrumbs:toggle-sticky-page-views"
    name: "Breadcrumbs: Toggle sticky page views"
---

# Breadcrumbs

**Description:** Add structured hierarchies to your notes.
**Status:** Enabled
**Plugin ID:** breadcrumbs

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `breadcrumbs:rebuild-graph` -- Breadcrumbs: Rebuild graph
- `breadcrumbs:open-matrix-view` -- Breadcrumbs: Open matrix view
- `breadcrumbs:open-tree-view` -- Breadcrumbs: Open tree view
- `breadcrumbs:create-list-index` -- Breadcrumbs: Create list index
- `breadcrumbs:graph-stats` -- Breadcrumbs: Show/copy graph stats
- `breadcrumbs:generate-edge-audit-report` -- Breadcrumbs: Generate edge audit report
- `breadcrumbs:freeze-implied-edges-to-note` -- Breadcrumbs: Freeze implied edges to note
- `breadcrumbs:freeze-implied-edges-to-vault` -- Breadcrumbs: Freeze implied edges to all notes in vault
- `breadcrumbs:export-to-canvas` -- Breadcrumbs: Export to canvas
- `breadcrumbs:jump-to-neighbour-picker` -- Breadcrumbs: Jump to neighbour (picker)
- `breadcrumbs:jump-to-first-neighbour-group:ups` -- Breadcrumbs: Jump to first neighbour by group:ups
- `breadcrumbs:jump-to-first-neighbour-group:downs` -- Breadcrumbs: Jump to first neighbour by group:downs
- `breadcrumbs:jump-to-first-neighbour-group:sames` -- Breadcrumbs: Jump to first neighbour by group:sames
- `breadcrumbs:jump-to-first-neighbour-group:nexts` -- Breadcrumbs: Jump to first neighbour by group:nexts
- `breadcrumbs:jump-to-first-neighbour-group:prevs` -- Breadcrumbs: Jump to first neighbour by group:prevs
- `breadcrumbs:jump-to-first-neighbour-field:up` -- Breadcrumbs: Jump to first neighbour by field:up
- `breadcrumbs:jump-to-first-neighbour-field:down` -- Breadcrumbs: Jump to first neighbour by field:down
- `breadcrumbs:jump-to-first-neighbour-field:same` -- Breadcrumbs: Jump to first neighbour by field:same
- `breadcrumbs:jump-to-first-neighbour-field:next` -- Breadcrumbs: Jump to first neighbour by field:next
- `breadcrumbs:jump-to-first-neighbour-field:prev` -- Breadcrumbs: Jump to first neighbour by field:prev
- `breadcrumbs:thread-field:up` -- Breadcrumbs: Thread by field:up
- `breadcrumbs:thread-field:down` -- Breadcrumbs: Thread by field:down
- `breadcrumbs:thread-field:same` -- Breadcrumbs: Thread by field:same
- `breadcrumbs:thread-field:next` -- Breadcrumbs: Thread by field:next
- `breadcrumbs:thread-field:prev` -- Breadcrumbs: Thread by field:prev
- `breadcrumbs:toggle-sticky-page-views` -- Breadcrumbs: Toggle sticky page views

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `refresh` -- call via call_plugin_api("breadcrumbs", "refresh", [args])
- `create_list_index` -- call via call_plugin_api("breadcrumbs", "create_list_index", [args])
- `get_neighbours` -- call via call_plugin_api("breadcrumbs", "get_neighbours", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/breadcrumbs/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/breadcrumbs/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/breadcrumbs/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
is_dirty: false
edge_fields: [5 items]
edge_field_groups: [5 items]
implied_relations:
  transitive: [5 items]
self_is_sibling: [same]
explicit_edge_sources:
  tag_note:
    default_field: up
  dataview_note:
    default_field: up
  regex_note:
    default_field: up
  dendron_note:
    enabled: false
    delimiter: .
    default_field: up
    display_trimmed: false
  johnny_decimal_note:
    enabled: false
    delimiter: .
    default_field: up
  date_note:
    enabled: false
    date_format: yyyy-MM-dd
    default_field: next
    stretch_to_existing: false
    week_start: monday
    week:
      enabled: false
      date_format: kkkk-'W'WW
      next_field: next
      up_field: up
    month:
      enabled: false
      date_format: yyyy-MM
      next_field: next
      up_field: up
    quarter:
      enabled: false
      date_format: yyyy-'Q'q
      next_field: next
      up_field: up
    year:
      enabled: false
      date_format: yyyy
      next_field: next
      up_field: up
views:
  page:
    all:
      sticky: false
    trail:
      enabled: true
      format: grid
      selection: longest
      default_depth: 999
      show_controls: true
      merge_fields: false
      field_group_labels: [ups]
    prev_next:
      enabled: true
  side:
    matrix:
      collapse: false
      custom_sort_fields: false
      show_attributes: [source, implied_kind, round]
      field_group_labels: [ups, downs, sames, nexts, prevs]
      lock_view: false
    tree:
      collapse: false
      merge_fields: false
      default_depth: 5
      lock_view: false
      field_group_labels: [ups, downs]
      find_root: true
      find_root_field_group_labels: [ups]
  codeblocks:
    show_node_options:
      ext: false
      folder: false
      alias: false
commands:
  rebuild_graph:
    notify: true
    trigger:
      note_save: false
      layout_change: false
  list_index:
    default_options:
      indent: \t
      link_kind: wiki
  freeze_implied_edges:
    default_options:
      destination: frontmatter
      use_alias: true
  thread:
    default_options:
      destination: frontmatter
      target_path_template: {{source.folder}}/{{attr.field}} {{source.basename}}
  create_canvas:
    default_options:
      target_path_template: {{source.folder}}/{{source.basename}} canvas
      depth: 5
      direction: LR
      semantic_sides: false
  edge_audit:
    report_path: Breadcrumbs Edge Audit.md
suggestors:
  edge_field:
    enabled: false
    trigger: .
debug:
  level: SILENT
_bc_migrations:
  tree_ups_with_downs_default: true
  tree_find_root_default: true
```

For full settings, read: `.obsidian/plugins/breadcrumbs/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/breadcrumbs.readme.md")

## Usage

When the user asks for functionality related to Breadcrumbs:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/breadcrumbs/data.json). If it does not exist, that is normal -- create it with the required settings
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
