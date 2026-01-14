const db = require('../db/connection');
const { createResponse } = require('../utils/response');

const washService = {

    // Create a new location
    createCarWash: (owner_email, name, address, zipCode) => {
        return new Promise((resolve) => {
            const query = `INSERT INTO car_washes (owner_email, name, address, zipCode) VALUES (?, ?, ?, ?)`;
            db.run(query, [owner_email, name, address, zipCode], function(err) {
                if (err) resolve(createResponse(false, null, err));
                else resolve(createResponse(true, { id: this.lastID }));
            });
        });
    },

    // Fetch all locations for the homepage
    getWashesByOwner: (email) => {
        return new Promise((resolve) => {
        const query = `SELECT * FROM car_washes WHERE owner_email = ?`;
        db.all(query, [email], (err, rows) => {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, rows));
        });
        });
    },

    // Link a Twilio number to a location
    updateWashNumber: (id, twilioNumber) => {
        return new Promise((resolve) => {
        const query = `UPDATE car_washes SET twilioNumber = ? WHERE id = ?`;
        db.run(query, [twilioNumber, id], function(err) {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, { updated: true }));
        });
        });
    }
};

module.exports = washService;