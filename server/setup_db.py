import sqlite3

conn = sqlite3.connect('users.db')
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