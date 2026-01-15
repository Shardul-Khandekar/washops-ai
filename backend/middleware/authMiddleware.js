const logger = require('../utils/logger');

const checkAuth = (req, res, next) => {
    // Placeholder for future JWT/Session validation
    logger.info(`Auth check placeholder for: ${req.method} ${req.url}`);
  next();
};

module.exports = { checkAuth };