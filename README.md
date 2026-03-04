# Vocabris

Vocabris 是一個英文單字學習遊戲，支援多帳號進度、CSV 單字庫管理與自訂單字匯入。

## 本機啟動

1. 安裝相依套件
	- `pip install -r requirements.txt`
2. 啟動伺服器
	- `python3 server.py`
3. 開啟瀏覽器
	- `http://localhost:8000/index.html`

## 匯入單字（import.html）

### 支援格式

- `.json`
- `.txt`
- `.csv`

不支援 `.js`。

### 操作步驟

1. 開啟 `http://localhost:8000/import.html`
2. 輸入新 CSV 檔案名稱（會自動帶入上傳檔名，可自行修改）
3. 選擇難度級別（Elementary / Intermediate / Advanced）
4. 上傳檔案後先按「預覽」確認資料
5. 按「生成 CSV 檔案」完成匯入

### 匯入後效果

- 伺服器會建立新的 CSV 檔案
- 系統會自動重建 `vocabulary.json`
- 回到主頁後可在單字管理中看到新資料

## 注意事項

- 若檔名已存在，會被覆蓋。
- 若看到舊版畫面，請使用瀏覽器強制重整（Ctrl+Shift+R）。