import sqlite3
import os
import sys

from src.utils.db_manager import db_path

def view_appointments():
    if not os.path.exists(db_path):
        print("Database does not exist. Please initialize the database first.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM appointments ORDER BY time ASC")
        rows = cursor.fetchall()

        if not rows:
            print("The appointments table is currently empty.")
        else:
            print("Appointments:")
            for row in rows:
                print(f"ID: {row[0]}, Name: {row[1]}, Phone: {row[2]}, Time: {row[3]}, Service: {row[4]}")

    except sqlite3.OperationalError:
        print("Table 'appointments' does not exist yet. Run the app or tests first.")
    finally:
        conn.close()

if __name__ == "__main__":
    view_appointments()