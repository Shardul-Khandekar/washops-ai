import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), '../../data/car_wash.db')

def get_db_connection():
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            time TEXT NOT NULL,
            service TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()