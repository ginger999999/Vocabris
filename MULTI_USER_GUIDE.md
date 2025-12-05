# 多帳號學習進度系統說明

## 功能概述

遊戲現在支援三個獨立的帳號：
- 🌸 **Ginger**
- 🌊 **River** 
- ⚡ **Sigma**

每個帳號都有獨立的學習進度追蹤。

## 使用方式

### 1. 選擇帳號
- 啟動遊戲時，首先會看到帳號選擇畫面
- 點擊你的帳號圖示進入遊戲

### 2. 學習進度追蹤
- 每個單字的學習狀態會記錄在對應的帳號下
- 進度分為 4 個等級：
  - `0` = 未學習
  - `1` = 答對 1 次
  - `2` = 答對 2 次
  - `3` = 已精通（答對 3 次）

### 3. 切換帳號
- 在遊戲選單畫面，點擊左上角的「切換帳號」按鈕
- 可以切換到其他帳號繼續學習

## 資料儲存

### CSV 檔案格式
每個 CSV 檔案（elementary_words.csv, intermediate_words.csv, advanced_words.csv）都包含以下欄位：

```csv
word,meaning,option1,option2,option3,Ginger,River,Sigma
ABLE,有能力的,跳舞,感到驚訝的,看到,0,0,0
```

- 最後三個欄位 `Ginger`, `River`, `Sigma` 記錄各帳號的學習進度
- 數值 0-3 表示該單字的掌握程度

### 自動保存
- 學習進度會自動保存到瀏覽器的 localStorage
- 每次遊戲時會從 vocabulary.json 載入對應帳號的進度
- 進度變更會即時更新到記憶體中的資料結構

## 進階功能（可選）

### 使用 Python 後端保存到 CSV

如果想要將進度永久保存回 CSV 檔案，可以使用提供的 Python 伺服器：

```bash
python3 server.py
```

這個伺服器會：
1. 提供遊戲的 HTTP 服務（取代 `python3 -m http.server`）
2. 提供 API 端點 `/api/save-progress` 來更新 CSV 檔案
3. 自動重新生成 vocabulary.json

## 查看學習統計

在遊戲選單的右側面板可以看到：
- **Learning**: 正在學習中的單字數量（進度 1-2）
- **Mastered**: 已精通的單字數量（進度 3）

## 重置進度

如果想要清除某個帳號的進度：
1. 在遊戲選單右側面板
2. 點擊「Reset Progress (重置進度)」按鈕
3. 確認後會清除當前帳號的所有學習記錄

## 技術細節

### 進度載入流程
1. 遊戲啟動時載入 vocabulary.json
2. 選擇帳號後，從 vocabulary.json 中讀取該帳號的所有單字進度
3. 建立 wordMastery 和 masteredWords 狀態

### 進度更新流程
1. 玩家答對題目時，更新 wordMastery 或 masteredWords
2. useEffect 偵測到變化，觸發 saveProgress
3. saveProgress 更新 WORD_DATABASE 中的用戶欄位
4. 同時備份到 localStorage

### 資料同步
- 使用 localStorage 作為主要儲存（瀏覽器端）
- vocabulary.json 作為資料來源（檔案系統）
- 可選：使用 server.py 實現雙向同步
