const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
const port = 3000;

// Создаем папку для базы данных
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Настройка middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/static')));

// Настройка для работы с HTML файлами
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client/templates'));

// Обновляем схему базы данных для хранения данных пользователя Telegram
function getDBConnection() {
    const dbPath = path.join(__dirname, 'db', 'users.db');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Ошибка подключения к БД:', err.message);
                reject(err);
            }
            resolve(db);
        });
    });
}

// Инициализация базы данных
async function initDB() {
    try {
        const db = await getDBConnection();
        await db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT UNIQUE,
            clicked_start BOOLEAN DEFAULT FALSE,
            telegram_username TEXT,
            telegram_first_name TEXT,
            telegram_last_name TEXT
        )`);
        
        await db.run(`CREATE TABLE IF NOT EXISTS wallets (
            address TEXT PRIMARY KEY,
            user_id TEXT,
            balance REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        )`);
        
        console.log('База данных инициализирована');
        db.close();
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        process.exit(1);
    }
}

// Основная страница
app.get('/', async (req, res) => {
    try {
        const db = await getDBConnection();
        let user_id = req.cookies.user_id;
        // Получаем данные из Telegram WebApp
        const telegramInitData = req.query.tgInitData;
        let telegramUser;
        
        try {
            if (telegramInitData) {
                const decoded = decodeURIComponent(telegramInitData);
                const webAppData = new URLSearchParams(decoded);
                telegramUser = JSON.parse(webAppData.get('user'));
            }
        } catch (error) {
            console.error('Ошибка парсинга данных Telegram:', error);
        }

        if (!user_id) {
            // Если cookie отсутствует, создаём нового пользователя и перенаправляем на /landing
            user_id = uuidv4();
            createUser(user_id, telegramUser || {}, (err) => {
                if (err) return res.status(500).send("Ошибка базы данных");
                res.cookie('user_id', user_id);
                res.redirect('/landing');
            });
        } else {
            getUser(user_id, (err, user) => {
                if (err) return res.status(500).send("Ошибка базы данных");
                if (user && !user.clicked_start) {
                    return res.redirect('/landing');
                }
                // Передаем данные пользователя в шаблон
                res.render('index', { telegramUser: telegramUser || {} });  // Шаблон index.ejs в папке templates
            });
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).send("Ошибка базы данных");
    }
});

// Роут для /news
app.get('/news', (req, res) => {
    res.render('news');  // Шаблон news.ejs
});

// Роут для /wallet
app.get('/wallet', (req, res) => {
    res.render('wallet');  // Шаблон wallet.ejs
});

// Страница "Старт" с кнопкой /landing (GET и POST)
app.route('/landing')
    .get((req, res) => {
        res.render('landing');  // Шаблон landing.ejs
    })
    .post((req, res) => {
        const user_id = req.cookies.user_id;
        if (user_id) {
            updateUser(user_id, (err) => {
                if (err) return res.status(500).send("Ошибка базы данных");
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    });

// Обработчик подключения кошелька
app.post('/api/wallet/connect', express.json(), async (req, res) => {
    const { address, balance } = req.body;
    const user_id = req.cookies.user_id;

    try {
        const db = getDBConnection();
        // Сохраняем или обновляем информацию о кошельке
        await new Promise((resolve, reject) => {
            db.run(
                "INSERT OR REPLACE INTO wallets (address, user_id, balance) VALUES (?, ?, ?)",
                [address, user_id, balance],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка сохранения данных кошелька:', error);
        res.status(500).json({ error: 'Ошибка сохранения данных' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

(async () => {
    try {
        await initDB();
        app.listen(port, () => {
            console.log(`Сервер запущен на http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Ошибка запуска сервера:', error);
        process.exit(1);
    }
})();