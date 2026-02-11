import csv

# 處理 elementary_words.csv - 只保留 5 個字母以內的單字
elementary_words = []
with open('elementary_words.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if len(row['word']) <= 5:
            elementary_words.append(row)

# 寫回 elementary_words.csv
with open('elementary_words.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['word', 'meaning', 'option1', 'option2', 'option3'])
    writer.writeheader()
    writer.writerows(elementary_words)

print(f"✓ elementary_words.csv 已更新")
print(f"  保留單字數: {len(elementary_words)} 個（≤5 字母）")

# 統計 intermediate_words.csv
intermediate_count = 0
with open('intermediate_words.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    intermediate_count = sum(1 for row in reader)

print(f"\n✓ intermediate_words.csv 已創建")
print(f"  單字數: {intermediate_count} 個（所有長度）")

print(f"\n單字範例：")
print("\n初級（≤5 字母）前 10 個：")
for i, word in enumerate(elementary_words[:10], 1):
    print(f"  {i}. {word['word']} ({len(word['word'])}字母) - {word['meaning']}")
