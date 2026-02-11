import pdfplumber
import re
import json

# 開啟 PDF
with pdfplumber.open('elementary_1200.pdf') as pdf:
    all_text = ""
    for page in pdf.pages:
        all_text += page.extract_text() + "\n"

# 儲存原始文字以供檢查
with open('pdf_content.txt', 'w', encoding='utf-8') as f:
    f.write(all_text)

print("PDF 內容已提取到 pdf_content.txt")
print(f"總字數: {len(all_text)}")
print("\n前 1000 字元預覽：")
print(all_text[:1000])
