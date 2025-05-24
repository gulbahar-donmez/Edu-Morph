import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

import sqlite3

db_path = os.path.join(current_dir, 'edu.db')

conn = sqlite3.connect(db_path)

cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS kullanicilar (
        id INTEGER PRIMARY KEY,
        ad TEXT,
        soyad TEXT,
        email TEXT
    )
''')

conn.commit()

conn.close()

print(f"Veritabanı başarıyla oluşturuldu! Dosya yolu: {db_path}") 