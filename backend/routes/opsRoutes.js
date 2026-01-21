const express = require('express');
const router = express.Router();
const opsController = require('../controllers/opsController');
const { checkAuth } = require('../middleware/authMiddleware');

// Apply the auth placeholder to all operations
router.use(checkAuth);

// Business Hours endpoints
router.get('/:id/hours', opsController.getHours);
router.post('/:id/hours', opsController.updateHours);

// Services Catalog endpoints
router.get('/:id/services', opsController.getServices);
router.post('/:id/services', opsController.syncServices);

module.exports = router;