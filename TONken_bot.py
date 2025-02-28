import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import Message
import aiosqlite

# Замените на токен вашего бота
BOT_TOKEN = "8165957380:AAHRPOKYvcUD1KfBIaCOHbAt1GphjDB9PV4"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Инициализация базы данных
async def init_db():
    async with aiosqlite.connect('users.db') as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE
            )
        ''')
        await db.commit()

# Обработчик команды /start
@dp.message(Command("start"))
async def start(message: Message):
    user = message.from_user
    
    if not user.username:
        await message.answer("Пожалуйста, установите username в настройках Telegram.")
        return
    
    async with aiosqlite.connect('users.db') as db:
        # Проверка существования пользователя
        cursor = await db.execute('SELECT id FROM users WHERE id = ?', (user.id,))
        existing_user = await cursor.fetchone()
        
        if existing_user:
            await message.answer(f"Привет, {user.username}! Ты уже зарегистрирован.")
        else:
            try:
                await db.execute('INSERT INTO users (id, username) VALUES (?, ?)', (user.id, user.username))
                await db.commit()
                await message.answer(f"Привет, {user.username}! Ты успешно зарегистрирован.")
            except aiosqlite.IntegrityError:
                await message.answer("Ошибка: пользователь с таким username уже существует.")

# Обработчик других сообщений
@dp.message()
async def echo(message: Message):
    await message.answer("Отправь /start для регистрации.")

# Запуск бота
async def main():
    await init_db()
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())