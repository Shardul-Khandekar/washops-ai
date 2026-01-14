const db = require('../db/connection');
const { createResponse } = require('../utils/response');

const userService = {

    // Register a new user
    saveUser: (email, password) => {
        return new Promise((resolve) => {
        const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.run(query, [email, password], function(err) {
            if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                resolve(createResponse(false, null, new Error('User already exists')));
            } else {
                resolve(createResponse(false, null, err));
            }
            } else {
            resolve(createResponse(true, { email }));
            }
        });
        });
    },

    // Retrieve user for login
    getUserByEmail: (email) => {
        return new Promise((resolve) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], (err, row) => {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, row));
        });
        });
    }
};

module.exports = userService;