from typing import Annotated
import sqlite3
from langchain_core.tools import tool
from src.utils.db_manager import get_db_connection
import re

@tool
def check_availability(date: Annotated[str, "The date to check in YYYY-MM-DD format"]):
    """
    Consult the car wash schedule to see existing appointments for a specific date.
    Use this to see what slots are ALREADY taken so you can suggest empty ones.
    Returns a string summary of the day's bookings.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT time FROM appointments WHERE time LIKE ? ORDER BY time ASC", (f'{date}%',))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return f"No appointments found for {date}. The whole day is available."
    
    taken_slots = [row['time'].split(" ")[1] for row in rows]
    return f"On {date}, these times are ALREADY BOOKED: {', '.join(taken_slots)}. Suggest any other time to the user."

@tool
def book_appointment(
    name: Annotated[str, "The customer's full name"],
    phone: Annotated[str, "The customer's phone number"],
    time: Annotated[str, "The appointment time. MUST be in 'YYYY-MM-DD HH:MM' format (e.g., '2026-01-12 14:30')"],
    service: Annotated[str, "The type of wash (e.g., Basic, Full Detail, Ceramic)"]
):
    """
    Books a new car wash appointment. Requires name, phone, time, and service type.
    """

    # Phone number basic validation
    clean_phone = re.sub(r'\D', '', phone)
    if len(clean_phone) < 10:
        return "Error: The phone number provided is invalid. I need at least 10 digits."
    
    # Service type basic validation
    valid_services = ["Basic", "Full Detail"]
    if service not in valid_services:
        return f"Error: '{service}' is not a valid service. Please choose Basic or Full Detail."

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO appointments (customer_name, phone, time, service) VALUES (?, ?, ?, ?)",
            (name, phone, time, service)
        )
        conn.commit()
        conn.close()
        return f"Successfully booked {service} for {name} at {time}."
    except Exception as e:
        return f"Error writing to database: {str(e)}"
    
@tool
def cancel_appointment(name: Annotated[str, "The customer's full name"], 
                       time: Annotated[str, "The EXACT appointment time as stored in the DB, format 'YYYY-MM-DD HH:MM'"]):
    """
    Cancels an existing car wash appointment from the database. Always check availability first to find the exact time string.
    Use this if a customer explicitly asks to cancel or delete their booking.
    
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Verify both name and time to avoid accidental deletions
        cursor.execute("DELETE FROM appointments WHERE customer_name = ? AND time LIKE ?", (name, time))
        
        if cursor.rowcount > 0:
            conn.commit()
            conn.close()
            return f"Successfully cancelled the appointment for {name} at {time}."
        else:
            conn.close()
            return f"No appointment found for {name} at {time} to cancel."
    except Exception as e:
        return f"Error accessing database during cancellation: {str(e)}"