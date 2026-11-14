[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

# Status Tracking

[![Version](https://img.shields.io/github/v/tag/iiimabbie/ST-StatusTracking?label=version)](https://github.com/iiimabbie/ST-StatusTracking/tags)
[![License: AFPL](https://img.shields.io/badge/license-AFPL-blue)](LICENSE)

A SillyTavern extension that requests status information in AI replies and displays it in a collapsible side panel. It reads YAML from `myst` code blocks and hides those blocks in rendered messages.

## Features

- Track time, location, weather, news and notes; enable fixed fields and edit their prompts individually.
- Add, edit, enable, delete and drag to reorder text or number fields. Number fields use a gradient progress bar with configurable colors.
- Show the latest valid status found while scanning AI messages backwards, including the selected swipe.
- Choose the panel side and interface language, customize CSS, save and switch presets, export or import settings, and save field, prompt and style settings to a character card.

## Installation

1. In SillyTavern, open Extensions and choose to install an extension.
2. Enter `https://github.com/iiimabbie/ST-StatusTracking` and install it.
3. Reload SillyTavern.

## Usage

1. In the extension settings, enable “啟用狀態面板”. The default interface language is Traditional Chinese; open “擴充設定” in the panel and change “語言” to “English” if needed. The toggle then reads “Enable Status Panel”.
2. In the panel, open “Field Settings”. Use “Fixed Fields Settings” to select fixed fields and edit their prompts, or “Custom Fields Settings” to add fields. Confirm the dialog to save changes.
3. Send a message. When the panel is enabled, the extension injects a prompt asking the AI to append a `myst` block. The panel displays parsed data when a valid block is available; output depends on the AI.
4. Open “Extension Settings” to adjust “Panel Position”, “Language”, “Progress Bar Colors” or “Custom CSS”, and confirm the dialog. Use “Save as New Preset” and “Switch Preset” to manage presets; with a preset selected, “Save” overwrites it and “Delete Preset” removes it. Use “Export All Settings”, “Import All Settings” and “Save to Character” for sharing and backup.

> [!NOTE]
> Importing a backup or switching presets can overwrite current field, prompt and style settings. Character-card data excludes interface preferences such as panel position and debug mode.

## Development

The extension uses JavaScript ES modules and CSS directly; no build step or package installation is required.

Report problems in [Issues](https://github.com/iiimabbie/ST-StatusTracking/issues). The project uses the [Aladdin Free Public License (AFPL)](LICENSE).
