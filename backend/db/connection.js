const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { initSchema } = require('./schema');

const dbPath = path.resolve(__dirname, 'washops.db');
const db = new sqlite3.Database(dbPath);

db.run('PRAGMA foreign_keys = ON');

initSchema(db);

module.exports = db;