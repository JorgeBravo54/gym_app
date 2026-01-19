import sqlite3
from config import ROUTINES_DB

def get_routines(username):
    conn = sqlite3.connect(ROUTINES_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT routine_id, function, reps, sets, weight FROM routines WHERE username=?", (username,))
    rows = cursor.fetchall()
    conn.close()
    return rows

def save_routines(username, routines):
    conn = sqlite3.connect(ROUTINES_DB)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM routines WHERE username=?", (username,))
    for rid, details in routines.items():
        for d in details:
            cursor.execute(
                "INSERT INTO routines (username, routine_id, function, reps, sets, weight) VALUES (?, ?, ?, ?, ?, ?)",
                (username, rid, d["function"], d["reps"], d["sets"], d["weight"])
            )
    conn.commit()
    conn.close()

