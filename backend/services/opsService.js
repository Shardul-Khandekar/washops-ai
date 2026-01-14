const db = require('../db/connection');
const { createResponse } = require('../utils/response');

const opsService = {

    // Manage Business Hours
    updateBusinessHours: (washId, hoursArray) => {
        return new Promise((resolve) => {
        db.serialize(() => {
            db.run(`DELETE FROM business_hours WHERE wash_id = ?`, [washId], (err) => {
            if (err) return resolve(createResponse(false, null, err));
            });

            const stmt = db.prepare(`
            INSERT INTO business_hours (wash_id, day_of_week, open_time, close_time, is_closed)
            VALUES (?, ?, ?, ?, ?)
            `);

            hoursArray.forEach((h) => {
            stmt.run([washId, h.day_of_week, h.open_time, h.close_time, h.is_closed ? 1 : 0]);
            });

            stmt.finalize((err) => {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, { message: "Hours updated successfully" }));
            });
        });
        });
    },

    // Service Catalog Management
    getServicesByWashId: (washId) => {
        return new Promise((resolve) => {
        const query = `SELECT * FROM services WHERE wash_id = ?`;
        db.all(query, [washId], (err, rows) => {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, rows));
        });
        });
    },

    addService: (washId, name, price, description, duration) => {
        return new Promise((resolve) => {
        const query = `INSERT INTO services (wash_id, name, price, description, duration_minutes) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [washId, name, price, description, duration], function(err) {
            if (err) resolve(createResponse(false, null, err));
            else resolve(createResponse(true, { id: this.lastID }));
        });
        });
    }
};

module.exports = opsService;