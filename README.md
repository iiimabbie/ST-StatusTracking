<div align="center">

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

# Status Tracking

**A status side panel for SillyTavern roleplay**

A SillyTavern extension that requests status information in AI replies and displays it in a collapsible side panel. It reads YAML from `myst` code blocks and hides those blocks in rendered messages.

![Version](https://img.shields.io/github/manifest-json/v/iiimabbie/ST-StatusTracking?label=version&color=8a5cf6)
![SillyTavern](https://img.shields.io/badge/SillyTavern-extension-e8a87c)
![i18n](https://img.shields.io/badge/i18n-繁中%20·%20简中%20·%20EN-2ea44f)
![License](https://img.shields.io/badge/license-CC%20BY--NC--ND%204.0-lightgrey)

[Features](#features) · [Installation](#installation) · [Usage](#usage) · [Development](#development)

</div>

## Features

- Track time, location, weather, news and notes; enable fixed fields and edit their prompts individually.
- Add, edit, enable, delete and drag to reorder text or number fields. Number fields use a gradient progress bar with configurable colors.
- Scan AI messages backwards and display the latest valid status, including the selected swipe.
- Choose the panel position and interface language, customize CSS, manage presets, import and export settings, and save fields, prompts and styles to a character card.

## Installation

1. In SillyTavern, open **Extensions** and select **Install extension**.
2. Enter `https://github.com/iiimabbie/ST-StatusTracking` and install it.
3. Reload SillyTavern.

## Usage

1. Enable **Enable Status Panel** in the extension settings. On first install, the interface and default prompts follow SillyTavern's language: Traditional Chinese, Simplified Chinese, or English for other locales. Change the language under **Extension Settings** → **Language** in the panel. Existing custom prompts and fields are retained when changing the language.
2. Open **Field Settings**. Use **Fixed Fields Settings** to select fixed fields and edit their prompts, or **Custom Fields Settings** to add fields. Confirm the dialog to save changes. **Restore Defaults** uses the selected language.
3. Send a message. When the panel is enabled, the extension injects a prompt asking the AI to append a `myst` block. The panel displays parsed data when a valid block is available; output depends on the AI.
4. Open **Extension Settings** to adjust **Panel Position**, **Language**, **Progress Bar Colors**, or **Custom CSS**, then confirm the dialog. Use **Save as New Preset** and **Switch Preset** to manage presets; with a preset selected, **Save** overwrites it and **Delete Preset** removes it. Use **Export All Settings**, **Import All Settings**, and **Save to Character** for backup and sharing.

> [!NOTE]
> Importing a backup or switching presets can overwrite current fields, prompts and styles. Character-card data excludes interface preferences such as panel position and debug mode.

## Development

The extension uses JavaScript ES modules and CSS directly; no build step or package installation is required.

Report problems in [Issues](https://github.com/iiimabbie/ST-StatusTracking/issues).
