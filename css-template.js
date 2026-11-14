export const cssTemplate = `/* ========================================
   Status Tracking 自訂樣式模板
   ======================================== */

/* -------------------- 1. 主面板容器 -------------------- */
/* 整個狀態面板的最外層容器 */
.status-panel {
  /* 背景、邊框、圓角、陰影等 */
}

/* 當面板位於左側時 */
.status-panel.left {

}

/* 當面板位於右側時 */
.status-panel.right {

}

/* 當面板處於收合狀態時 */
.status-panel.collapsed {

}


/* -------------------- 2. 收合按鈕 -------------------- */
/* 面板收合/展開的切換按鈕 */
.collapse-toggle {

}

/* 收合按鈕內的圖示 */
.collapse-toggle i {

}


/* -------------------- 3. 面板內容區 -------------------- */
/* 包含所有內容的主區域（收合時會隱藏） */
.panel-content {

}


/* -------------------- 4. 標題區塊 -------------------- */
/* 面板頂部的標題區域 */
.panel-header {

}

/* 標題文字 */
.panel-header h3 {

}


/* -------------------- 5. 固定資訊區塊 -------------------- */
/* 包含時間、地點、天氣、新鮮事的區域 */
.fixed-info-section {

}

/* 資訊項目容器（時間/地點/天氣） */
.info-item {

}

/* 資訊項目內的每個 div */
.info-item > div {

}

/* 資訊圖示（📅📍🌤️） */
.info-icon {

}

/* 資訊文字 */
.info-text {

}


/* -------------------- 6. 新鮮事區塊 -------------------- */
/* 新鮮事區塊外層容器 */
.news-section {

}

/* 新鮮事區塊內層容器 */
.news-section2 {

}

/* 新鮮事標題【新鮮事】 */
.news-header {

}

/* 新鮮事內容容器（包含分隔線、標題、內文） */
.news-no-header {

}

/* 新鮮事分隔線 */
.news-divider {

}

/* 新鮮事標題文字 */
.news-title {

}

/* 新鮮事內文 */
.news-content {

}


/* -------------------- 7. 自訂欄位區塊 -------------------- */
/* 用戶自訂欄位的容器 */
.custom-fields-section {

}

/* 狀態清單容器 */
.status-list {

}

/* 單個狀態項目 */
.status-item {

}

/* 狀態名稱（欄位標題） */
.status-name {

}

/* 狀態值容器 */
.status-value {

}

/* 文字類型的狀態值 */
.value-text {

}


/* -------------------- 8. 進度條（數字類型欄位） -------------------- */
/* 進度條外層容器 */
.progress-bar-container {
  /* 注意：此元素使用 CSS 變數控制顏色
     --progress-low-color: 低值顏色
     --progress-high-color: 高值顏色 */
}

/* 進度條填充部分 */
.progress-bar-fill {

}

/* 進度條上的數字文字 */
.progress-text {

}


/* -------------------- 9. 空狀態提示 -------------------- */
/* 當沒有設定任何欄位時顯示的提示文字 */
.empty-hint {

}


/* -------------------- 10. 按鈕區 -------------------- */
/* 底部按鈕區域容器 */
.panel-actions {

}

/* 按鈕樣式（繼承自 ST 的 .menu_button） */
.panel-actions .menu_button {

}

/* 按鈕內的圖示 */
.panel-actions .menu_button i {

}


/* ========================================
   使用說明
   ======================================== */
/*
1. 複製需要修改的區塊到下方
2. 在大括號 {} 內添加你的 CSS 樣式
3. 使用 !important 確保樣式優先級
4. 點擊彈窗下方的「確定」按鈕套用

範例：
.status-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-radius: 16px !important;
}

.status-name {
  color: #ffd700 !important;
  font-weight: bold !important;
}
*/
`;
