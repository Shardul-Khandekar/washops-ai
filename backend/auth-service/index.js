require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { 
    saveUser, 
    getUserByEmail, 
    saveUserNumber, 
    getNumberByEmail,
    createCarWash,
    getWashesByOwner,
    getWashById,
    updateWashNumber,
    getHoursByWashId,
    updateBusinessHours
} = require('./db');

const { provisionNewNumber } = require('./twilio_helper');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/signup', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        await saveUser({ email, password });
        console.log(`[SQLITE] Registered: ${email}`);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error.message);
        const status = error.message === 'User already exists' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {

    const { email, password } = req.body;

    console.log(`[SQLITE] Login attempt for: ${email}`);

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: "Invalid email" });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // After passing all checks check if they have a twilio number assigned
        const existingNumber = await getNumberByEmail(email);

        res.status(200).json({ 
            user: { 
                email: user.email,
                twilioNumber: existingNumber
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


app.post('/api/twilio/provision', async (req, res) => {

  const { wash_id } = req.body;

  try {
    // Provision a new Twilio number
    const newNumber = await provisionNewNumber();
    // Associate this number with car wash id in the database
    await updateWashNumber(wash_id, newNumber);

    console.log(`[TWILIO] Assigned ${newNumber} to wash ID ${wash_id}`);
    res.status(200).json({ twilioNumber: newNumber });

    } catch (error) {
        console.error("Provisioning Error:", error);
        res.status(500).json({ error: "Failed to provision number" });
    }
});

// Route to add a new business location
app.post('/api/washes', async (req, res) => {

  const { owner_email, name, address, zipCode } = req.body;

  try {

    const result = await createCarWash(owner_email, name, address, zipCode);
    res.status(201).json({ id: result.id, message: "Location added" });

  } catch (error) {
    res.status(500).json({ error: "Failed to create location" });
  }
});

// Route to get all locations for the dashboard
app.get('/api/washes', async (req, res) => {

  const { email } = req.query;

  try {

    const washes = await getWashesByOwner(email);
    res.status(200).json(washes);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Route for the details page
app.get('/api/washes/:id', async (req, res) => {

  try {
    const wash = await getWashById(req.params.id);
    if (!wash) return res.status(404).json({ error: "Wash not found" });
    res.status(200).json(wash);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET route to fetch hours
app.get('/api/washes/:id/hours', async (req, res) => {
  try {
    const hours = await getHoursByWashId(req.params.id);
    res.status(200).json(hours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch business hours" });
  }
});

// POST route to update hours
app.post('/api/washes/:id/hours', async (req, res) => {
  const { hours } = req.body;
  const washId = req.params.id;

  if (!Array.isArray(hours)) {
    return res.status(400).json({ error: "Invalid hours data format" });
  }

  try {
    await updateBusinessHours(washId, hours);
    console.log(`[DB] Updated business hours for Wash ID: ${washId}`);
    res.status(200).json({ message: "Hours updated successfully" });
  } catch (error) {
    console.error("Update Hours Error:", error);
    res.status(500).json({ error: "Failed to update business hours" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`WashOps Auth (SQLite) running on port ${PORT}`));