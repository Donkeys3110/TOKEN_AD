import sqlite3
import os

# Получаем абсолютный путь к директории скрипта
current_dir = os.path.dirname(os.path.abspath(__file__))
db_dir = os.path.join(current_dir, 'db')

# Создаем директорию db, если она не существует
os.makedirs(db_dir, exist_ok=True)

# Подключаемся к базе данных, используя абсолютный путь
db_path = os.path.join(db_dir, 'users.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    clicked_start BOOLEAN DEFAULT FALSE
)''')

# Добавляем таблицу wallets
cursor.execute('''CREATE TABLE IF NOT EXISTS wallets (
    address TEXT PRIMARY KEY,
    user_id TEXT,
    balance REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
)''')

conn.commit()
conn.close()