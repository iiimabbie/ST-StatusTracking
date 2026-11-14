[英文](README.md) | [繁體中文](README.zh-TW.md) | [簡體中文](README.zh-CN.md)

# Status Tracking

[![版本](https://img.shields.io/github/v/tag/iiimabbie/ST-StatusTracking?label=version)](https://github.com/iiimabbie/ST-StatusTracking/tags)
[![授權：AFPL](https://img.shields.io/badge/license-AFPL-blue)](LICENSE)

這是 SillyTavern 擴充功能，會要求 AI 在回覆中提供狀態資訊，並顯示於可收合的側邊面板。擴充功能會讀取 `myst` 程式碼區塊中的 YAML，並在顯示訊息時隱藏這些區塊。

## 功能

- 追蹤時間、地點、天氣、新鮮事與備忘錄；可分別啟用固定欄位並編輯其提示詞。
- 新增、編輯、啟用、刪除文字或數字欄位，並拖曳排序。數字欄位使用漸層進度條，顏色可自訂。
- 從最新的 AI 訊息往前搜尋，顯示最近找到的有效狀態，並讀取目前選取的回覆版本。
- 選擇面板位置與介面語言、自訂 CSS、管理配置、匯入及匯出設定，並將欄位、提示詞與樣式儲存到角色卡。

## 安裝

1. 在 SillyTavern 開啟「擴充功能」，選擇「安裝擴充功能」。
2. 輸入 `https://github.com/iiimabbie/ST-StatusTracking` 並安裝。
3. 重新載入 SillyTavern。

## 使用方式

1. 在擴充功能設定中開啟「啟用狀態面板」。首次安裝時，介面及預設提示詞會跟隨 SillyTavern 的語言：繁體中文、簡體中文，其他語言則使用英文。可在面板的「擴充設定」→「語言」變更語言；切換語言會保留現有的自訂提示詞與欄位。
2. 開啟「欄位設定」。使用「固定欄位設定」選擇固定欄位並編輯提示詞，或在「自訂欄位設定」新增欄位。確認對話框以儲存變更；「恢復預設」會使用目前語言的預設值。
3. 傳送訊息。面板啟用時，擴充功能會注入提示詞，要求 AI 在回覆末尾加入 `myst` 區塊。找到有效區塊時，面板會顯示解析出的資料；輸出取決於 AI。
4. 開啟「擴充設定」調整「側邊欄位置」、「語言」、「進度條顏色」或「自訂 CSS」，並確認對話框。使用「儲存為新配置」與「切換配置」管理配置；選取配置後，可用「儲存」覆寫或「刪除配置」刪除。也可使用「匯出所有設定」、「匯入所有設定」及「儲存到角色卡」備份與分享。

> [!NOTE]
> 匯入備份或切換配置可能覆蓋目前的欄位、提示詞與樣式。角色卡資料不包含面板位置、除錯模式等介面偏好設定。

## 開發

擴充功能直接使用 JavaScript ES 模組與 CSS，不需要建置或安裝套件。

請至 [Issues](https://github.com/iiimabbie/ST-StatusTracking/issues) 回報問題。本專案採用 [Aladdin Free Public License（AFPL）](LICENSE)。
