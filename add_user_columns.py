import csv

# 要處理的檔案
files = ['elementary_words.csv', 'intermediate_words.csv', 'advanced_words.csv']

for filename in files:
    # 讀取現有資料
    rows = []
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 添加三個帳號的學習狀態欄位（0=未學習, 1-3=學習進度）
            row['Ginger'] = '0'
            row['River'] = '0'
            row['Sigma'] = '0'
            rows.append(row)
    
    # 寫回檔案
    fieldnames = ['word', 'meaning', 'option1', 'option2', 'option3', 'Ginger', 'River', 'Sigma']
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"✓ {filename} 已更新，添加 Ginger, River, Sigma 欄位")

print("\n完成！所有 CSV 檔案已添加學習狀態欄位。")
