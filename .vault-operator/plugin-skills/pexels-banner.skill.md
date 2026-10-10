---
id: pexels-banner
name: Pixel Banner
source: vault-native
plugin-type: community
status: enabled
class: FULL
description: "Enhance your notes with customizable banner images, including AI-generated designs and a curated store of downloadable banners. Transform your workspace with visually stunning headers that add context, improve aesthetics, and take your note-taking beyond the ordinary."
has-settings: true
commands:
  - id: "pexels-banner:generate-banner-with-ai"
    name: "Pixel Banner: ✨ Generate Banner with AI"
  - id: "pexels-banner:play-daily-game"
    name: "Pixel Banner: 🕹️ Play Daily Game"
  - id: "pexels-banner:pin-banner-image"
    name: "Pixel Banner: 📌 Pin current banner image"
  - id: "pexels-banner:refresh-banner-image"
    name: "Pixel Banner: 🔄 Refresh current banner image"
  - id: "pexels-banner:open-pixel-banner-select"
    name: "Pixel Banner: 🚩 Pixel Banner Menu"
  - id: "pexels-banner:set-banner-image"
    name: "Pixel Banner: 💾 Select Banner from Vault"
  - id: "pexels-banner:open-banner-store"
    name: "Pixel Banner: 🏪 Open Pixel Banner Plus Collection"
  - id: "pexels-banner:set-banner-icon-image"
    name: "Pixel Banner: ⭐ Select Banner Icon Image"
  - id: "pexels-banner:set-banner-icon"
    name: "Pixel Banner: 📰 Set Banner Icon Text / Emoji"
  - id: "pexels-banner:set-banner-position"
    name: "Pixel Banner: 🎯 Adjust Position, Size, & Style"
---

# Pixel Banner

**Description:** Enhance your notes with customizable banner images, including AI-generated designs and a curated store of downloadable banners. Transform your workspace with visually stunning headers that add context, improve aesthetics, and take your note-taking beyond the ordinary.
**Status:** Enabled
**Plugin ID:** pexels-banner

## Available Commands

Available command IDs (use execute_command for Obsidian-native commands):
- `pexels-banner:generate-banner-with-ai` -- Pixel Banner: ✨ Generate Banner with AI
- `pexels-banner:play-daily-game` -- Pixel Banner: 🕹️ Play Daily Game
- `pexels-banner:pin-banner-image` -- Pixel Banner: 📌 Pin current banner image
- `pexels-banner:refresh-banner-image` -- Pixel Banner: 🔄 Refresh current banner image
- `pexels-banner:open-pixel-banner-select` -- Pixel Banner: 🚩 Pixel Banner Menu
- `pexels-banner:set-banner-image` -- Pixel Banner: 💾 Select Banner from Vault
- `pexels-banner:open-banner-store` -- Pixel Banner: 🏪 Open Pixel Banner Plus Collection
- `pexels-banner:set-banner-icon-image` -- Pixel Banner: ⭐ Select Banner Icon Image
- `pexels-banner:set-banner-icon` -- Pixel Banner: 📰 Set Banner Icon Text / Emoji
- `pexels-banner:set-banner-position` -- Pixel Banner: 🎯 Adjust Position, Size, & Style

## Configuration File

Settings path: `.obsidian/plugins/pexels-banner/data.json`

To configure this plugin programmatically:
1. Read the config: read_file(".obsidian/plugins/pexels-banner/data.json")
2. Understand the settings structure and modify values as needed
3. Write changes: write_file(".obsidian/plugins/pexels-banner/data.json", updatedJSON)

Do NOT ask the user to open Settings UI. Modify data.json directly.

## Current Configuration

These are the plugin's current settings (sensitive values redacted):

```
pixelBannerPlusEnabled: true
apiProvider: all
imageSize: medium
imageOrientation: landscape
numberOfImages: 10
defaultKeywords: nature, abstract, landscape, technology, art, cityscape, wildlife, ocean, mountains, forest, space, architecture, food, travel, science, music, sports, fashion, business, education, health, culture, history, weather, transportation, industry, people, animals, plants, patterns
xPosition: 50
yPosition: 60
customBannerField: [banner]
customXPositionField: [banner-x, x]
customYPositionField: [banner-y, y]
customContentStartField: [content-start]
customImageDisplayField: [banner-display]
customImageRepeatField: [banner-repeat]
customBannerMaxWidthField: [banner-max-width]
customBannerAlignmentField: [banner-align]
customBannerHeightField: [banner-height]
customFadeField: [banner-fade]
customBorderRadiusField: [banner-radius]
customTitleColorField: [banner-inline-title-color]
customBannerShuffleField: [banner-shuffle]
customBannerIconField: [icon]
customBannerIconImageField: [icon-image]
customBannerIconSizeField: [icon-size]
customBannerIconImageSizeMultiplierField: [icon-image-size-multiplier]
customBannerIconTextVerticalOffsetField: [icon-text-vertical-offset]
customBannerIconRotateField: [icon-rotate]
customBannerIconXPositionField: [icon-x]
customBannerIconOpacityField: [icon-opacity]
customBannerIconColorField: [icon-color]
customBannerIconFontWeightField: [icon-font-weight]
customBannerIconBackgroundColorField: [icon-bg-color]
customBannerIconPaddingXField: [icon-padding-x]
customBannerIconPaddingYField: [icon-padding-y]
customBannerIconBorderRadiusField: [icon-border-radius]
customBannerIconVerticalOffsetField: [icon-y]
customBannerIconImageAlignmentField: [banner-icon-image-alignment]
customFlagColorField: [pixel-banner-flag-color]
contentStartPosition: 355
imageDisplay: cover
imageRepeat: false
bannerHeight: 350
bannerMaxWidth: 2560
fade: -40
bannerFadeInAnimationDuration: 300
borderRadius: 17
showPinIcon: false
pinnedImageFolder: pixel-banner-images
pinnedImageFilename: pixel-banner-image
imagePropertyFormat: image
showReleaseNotes: true
lastVersion: 3.6.18
showRefreshIcon: false
showViewImageIcon: false
hidePixelBannerFields: true
hidePropertiesSectionIfOnlyBanner: true
titleColor: var(--inline-title-color)
enableImageShuffle: false
hideEmbeddedNoteTitles: false
hideEmbeddedNoteBanners: false
showBannerInPopoverPreviews: true
showSelectImageIcon: true
selectImageIconOpacity: 40
selectImageIconFlag: red
useShortPath: true
bannerGap: 12
bannerIconSize: 70
bannerIconImageSizeMultiplier: 1
bannerIconTextVerticalOffset: 0
bannerIconXPosition: 75
bannerIconOpacity: 100
bannerIconFontWeight: normal
bannerIconPaddingX: 10
bannerIconPaddingY: 10
bannerIconBorderRadius: 17
bannerIconVerticalOffset: 0
bannerIconImageAlignment: left
openTargetingModalAfterSelectingBannerOrIcon: true
enableDailyGame: false
```
(5 sensitive field(s) redacted)

For full settings, read: `.obsidian/plugins/pexels-banner/data.json`

## Documentation

For detailed plugin documentation (commands, options, dependencies):
read_file(".vault-operator/plugin-skills/pexels-banner.readme.md")

## Usage

When the user asks for functionality related to Pixel Banner:
1. Read the plugin documentation (.readme.md) to understand capabilities and dependencies
2. Read the config file (.obsidian/plugins/pexels-banner/data.json). If it does not exist, that is normal -- create it with the required settings
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
