const washService = require('../services/washService');
const logger = require('../utils/logger');

const getMyWashes = async (req, res) => {
  const { email } = req.query;
  const result = await washService.getWashesByOwner(email);
  
  if (result.success) return res.status(200).json(result.data);
  res.status(500).json(result);
};

const createWash = async (req, res) => {
  const { owner_email, name, address, zipCode } = req.body;
  const result = await washService.createCarWash(owner_email, name, address, zipCode);
  
  if (result.success) {
    logger.info(`New wash created: ${name} for ${owner_email}`);
    return res.status(201).json(result);
  }
  res.status(500).json(result);
};

module.exports = { getMyWashes, createWash };