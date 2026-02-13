import csv
import json
import os

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

# 讀取配置文件
config_file = 'csv_config.json'
if os.path.exists(config_file):
    with open(config_file, 'r', encoding='utf-8') as f:
        config = json.load(f)
    print(f"✓ 使用配置文件: {config_file}")
else:
    # 默認配置
    config = {
        'elementary': 'elementary_words.csv',
        'intermediate': 'intermediate_words.csv',
        'advanced': 'advanced_words.csv'
    }
    print(f"✓ 使用默認配置")

# 讀取三個等級的單字（根據配置）
elementary = csv_to_json(config['elementary'])
intermediate = csv_to_json(config['intermediate'])
advanced = csv_to_json(config['advanced'])

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
print(f"  - 初級 ({config['elementary']}): {len(elementary)} 個單字")
print(f"  - 中級 ({config['intermediate']}): {len(intermediate)} 個單字")
print(f"  - 高級 ({config['advanced']}): {len(advanced)} 個單字")
print(f"  - 總計: {len(elementary) + len(intermediate) + len(advanced)} 個單字")
