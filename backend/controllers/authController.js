const userService = require('../services/userService');
const logger = require('../utils/logger');

const signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const result = await userService.saveUser(email, password);
  
  if (result.success) {
    logger.info(`User registered: ${email}`);
    return res.status(201).json(result);
  }
  
  const status = result.error === 'User already exists' ? 400 : 500;
  res.status(status).json(result);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.getUserByEmail(email);

  if (!result.success) return res.status(500).json(result);
  if (!result.data) return res.status(401).json({ error: "Invalid email" });
  if (result.data.password !== password) return res.status(401).json({ error: "Incorrect password" });

  logger.info(`Login successful: ${email}`);
  res.status(200).json({ success: true, user: { email: result.data.email } });
};

module.exports = { signup, login };