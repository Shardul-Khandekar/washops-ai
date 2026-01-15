const express = require('express');
const router = express.Router();
const washController = require('../controllers/washController');
const { checkAuth } = require('../middleware/authMiddleware');

// All wash routes are protected by the auth placeholder
router.use(checkAuth);

router.get('/', washController.getMyWashes);
router.post('/', washController.createWash);

module.exports = router;