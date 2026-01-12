const express = require('express');
const cors = require('cors');
const { saveUser } = require('./db');

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

const PORT = 5001;
app.listen(PORT, () => console.log(`WashOps Auth (SQLite) running on port ${PORT}`));