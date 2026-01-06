import unittest
from src.utils.db_manager import init_db, get_db_connection

class TestDatabase(unittest.TestCase):

    def test_init_and_write(self):
        # Initialize db
        init_db()

        # Create connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert a test record
        cursor.execute("INSERT INTO appointments (customer_name, phone, time, service) VALUES (?, ?, ?, ?)",
                       ('Test User', '123456', '2026-01-10 10:00', 'Basic Wash'))
        conn.commit()

        # Retrieve the record
        cursor.execute("SELECT * FROM appointments WHERE customer_name='Test User'")
        row = cursor.fetchone()

        self.assertIsNotNone(row)
        self.assertEqual(row['service'], 'Basic Wash')
        conn.close()

if __name__ == '__main__':
    unittest.main()