# 單字管理說明

## 檔案結構

遊戲使用三個 CSV 檔案來管理不同等級的英文單字：

- `elementary_words.csv` - 初級單字（**1903個單字**，來自教育部國小1200主題式單字）
- `intermediate_words.csv` - 中級單字（適合國中程度）
- `advanced_words.csv` - 高級單字（適合高中以上程度）

## 單字來源

### 初級單字
初級單字已從教育部規定必背1200主題式單字PDF匯入，經過處理後包含：
- 來源：http://myhome.msps.tp.edu.tw/happy/10106/files/國小1200主題式單字.pdf
- 共 1903 個適合遊戲的單字（3-10字母長度）
- 涵蓋人物、外貌、身體、健康、數字、家庭等主題

## CSV 檔案格式

每個 CSV 檔案都使用以下格式：

```csv
word,meaning,option1,option2,option3
APPLE,蘋果,香蕉,橘子,西瓜
BOOK,書,本子,紙,筆
```

欄位說明：
- `word`: 英文單字（大寫）
- `meaning`: 中文意思（正確答案）
- `option1`, `option2`, `option3`: 三個錯誤的選項

## 如何新增或修改單字

### 方法 1: 使用 Excel 編輯

1. 用 Excel 或 Google Sheets 開啟 CSV 檔案
2. 編輯單字、意思和選項
3. 儲存為 CSV 格式（UTF-8 編碼）

### 方法 2: 使用文字編輯器

1. 用記事本或 VS Code 開啟 CSV 檔案
2. 按照格式新增一行：
   ```
   WORD,意思,錯誤選項1,錯誤選項2,錯誤選項3
   ```
3. 儲存檔案

## 更新遊戲單字庫

編輯完 CSV 檔案後，執行以下命令來生成新的單字庫：

```bash
python3 generate_vocabulary.py
```

這個腳本會：
1. 讀取三個 CSV 檔案
2. 轉換為 JSON 格式
3. 更新 `vocabulary.json`
4. 顯示每個等級的單字數量

## 注意事項

1. **單字長度**: 遊戲方塊最多顯示 10 個字母，建議單字不要太長
2. **編碼**: 請確保 CSV 檔案使用 UTF-8 編碼儲存，以正確顯示中文
3. **選項設計**: 錯誤選項應該與正確答案有一定的相似性，增加遊戲挑戰性
4. **重新整理**: 更新 `vocabulary.json` 後，需要重新整理瀏覽器頁面

## 範例

### 初級單字範例
```csv
word,meaning,option1,option2,option3
CAT,貓,狗,鳥,魚
DOG,狗,貓,鳥,魚
APPLE,蘋果,香蕉,橘子,西瓜
```

### 中級單字範例
```csv
word,meaning,option1,option2,option3
LIBRARY,圖書館,書店,學校,博物館
FESTIVAL,節日,假日,慶典,活動
ANCIENT,古老的,現代的,新的,舊的
```

### 高級單字範例
```csv
word,meaning,option1,option2,option3
ELOQUENT,雄辯的,口齒不清的,沉默的,笨拙的
METICULOUS,細心的,粗心的,馬虎的,隨便的
PARADIGM,典範,模式,範例,標準
```
