import re
import csv
import random

# 讀取 PDF 文字內容
with open('pdf_content.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 解析單字：匹配 "編號 英文單字 中文" 格式
# 例如: "1 adult 成人"
pattern = r'\d+\s+([a-zA-Z-]+)\s+([\u4e00-\u9fff、，.·/()（）]+)'
matches = re.findall(pattern, content)

# 收集所有單字
words_dict = {}
for word, meaning in matches:
    word = word.upper().replace('-', '')  # 移除連字符，統一大寫
    # 清理中文意思，取第一個主要意思
    meaning = meaning.split('、')[0].split('，')[0].strip()
    
    # 只保留長度適合遊戲的單字 (3-10 字母)
    if 3 <= len(word) <= 10 and word not in words_dict:
        words_dict[word] = meaning

print(f"共找到 {len(words_dict)} 個適合的單字")

# 為每個單字生成錯誤選項
csv_data = []
all_meanings = list(words_dict.values())

for word, correct_meaning in words_dict.items():
    # 隨機選擇 3 個不同的錯誤答案
    wrong_options = [m for m in all_meanings if m != correct_meaning]
    if len(wrong_options) >= 3:
        selected_wrong = random.sample(wrong_options, 3)
        csv_data.append({
            'word': word,
            'meaning': correct_meaning,
            'option1': selected_wrong[0],
            'option2': selected_wrong[1],
            'option3': selected_wrong[2]
        })

# 按單字字母順序排序
csv_data.sort(key=lambda x: x['word'])

# 寫入 CSV
with open('elementary_words.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['word', 'meaning', 'option1', 'option2', 'option3'])
    writer.writeheader()
    writer.writerows(csv_data)

print(f"✓ 已生成 elementary_words.csv，共 {len(csv_data)} 個單字")
print(f"\n前 10 個單字預覽：")
for i, item in enumerate(csv_data[:10], 1):
    print(f"{i}. {item['word']} - {item['meaning']}")
