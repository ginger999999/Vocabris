#!/usr/bin/env python3
"""
簡單的 API 伺服器，用於保存學習進度到 CSV 檔案
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import csv
import os
import subprocess
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CONFIG = {
    'elementary': 'elementary_words.csv',
    'intermediate': 'intermediate_words.csv',
    'advanced': 'advanced_words.csv'
}


def project_path(*parts):
    return os.path.join(BASE_DIR, *parts)


def load_csv_config():
    config_file = project_path('csv_config.json')
    if os.path.exists(config_file):
        with open(config_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return dict(DEFAULT_CONFIG)


def save_csv_config(config):
    config_file = project_path('csv_config.json')
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)


def regenerate_vocabulary():
    result = subprocess.run(
        ['python3', project_path('generate_vocabulary.py')],
        cwd=BASE_DIR,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        raise RuntimeError((result.stderr or result.stdout or 'generate_vocabulary.py failed').strip())

class VocabrisHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/save-progress':
            # 讀取請求內容
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user = data.get('user')
            level = data.get('level')
            progress_data = data.get('progress', {})  # {word: progress_value}
            
            if not user or not level:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Missing user or level"}')
                return
            
            # 讀取配置後決定目前級別實際使用的 CSV
            config = load_csv_config()

            csv_filename = config.get(level)
            if not csv_filename:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Invalid level"}')
                return

            csv_file = project_path(csv_filename)

            if not os.path.exists(csv_file):
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "CSV file not found"}')
                return
            
            try:
                # 讀取 CSV
                rows = []
                with open(csv_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    fieldnames = reader.fieldnames
                    for row in reader:
                        word = row['word']
                        if word in progress_data:
                            row[user] = str(progress_data[word])
                        rows.append(row)
                
                # 寫回 CSV
                with open(csv_file, 'w', encoding='utf-8', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(rows)
                
                # 重新生成 vocabulary.json
                regenerate_vocabulary()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"success": true}')
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        elif self.path == '/api/update-csv':
            # 處理 PDF 上傳後的 CSV 更新
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            filename = data.get('filename')
            csv_data = data.get('data')
            
            if not filename or not csv_data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Missing filename or data"}')
                return
            
            try:
                # 備份原檔案
                file_path = project_path(filename)
                if os.path.exists(file_path):
                    backup_file = file_path.replace('.csv', '_backup.csv')
                    import shutil
                    shutil.copy(file_path, backup_file)
                    print(f'Created backup: {os.path.basename(backup_file)}')
                
                # 寫入新的 CSV 內容
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(csv_data)
                
                # 重新生成 vocabulary.json
                print('Regenerating vocabulary.json...')
                regenerate_vocabulary()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Successfully updated {filename}"
                }).encode())
                
            except Exception as e:
                print(f'Error updating CSV: {e}')
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        elif self.path == '/api/create-csv':
            # 處理創建新 CSV 檔案
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            filename = data.get('filename')
            level = data.get('level')
            csv_data = data.get('data')
            
            if not filename or not csv_data or not level:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Missing filename, level or data"}')
                return
            
            try:
                # 寫入新的 CSV 檔案
                file_path = project_path(filename)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(csv_data)
                
                print(f'Created new CSV file: {filename} for level: {level}')
                
                # 重新生成 vocabulary.json
                print('Regenerating vocabulary.json...')
                regenerate_vocabulary()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Successfully created {filename}"
                }).encode())
                
            except Exception as e:
                print(f'Error creating CSV: {e}')
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        elif self.path == '/api/switch-csv':
            # 切換 CSV 資料源（不覆蓋，使用配置記錄）
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            source_file = data.get('source')  # 來源檔案，如 v1200.csv
            target_level = data.get('level')  # 目標級別，如 elementary
            
            if not source_file or not target_level:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Missing source or level"}')
                return
            
            try:
                # 讀取或創建配置文件
                config = load_csv_config()
                
                # 更新配置
                config[target_level] = source_file
                
                # 儲存配置
                save_csv_config(config)
                
                print(f'Switched {target_level} to use {source_file}')
                
                # 重新生成 vocabulary.json（使用新配置）
                print('Regenerating vocabulary.json...')
                regenerate_vocabulary()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Switched {target_level} to use {source_file}"
                }).encode())
                
            except Exception as e:
                print(f'Error switching CSV: {e}')
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        elif self.path == '/api/update-words':
            # 更新整個級別的單字資料回 CSV
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            level = data.get('level')  # elementary, intermediate, advanced
            words = data.get('words')  # 單字陣列
            
            if not level or not words:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Missing level or words"}')
                return
            
            try:
                # 讀取配置以確定要寫入哪個 CSV 檔案
                config = load_csv_config()
                
                csv_filename = config.get(level)
                if not csv_filename:
                    raise ValueError(f'Invalid level: {level}')

                csv_file = project_path(csv_filename)
                
                # 讀取原始 CSV 以保留使用者進度欄位
                user_columns = []
                existing_data = {}
                if os.path.exists(csv_file):
                    with open(csv_file, 'r', encoding='utf-8') as f:
                        reader = csv.DictReader(f)
                        # 找出使用者欄位（不是 word, meaning, option1-3 的欄位）
                        all_fields = reader.fieldnames
                        base_fields = ['word', 'meaning', 'option1', 'option2', 'option3']
                        user_columns = [f for f in all_fields if f not in base_fields]
                        
                        # 保存原有的使用者進度資料
                        for row in reader:
                            word = row['word']
                            existing_data[word] = {col: row.get(col, '0') for col in user_columns}
                
                # 寫入新的 CSV
                fieldnames = ['word', 'meaning', 'option1', 'option2', 'option3'] + user_columns
                with open(csv_file, 'w', encoding='utf-8', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    
                    for word_obj in words:
                        row = {
                            'word': word_obj['word'],
                            'meaning': word_obj['meaning'],
                            'option1': word_obj['options'][0] if len(word_obj['options']) > 0 else '',
                            'option2': word_obj['options'][1] if len(word_obj['options']) > 1 else '',
                            'option3': word_obj['options'][2] if len(word_obj['options']) > 2 else ''
                        }
                        # 保留原有的使用者進度
                        if word_obj['word'] in existing_data:
                            row.update(existing_data[word_obj['word']])
                        else:
                            # 新單字，所有使用者欄位設為 0
                            for col in user_columns:
                                row[col] = '0'
                        
                        writer.writerow(row)
                
                print(f'Updated {csv_file} with {len(words)} words')
                
                # 重新生成 vocabulary.json
                print('Regenerating vocabulary.json...')
                regenerate_vocabulary()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Successfully updated {csv_file}"
                }).encode())
                
            except Exception as e:
                print(f'Error updating words: {e}')
                import traceback
                traceback.print_exc()
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())

        elif self.path == '/api/delete-csv':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            filename = data.get('filename', '')
            filename = os.path.basename(filename)

            if not filename or not filename.endswith('.csv'):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Invalid filename"}')
                return

            if filename != data.get('filename', ''):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"error": "Invalid path"}')
                return

            config = load_csv_config()

            in_use_files = set(config.values())
            if filename in in_use_files:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"File is currently in use: {filename}"}).encode())
                return

            file_path = project_path(filename)
            if not os.path.exists(file_path):
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "File not found"}')
                return

            try:
                os.remove(file_path)
                print(f'Deleted CSV file: {filename}')

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "message": f"Deleted {filename}"
                }).encode())
            except Exception as e:
                print(f'Error deleting CSV: {e}')
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        if self.path == '/api/list-csv':
            # 列出所有 CSV 檔案
            try:
                csv_files = [
                    f for f in os.listdir(BASE_DIR)
                    if f.endswith('.csv') and not f.endswith('_backup.csv')
                ]
                # 排序：_words.csv 檔案優先
                csv_files.sort(key=lambda x: (not x.endswith('_words.csv'), x))
                result = {
                    'files': csv_files,
                    'count': len(csv_files)
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())

        elif self.path.startswith('/api/get-level-words'):
            try:
                parsed = urlparse(self.path)
                params = parse_qs(parsed.query)
                level = (params.get('level') or ['elementary'])[0]

                if level not in ['elementary', 'intermediate', 'advanced']:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'{"error": "Invalid level"}')
                    return

                config = load_csv_config()

                csv_filename = config.get(level)
                csv_file = project_path(csv_filename) if csv_filename else ''
                if not csv_filename or not os.path.exists(csv_file):
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b'{"error": "CSV file not found"}')
                    return

                words = []
                with open(csv_file, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        words.append({
                            'word': row.get('word', ''),
                            'meaning': row.get('meaning', ''),
                            'option1': row.get('option1', ''),
                            'option2': row.get('option2', ''),
                            'option3': row.get('option3', ''),
                            'Ginger': row.get('Ginger', '0'),
                            'River': row.get('River', '0'),
                            'Sigma': row.get('Sigma', '0')
                        })

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'level': level,
                    'source': csv_filename,
                    'count': len(words),
                    'words': words
                }, ensure_ascii=False).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        elif self.path == '/api/get-csv-config':
            # 獲取當前 CSV 配置
            try:
                config = load_csv_config()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(config).encode())
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        
        else:
            # 其他 GET 請求用標準處理
            super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        # Prevent caching for frequently updated app files.
        no_cache_targets = ('vocabulary.json', 'index.html', 'service-worker.js', 'manifest.json')
        if self.path and any(target in self.path for target in no_cache_targets):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 8000))
    print(f'Starting Vocabris server on port {PORT}...')
    print(f'Open http://localhost:{PORT}/index.html')
    
    server = HTTPServer(('0.0.0.0', PORT), VocabrisHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
