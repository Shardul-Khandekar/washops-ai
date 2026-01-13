const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create washops.db in the current directory
const dbPath = path.resolve(__dirname, 'washops.db');
const db = new sqlite3.Database(dbPath);

// Initialize the table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS user_numbers (
    email TEXT,
    twilioNumber TEXT NOT NULL,
    assignedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(email) REFERENCES users(email)
  )
`);

  db.run(`
    CREATE TABLE IF NOT EXISTS car_washes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_email TEXT,
      name TEXT NOT NULL,
      address TEXT,
      zipCode TEXT,
      twilioNumber TEXT UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(owner_email) REFERENCES users(email)
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS business_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wash_id INTEGER,
    day_of_week TEXT, -- 'Monday', 'Tuesday', etc.
    open_time TEXT,   -- '08:00'
    close_time TEXT,  -- '18:00'
    is_closed BOOLEAN DEFAULT 0,
    FOREIGN KEY(wash_id) REFERENCES car_washes(id)
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wash_id INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    duration_minutes INTEGER,
    description TEXT, -- This will also be sent to ChromaDB
    FOREIGN KEY(wash_id) REFERENCES car_washes(id)
  )
`);

});

// Function to save a new user - sign up
const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [user.email, user.password], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          reject(new Error('User already exists'));
        }
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

// Get user by email - login
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Function to save Twilio number
const saveUserNumber = (email, number) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user_numbers (email, twilioNumber) VALUES (?, ?)`;
    db.run(query, [email, number], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
};

// Get twilio number by email
const getNumberByEmail = (email) => {
  console.log("Fetching Twilio number for:", email);
  return new Promise((resolve, reject) => {
    const query = `SELECT twilioNumber FROM user_numbers WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.twilioNumber : null);
    });
  });
};

// Function to create a new car wash location
const createCarWash = (owner_email, name, address, zipCode) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO car_washes (owner_email, name, address, zipCode) VALUES (?, ?, ?, ?)`;
    db.run(query, [owner_email, name, address, zipCode], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
};

// Function to fetch all locations for a specific owner
const getWashesByOwner = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM car_washes WHERE owner_email = ?`;
    db.all(query, [email], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Function to fetch a single location's details
const getWashById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM car_washes WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Function to update a car wash with a Twilio number
const updateWashNumber = (id, twilioNumber) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE car_washes SET twilioNumber = ? WHERE id = ?`;
    db.run(query, [twilioNumber, id], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Fetch hours for a specific wash
const getHoursByWashId = (washId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM business_hours WHERE wash_id = ?`;
    db.all(query, [washId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Update hours using a transaction-like approach (Delete then Insert)
const updateBusinessHours = (washId, hoursArray) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Clear existing hours for this wash
      db.run(`DELETE FROM business_hours WHERE wash_id = ?`, [washId], (err) => {
        if (err) return reject(err);
      });

      // 2. Prepare the insert statement
      const stmt = db.prepare(`
        INSERT INTO business_hours (wash_id, day_of_week, open_time, close_time, is_closed)
        VALUES (?, ?, ?, ?, ?)
      `);

      // 3. Insert each day's record
      hoursArray.forEach((h) => {
        stmt.run(
          [washId, h.day_of_week, h.open_time, h.close_time, h.is_closed ? 1 : 0]
        );
      });

      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

// Function to add a new service
const createService = (wash_id, name, price, description) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO services (wash_id, name, price, description) VALUES (?, ?, ?, ?)`;
    db.run(query, [wash_id, name, price, description], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
};

// Function to get all services for a specific wash
const getServicesByWashId = (washId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM services WHERE wash_id = ?`;
    db.all(query, [washId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Export functions
module.exports = { 
  saveUser, 
  getUserByEmail, 
  saveUserNumber, 
  getNumberByEmail, 
  createCarWash, 
  getWashesByOwner, 
  getWashById,
  updateWashNumber,
  getHoursByWashId,
  updateBusinessHours,
  createService,
  getServicesByWashId
};