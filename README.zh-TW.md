[English](README.md) | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

# Status Tracking

[![版本](https://img.shields.io/github/v/tag/iiimabbie/ST-StatusTracking?label=version)](https://github.com/iiimabbie/ST-StatusTracking/tags)
[![授權：AFPL](https://img.shields.io/badge/license-AFPL-blue)](LICENSE)

這是 SillyTavern 擴充功能，會要求 AI 在回覆中提供狀態資訊，並顯示於可收合的側邊面板。擴充功能會讀取 `myst` 程式碼區塊中的 YAML，並在顯示訊息時隱藏這些區塊。

## 功能

- 追蹤時間、地點、天氣、新鮮事與備忘錄；可分別啟用固定欄位並編輯其提示詞。
- 新增、編輯、啟用、刪除文字或數字欄位，並拖曳排序。數字欄位使用漸層進度條，顏色可自訂。
- 從最新的 AI 訊息往前搜尋，顯示最近找到的有效狀態，並讀取目前選取的回覆版本。
- 選擇面板位置與介面語言、自訂 CSS、儲存及切換配置、匯出或匯入設定，並將欄位、提示詞與樣式設定儲存到角色卡。

## 安裝

1. 在 SillyTavern 開啟擴充功能，選擇安裝擴充功能。
2. 輸入 `https://github.com/iiimabbie/ST-StatusTracking` 並安裝。
3. 重新載入 SillyTavern。

## 使用方式

1. 在擴充設定中開啟「啟用狀態面板」。預設介面語言為繁體中文；如有需要，可在面板的「擴充設定」中變更「語言」。
2. 在面板中開啟「欄位設定」。使用「固定欄位設定」選擇固定欄位並編輯提示詞，或在「自訂欄位設定」新增欄位。確認對話框以儲存變更。
3. 傳送訊息。面板啟用時，擴充功能會注入提示詞，要求 AI 在回覆末尾加入 `myst` 區塊。找到有效區塊時，面板會顯示解析出的資料；輸出取決於 AI。
4. 開啟「擴充設定」調整「側邊欄位置」、「語言」、「進度條顏色」或「自訂 CSS」，並確認對話框。使用「儲存為新配置」與「切換配置」管理配置，或使用「匯出所有設定」、「匯入所有設定」及「儲存到角色卡」分享與備份。

> [!NOTE]
> 匯入備份或切換配置可能覆蓋目前的欄位、提示詞與樣式設定。角色卡資料不包含面板位置、除錯模式等介面偏好設定。

## 開發

原始碼位於 `dev`；`main` 存放建置後的擴充功能。使用 Node.js 22 與 pnpm 10 執行：

```sh
pnpm install
pnpm build
```

建置工作流程會將每次 `dev` 建置發布到 `testing`，並在提交訊息包含發布標記時發布到 `main`。

請至 [Issues](https://github.com/iiimabbie/ST-StatusTracking/issues) 回報問題。本專案採用 [Aladdin Free Public License（AFPL）](LICENSE)。
