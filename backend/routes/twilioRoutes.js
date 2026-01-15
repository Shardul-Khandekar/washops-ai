const express = require('express');
const router = express.Router();
const twilioController = require('../controllers/twilioController');
const { checkAuth } = require('../middleware/authMiddleware');

// Secure the provisioning endpoint
router.post('/provision', checkAuth, twilioController.provisionNumber);

module.exports = router;