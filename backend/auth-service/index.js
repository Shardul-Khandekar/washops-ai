const express = require('express');
const cors = require('cors');
const { saveUser, getUserByEmail, saveUserNumber } = require('./db');
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

        res.status(200).json({ message: "Login successful", user: { email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


app.post('/api/twilio/provision', async (req, res) => {

    const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    // Provision a new Twilio number
    const newNumber = await provisionNewNumber();
    // Store email and number in the database
    await saveUserNumber(email, newNumber);

    console.log(`[TWILIO] Assigned ${newNumber} to ${email}`);
    res.status(200).json({ twilioNumber: newNumber });
    } catch (error) {
        console.error("Provisioning Error:", error);
        res.status(500).json({ error: "Failed to provision number" });
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`WashOps Auth (SQLite) running on port ${PORT}`));