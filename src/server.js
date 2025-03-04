const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// const dbPath = path.join(__dirname, 'db', 'users.db');
// const db = new sqlite3.Database(dbPath);

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
    return new sqlite3.Database(path.join(__dirname, 'db', 'users.db'), (err) => {
        if (err) {
            console.error('Ошибка подключения к базе данных:', err.message);
        }
    });
}

// Функция для получения пользователя из БД по user_id
function getUser(user_id, callback) {
    const db = getDBConnection();
    db.get("SELECT clicked_start FROM users WHERE user_id = ?", [user_id], (err, row) => {
        db.close();
        callback(err, row);
    });
}

// Обновляем функцию создания пользователя
function createUser(user_id, telegramData, callback) {
    const db = getDBConnection();
    db.run(
        "INSERT INTO users (user_id, clicked_start, telegram_username, telegram_first_name, telegram_last_name) VALUES (?, ?, ?, ?, ?)",
        [user_id, 0, telegramData.username, telegramData.first_name, telegramData.last_name],
        function(err) {
            db.close();
            callback(err);
        }
    );
}

// Функция для обновления статуса пользователя (устанавливаем clicked_start в true (1))
function updateUser(user_id, callback) {
    const db = getDBConnection();
    db.run("UPDATE users SET clicked_start = ? WHERE user_id = ?", [1, user_id], function(err) {
        db.close();
        callback(err);
    });
}

// Основная страница
app.get('/', (req, res) => {
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

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});