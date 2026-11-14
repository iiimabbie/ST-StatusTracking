<div align="center">

[English](README.md) · [繁體中文](README.zh-TW.md) · [简体中文](README.zh-CN.md)

# Status Tracking

**SillyTavern 角色扮演的状态侧边面板**

这是一个 SillyTavern 扩展，会要求 AI 在回复中提供状态信息，并显示在可折叠的侧边面板中。扩展读取 `myst` 代码块中的 YAML，并在显示消息时隐藏这些代码块。

![Version](https://img.shields.io/github/manifest-json/v/iiimabbie/ST-StatusTracking?label=version&color=8a5cf6)
![SillyTavern](https://img.shields.io/badge/SillyTavern-extension-e8a87c)
![i18n](https://img.shields.io/badge/i18n-繁中%20·%20简中%20·%20EN-2ea44f)
![License](https://img.shields.io/badge/license-AFPL-blue)

[功能](#功能) · [安装](#安装) · [使用方法](#使用方法) · [开发](#开发)

</div>

## 功能

- 追踪时间、地点、天气、新鲜事和备忘录；可分别启用固定字段并编辑其提示词。
- 添加、编辑、启用、删除文本或数字字段，并拖动排序。数字字段使用渐变进度条，颜色可以自定义。
- 从最新的 AI 消息向前搜索，显示最近找到的有效状态，并读取当前选中的回复版本。
- 选择面板位置和界面语言、自定义 CSS、管理配置、导入及导出设置，并将字段、提示词和样式保存到角色卡。

## 安装

1. 在 SillyTavern 打开「扩展程序」，选择「安装扩展程序」。
2. 输入 `https://github.com/iiimabbie/ST-StatusTracking` 并安装。
3. 重新加载 SillyTavern。

## 使用方法

1. 在扩展程序设置中打开「启用状态面板」。首次安装时，界面和默认提示词会跟随 SillyTavern 的语言：繁体中文、简体中文，其他语言则使用英文。可在面板的「扩展设置」→「语言」中更改语言；切换语言会保留现有的自定义提示词和字段。
2. 打开「字段设置」。使用「固定字段设置」选择固定字段并编辑提示词，或在「自定义字段设置」添加字段。确认对话框以保存更改；「恢复默认」会使用当前语言的默认值。
3. 发送消息。面板启用时，扩展会注入提示词，要求 AI 在回复末尾加入 `myst` 代码块。找到有效代码块时，面板会显示解析出的数据；输出取决于 AI。
4. 打开「扩展设置」调整「侧边栏位置」、「语言」、「进度条颜色」或「自定义 CSS」，并确认对话框。使用「保存为新配置」和「切换配置」管理配置；选中配置后，可用「保存」覆盖或「删除配置」删除。也可使用「导出所有设置」、「导入所有设置」及「保存到角色卡」备份与分享。

> [!NOTE]
> 导入备份或切换配置可能覆盖当前的字段、提示词和样式。角色卡数据不包含面板位置、调试模式等界面偏好设置。

## 开发

扩展直接使用 JavaScript ES 模块与 CSS，无需构建或安装依赖。

请到 [Issues](https://github.com/iiimabbie/ST-StatusTracking/issues) 反馈问题。
