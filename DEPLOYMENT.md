# Vocabris 部署指南

## 部署到 Render.com（推薦）

Render.com 支援完整的 Python 後端功能，包括檔案寫入。

### 步驟：

1. **註冊 Render.com**
   - 前往 https://render.com
   - 使用 GitHub 帳號登入

2. **建立新的 Web Service**
   - 點擊 "New +" → "Web Service"
   - 連接你的 GitHub 倉庫：`ginger999999/Vocabris`
   - 選擇分支：`B_單字表獨立檔案`

3. **配置設定**
   - Name: `vocabris`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python3 server.py`
   - Plan: `Free`

4. **新增 Persistent Disk（重要！）**
   - 在設定中找到 "Disks"
   - 點擊 "Add Disk"
   - Name: `vocabris-data`
   - Mount Path: `/opt/render/project/src`
   - Size: `1 GB`
   
   ⚠️ 這一步很重要，讓 CSV 檔案修改可以被保存

5. **部署**
   - 點擊 "Create Web Service"
   - 等待部署完成（約 2-3 分鐘）

6. **訪問你的應用**
   - 部署完成後會得到一個網址，例如：
   - `https://vocabris.onrender.com`

### 功能支援

✅ **完整支援的功能：**
- 單字管理（編輯、新增、刪除）
- CSV 檔案切換
- 自建資料（import.html）
   - 匯入格式：`.json`、`.txt`、`.csv`（不支援 `.js`）
- 學習進度保存
- 所有後端 API

### 注意事項

- 免費方案在閒置 15 分鐘後會休眠，首次訪問需要等待 30 秒啟動
- Persistent Disk 確保你的資料不會在重新部署時遺失
- 如需更快的響應速度，可升級到付費方案（$7/月）

---

## 其他部署選項

### Railway.app
類似 Render，支援 Python 後端
- 免費額度 $5/月
- 不休眠（付費後）
- 設定更簡單

### Fly.io
更接近傳統 VPS
- 免費方案包含 3 個應用
- 完整的檔案系統支援
- 需要安裝 CLI 工具

### PythonAnywhere
專為 Python 設計
- 免費方案功能受限
- 適合簡單應用

---

## Vercel 限制說明

Vercel 只支援靜態網站和 Serverless Functions：
- ❌ 無法執行 Python server.py
- ❌ 無法寫入檔案（CSV 修改）
- ✅ 只能顯示和遊玩（使用現有的 vocabulary.json）

如果只需要遊戲功能，Vercel 是最快的選擇。
如果需要完整的管理功能，請使用 Render 或其他支援後端的平台。
