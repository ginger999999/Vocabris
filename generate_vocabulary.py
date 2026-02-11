import csv
import json

def csv_to_json(csv_file):
    """讀取 CSV 並轉換為單字列表"""
    words = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            words.append({
                'word': row['word'],
                'meaning': row['meaning'],
                'options': [row['option1'], row['option2'], row['option3']],
                'Ginger': row.get('Ginger', '0'),
                'River': row.get('River', '0'),
                'Sigma': row.get('Sigma', '0')
            })
    return words

# 讀取三個等級的單字
elementary = csv_to_json('elementary_words.csv')
intermediate = csv_to_json('intermediate_words.csv')
advanced = csv_to_json('advanced_words.csv')

# 組合成完整的資料庫
vocabulary_db = {
    'elementary': elementary,
    'intermediate': intermediate,
    'advanced': advanced
}

# 寫入 JSON 檔案
with open('vocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(vocabulary_db, f, ensure_ascii=False, indent=2)

print(f"✓ 成功生成 vocabulary.json")
print(f"  - 初級: {len(elementary)} 個單字")
print(f"  - 中級: {len(intermediate)} 個單字")
print(f"  - 高級: {len(advanced)} 個單字")
print(f"  - 總計: {len(elementary) + len(intermediate) + len(advanced)} 個單字")
