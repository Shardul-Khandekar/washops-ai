import unittest
from src.tools.db_tools import check_availability, book_appointment
from src.utils.db_manager import init_db

class TestTools(unittest.TestCase):
    def setUp(self):
        # Ensure the database is initialized before each test
        init_db()

    # invoke method is how langchain calls the tool functions, and LLM passes arguments as a dict
    def test_booking_and_checking(self):
        # 1. Book an appointment
        result = book_appointment.invoke({
            "name": "Jane Doe", 
            "phone": "555-0199", 
            "time": "2026-01-15 14:00", 
            "service": "Full Detail"
        })

        self.assertIn("Successfully booked", result)

        # 2. Check availability for the same date
        avail = check_availability.invoke({"date": "2026-01-15"})
        self.assertIn("14:00: Full Detail", avail)

if __name__ == "__main__":
    unittest.main()