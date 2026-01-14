const initSchema = (db) => {
    db.serialize(() => {
    // Users Table
        db.run(`
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `);

        // Car Washes Table
        db.run(`
        CREATE TABLE IF NOT EXISTS car_washes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_email TEXT,
            name TEXT NOT NULL,
            address TEXT,
            zipCode TEXT,
            twilioNumber TEXT UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(owner_email) REFERENCES users(email) ON DELETE CASCADE
        )
        `);

        // Business Hours
        db.run(`
        CREATE TABLE IF NOT EXISTS business_hours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wash_id INTEGER,
            day_of_week TEXT,
            open_time TEXT,
            close_time TEXT,
            is_closed BOOLEAN DEFAULT 0,
            FOREIGN KEY(wash_id) REFERENCES car_washes(id) ON DELETE CASCADE
        )
        `);

        // Services Catalog
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wash_id INTEGER,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        duration_minutes INTEGER,
        description TEXT,
        FOREIGN KEY(wash_id) REFERENCES car_washes(id) ON DELETE CASCADE
      )
    `);
  });
};

module.exports = { initSchema };