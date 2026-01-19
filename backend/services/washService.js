const db = require('../db/connection');
const { createResponse } = require('../utils/response');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const washService = {

    // Create a new location
    createCarWash: (owner_email, name, address, zipCode) => {
        return new Promise((resolve) => {
            const query = `INSERT INTO car_washes (owner_email, name, address, zipCode) VALUES (?, ?, ?, ?)`;
            db.run(query, [owner_email, name, address, zipCode], function(err) {
                if (err) {
                    return resolve({ success: false, message: "Failed to create wash", error: err });
                } else{
                    // Get the ID of the newly created wash
                    const washId = this.lastID;
                    // Create default hours for the new wash
                    const hoursQuery = `
                        INSERT INTO business_hours (wash_id, day_of_week, open_time, close_time, is_closed)
                        VALUES ${DAYS.map(() => "(?, ?, ?, ?, ?)").join(", ")}
                    `;
                    const hoursParams = [];
                    DAYS.forEach(day => {
                        hoursParams.push(washId, day, '09:00', '17:00', 0);
                    });
                    db.run(hoursQuery, hoursParams, (hourErr) => {
                        if (hourErr) {
                            return resolve({ success: false, message: "Wash created, but hours failed to initialize", error: hourErr });
                        } else{
                            resolve({ success: true, data: { id: washId } });
                        }
                    });
                }
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