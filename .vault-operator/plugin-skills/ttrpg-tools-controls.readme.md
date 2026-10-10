# TTRPG Tools - Controls

**TTRPG Tools - Controls** is a configurable command center for the TTRPG Tools plugin ecosystem in Obsidian.

Build a personalized sidebar of the actions you use most: organize controls into groups, arrange buttons freely, customize their appearance, and keep your tabletop workflow one click away.

---

## Highlights

- Dedicated **Controls** side pane
- Create and reorder custom groups
- Add, reorder, and move buttons between groups
- Optional group headings for clean, minimal layouts
- Configurable spacing after every group
- Per-group accent colors
- Per-button icon and color overrides
- Global accent color, panel color, button size, spacing, and corner radius
- Responsive button wrapping for narrow sidebars
- Graceful handling of disabled, unavailable, or missing provider plugins
- Optional click-to-fold behavior for headings in Reading view
- Persistent removal and restoration of selected built-in Obsidian side panes
- Dedicated, configurable GM Interface navigation pane
- Nested GM pages and rendered Markdown-note previews
- GM Interface entries for complete notes, individual note headings, or GM pages
- Optional native Obsidian hover previews for links inside GM note previews
- Separate JSON backup export and import for Controls and GM Interface layouts
- Versioned provider API for compatible TTRPG Tools plugins

Buttons from unavailable providers remain in the layout and are automatically disabled. Your dashboard configuration is preserved even when a provider plugin is temporarily turned off.

---

## Supported providers

TTRPG Tools - Controls currently supports actions from:

- **TTRPG Tools - Maps**
- **TTRPG Tools - Publish**
- **TTRPG Tools - Soundboard**
- **TTRPG Tools - Time**
- **TTRPG Tools - Timeline**
- **TTRPG Tools - Player Screen**

Available actions depend on the installed provider plugins and their current state.

### Additional integrations

Controls also provides built-in management actions for:

- Opening **TTRPG Tools - Controls** settings
- Opening **Style Settings** plugin settings
- Opening the Obsidian **Command Palette**
- Reloading Obsidian without saving
- Hiding or showing the Obsidian **Ribbon**
- Switching between Obsidian's built-in light and dark themes
- Hiding configured files and folders in the **File Explorer**

The Style Settings action is shown as unavailable when the **Style Settings** plugin is not installed or enabled.

### File and folder visibility buttons

The **Toggle files and folders** action can be added multiple times. Each
button has its own independent configuration for folders and files.

- Configure one vault-relative path per line.
- Folder example: `Campaign/GM Notes`
- File example: `Campaign/GM Notes/Secrets.md`
- Active buttons hide their configured entries in Obsidian's File Explorer.

Visibility buttons do not delete files and do not remove them from vault
search, links, embeds, or other plugins.

---

## Installation

1. Build or download the plugin files.
2. Create the following folder in your vault:

   ```text
   .obsidian/plugins/ttrpg-tools-controls
   ```

3. Copy these files into the folder:

   ```text
   main.js
   manifest.json
   styles.css
   ```

4. Enable **TTRPG Tools - Controls** in:

   ```text
   Settings → Community plugins
   ```

---

## Usage

1. Open the Command Palette.
2. Run:

   ```text
   TTRPG Tools - Controls: Open controls
   ```

   You can also use the dashboard icon in the ribbon.

3. Open the plugin settings to configure your control center:
   - Create groups for different parts of your workflow
   - Add actions from installed TTRPG Tools providers
   - Move groups and buttons with the provided up and down controls
   - Move buttons into another group
   - Customize group colors, headings, and spacing
   - Override individual button icons and colors

The Controls pane updates when provider action states change, for example when an action becomes available after a calendar, map, timeline, or other relevant resource is loaded.

---

## GM Interface

The GM Interface is a dedicated, configurable navigation pane intended for
quick access to campaign material during a session.

1. Open **Settings → TTRPG Tools - Controls**.
2. In the **GM Interface** section, select **Configure GM Interface**.
3. Create one or more GM pages and choose a start page.
4. Add columns and entries to each page.
5. Run:

   ```text
   TTRPG Tools - Controls: Open GM interface
   ```

   The GM Interface opens in the left side pane.

### Pages, columns, and entries

- A GM page can contain multiple columns. Columns wrap automatically when the
  side pane is narrow.
- Column headings are optional and can have custom colors, underlines, and
  collapsible content.
- The collapsed state of a collapsible column is retained between sessions.
- Entries can target another GM page, a complete Markdown note, or a specific
  heading within a Markdown note.
- Entries can use a vault image as a thumbnail and can optionally display a
  border, a custom border color, and a custom background color.

Hover an entry thumbnail to open its target in an anchored preview panel.
Nested GM-page targets open additional preview panels alongside the current
one. Markdown-note targets are rendered directly in the preview panel.

### Light-theme background adjustment

GM Interface entries can use dark custom background colors for readability in
dark themes. The **Light-theme box brightness** Style Settings option brightens
these custom entry backgrounds only while a light Obsidian theme is active.
This allows the same GM Interface color configuration to remain usable when
switching between dark and light themes.

### Links in GM note previews

Internal links in rendered GM note previews retain their regular Obsidian
navigation behavior:

- Click a link to open it normally.
- Middle-click a link to open it in a new leaf.
- Enable **Automatic link previews** in the GM Interface settings to show
  Obsidian's native hover preview for internal links.

---

## Reading view heading folding

Enable **Click headings to fold** in the plugin settings to fold or unfold
sections in Obsidian Reading view by clicking the heading text itself.

Links, buttons, form controls, editable content, and the native collapse
indicator inside a heading retain their normal behavior.

---

## Built-in side pane management

Right-click the tab header of a supported built-in Obsidian side pane to open
the Controls pane-management menu.

Supported panes:

- Files
- Backlinks
- Search
- Outgoing Links
- Bookmarks
- Tags
- Outline

The menu can pin a pane, link it with another tab, move it to a new window on
desktop, or permanently remove it from the workspace layout. Removed panes are
stored in the Controls settings and are detached again after layout changes and
after restarting Obsidian, so Obsidian does not automatically add them back.

Use **Restore removed panes** from the same managed context menu to add a
previously removed pane back to its original side.

---

## Backup and restore

The plugin settings provide independent JSON backups for:

- Controls groups and buttons
- GM Interface pages, columns, and entries

Exports are downloaded as JSON files. Imports use a vault-relative path to a
JSON file and replace the respective current configuration after confirmation.

---

## Provider API

Plugins can integrate with Controls by exposing a public property named:

```ts
plugin.controlsApi
```

The API contract is:

```ts
interface ControlsProviderApi {
  apiVersion: 1;
  providerId: string;
  providerName: string;
  getActions(): ControlsProviderAction[];
  executeAction(actionId: string): Promise<void>;
  onActionsChanged?(callback: () => void): () => void;
}
```

Each action should use a stable identifier, for example:

```text
map.open
timeline.open
soundboard.play
event.create
```

Providers should expose only public user-facing actions. Controls intentionally does not access provider-internal views, private fields, modals, or stored data directly.

## License

MIT