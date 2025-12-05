#!/usr/bin/env python3
"""
簡單的 API 伺服器，用於保存學習進度到 CSV 檔案
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import csv
import os
from urllib.parse import urlparse, parse_qs

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
            
            # 更新 CSV 檔案
            csv_file = f'{level}_words.csv'
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
                os.system('python3 generate_vocabulary.py > /dev/null 2>&1')
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"success": true}')
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    PORT = 8000
    print(f'Starting Vocabris server on port {PORT}...')
    print(f'Open http://localhost:{PORT}/index.html')
    
    server = HTTPServer(('0.0.0.0', PORT), VocabrisHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
