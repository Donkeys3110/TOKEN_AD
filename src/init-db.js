const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'users.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE,
        clicked_start BOOLEAN DEFAULT FALSE,
        telegram_username TEXT,
        telegram_first_name TEXT,
        telegram_last_name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wallets (
        address TEXT PRIMARY KEY,
        user_id TEXT,
        balance REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id)
    )`);
});

db.close();