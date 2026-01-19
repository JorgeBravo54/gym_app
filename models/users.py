import sqlite3, bcrypt
from config import USERS_DB

def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def create_user(username, password):
    conn = sqlite3.connect(USERS_DB)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hash_password(password)))
    conn.commit()
    conn.close()

def get_user(username):
    conn = sqlite3.connect(USERS_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user
