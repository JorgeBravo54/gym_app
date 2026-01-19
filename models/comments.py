import sqlite3
from config import COMMENTS_DB

def get_all_comments():
    conn = sqlite3.connect(COMMENTS_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT comment_id, username, comment FROM comments")
    rows = cursor.fetchall()
    conn.close()
    return rows

def add_comment(username, text):
    conn = sqlite3.connect(COMMENTS_DB)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO comments (username, comment) VALUES (?, ?)", (username, text))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id

def update_comment(cid, username, text):
    conn = sqlite3.connect(COMMENTS_DB)
    cursor = conn.cursor()
    cursor.execute("UPDATE comments SET comment=? WHERE comment_id=? AND username=?", (text, cid, username))
    conn.commit()
    conn.close()

def delete_comment(cid, username):
    conn = sqlite3.connect(COMMENTS_DB)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM comments WHERE comment_id=? AND username=?", (cid, username))
    conn.commit()
    conn.close()
