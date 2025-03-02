from flask import Flask, request, redirect, render_template, make_response
import sqlite3
import uuid

app = Flask(__name__)

# Функция для получения пользователя из БД по user_id
def get_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT clicked_start FROM users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

# Функция для создания нового пользователя с clicked_start = False
def create_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (user_id, clicked_start) VALUES (?, ?)", (user_id, False))
    conn.commit()
    conn.close()

# Функция для обновления статуса пользователя (устанавливаем clicked_start в True)
def update_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET clicked_start = ? WHERE user_id = ?", (True, user_id))
    conn.commit()
    conn.close()

# Основная страница
@app.route('/')
def main():
    user_id = request.cookies.get('user_id')
    
    # Если cookie отсутствует, создаём нового пользователя и перенаправляем на /landing
    if not user_id:
        user_id = str(uuid.uuid4())
        create_user(user_id)
        response = make_response(redirect("/landing"))
        response.set_cookie('user_id', user_id)
        return response

    user = get_user(user_id)
    
    # Если пользователь существует и он ещё не нажал кнопку "Старт", перенаправляем на /landing
    if user and not user[0]:
        return redirect("/landing")
    
    # Если пользователь уже нажал, показываем основную страницу
    return render_template("index.html")

@app.route('/news')
def news():
    return render_template("news.html")

@app.route('/wallet')
def wallet():
    return render_template("wallet.html")

# Страница "Старт" с кнопкой
@app.route('/landing', methods=['GET', 'POST'])
def start():
    if request.method == "POST":
        user_id = request.cookies.get('user_id')
        if user_id:
            update_user(user_id)
        return redirect("/")
    return render_template("landing.html")

if __name__ == '__main__':
    app.run(debug=True)