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

// Export functions
module.exports = { saveUser, getUserByEmail };