---
id: quickadd
name: QuickAdd
source: vault-native
plugin-type: community
status: disabled
class: FULL
description: "Quickly add new pages or content to your vault."
has-settings: true
needs-setup: true
commands:
  - id: "quickadd:runQuickAdd"
    name: "QuickAdd: Run"
  - id: "quickadd:resumePrompt"
    name: "QuickAdd: Return to prompt"
  - id: "quickadd:runTemplateFromFolder"
    name: "QuickAdd: New note from template"
  - id: "quickadd:applyTemplateToActiveFile"
    name: "QuickAdd: Apply template to active note"
  - id: "quickadd:reloadQuickAdd"
    name: "QuickAdd: Reload (dev)"
  - id: "quickadd:openQuickAddSettings"
    name: "QuickAdd: Open settings"
  - id: "quickadd:openAIAssistantSettings"
    name: "QuickAdd: Open AI Assistant settings"
---

# QuickAdd

**Description:** Quickly add new pages or content to your vault.
**Status:** Disabled
**Plugin ID:** quickadd

## Setup Required

Plugin is disabled. Use enable_plugin to activate it first.
Guide the user to configure this plugin via Obsidian Settings if needed.

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `quickadd:runQuickAdd` -- QuickAdd: Run
- `quickadd:resumePrompt` -- QuickAdd: Return to prompt
- `quickadd:runTemplateFromFolder` -- QuickAdd: New note from template
- `quickadd:applyTemplateToActiveFile` -- QuickAdd: Apply template to active note
- `quickadd:reloadQuickAdd` -- QuickAdd: Reload (dev)
- `quickadd:openQuickAddSettings` -- QuickAdd: Open settings
- `quickadd:openAIAssistantSettings` -- QuickAdd: Open AI Assistant settings

## Plugin API

This plugin exposes a JavaScript API. Use call_plugin_api to call these methods:
- `hasOwnProperty` -- call via call_plugin_api("quickadd", "hasOwnProperty", [args])
- `isPrototypeOf` -- call via call_plugin_api("quickadd", "isPrototypeOf", [args])
- `propertyIsEnumerable` -- call via call_plugin_api("quickadd", "propertyIsEnumerable", [args])
- `toString` -- call via call_plugin_api("quickadd", "toString", [args])
- `valueOf` -- call via call_plugin_api("quickadd", "valueOf", [args])
- `toLocaleString` -- call via call_plugin_api("quickadd", "toLocaleString", [args])

Note: Dynamically discovered methods require user approval for each call unless marked as safe in settings.

## Configuration File

Settings path: `.obsidian/plugins/quickadd/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/quickadd/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/quickadd/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
inputPrompt: single-line
persistInputPromptDrafts: true
useSelectionAsCaptureValue: true
namePastedImagesAfterNoteTitle: false
searchNestedChoices: true
templateFolderLauncherRow: bottom
devMode: false
announceUpdates: major
onePageInputEnabled: false
disableOnlineFeatures: true
enableUriCallbacks: false
enableRibbonIcon: false
showCaptureNotification: true
showInputCancellationNotification: false
enableTemplatePropertyTypes: false
dateAliases:
  t: today
  tm: tomorrow
  yd: yesterday
  nw: next week
  nm: next month
  ny: next year
  lw: last week
  lm: last month
  ly: last year
showDateCalendar: true
ai:
  defaultModel: Ask me
  defaultSystemPrompt: [string, 731 chars]
  showAssistant: true
  providers: [2 items: {...}, {...}...]
  confirmToolCalls: destructive
migrations:
  useQuickAddTemplateFolder: true
  incrementFileNameSettingMoveToDefaultBehavior: true
  consolidateFileExistsBehavior: true
  repairTemplateFileExistsBehavior: true
  mutualExclusionInsertAfterAndWriteToBottomOfFile: true
  setVersionAfterUpdateModalRelease: true
  addDefaultAIProviders: true
  removeMacroIndirection: true
  migrateFileOpeningSettings: true
  backfillFileOpeningDefaults: true
  setProviderModelDiscoveryMode: true
  migrateToMultipleTemplateFolders: true
  refreshStaleDefaultModelSeeds: true
  pinAiModelRefs: true
```
(1 sensitive field(s) redacted)

For full settings, read: `.obsidian/plugins/quickadd/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/quickadd.readme.md")

## Usage

This plugin is currently disabled. Use enable_plugin("quickadd") to activate it first.
After enabling, the plugin's commands will become available for execute_command.
