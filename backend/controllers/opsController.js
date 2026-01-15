const opsService = require('../services/opsService');
const logger = require('../utils/logger');

const getHours = async (req, res) => {
  const { id } = req.params;
  const result = await opsService.getHoursByWashId(id);
  
  if (result.success) return res.status(200).json(result.data);
  res.status(500).json(result);
};

const updateHours = async (req, res) => {
  const { id } = req.params;
  const { hours } = req.body;

  if (!Array.isArray(hours)) {
    return res.status(400).json({ success: false, error: "Invalid hours data format" });
  }

  const result = await opsService.updateBusinessHours(id, hours);
  
  if (result.success) {
    logger.info(`Updated business hours for Wash ID: ${id}`);
    return res.status(200).json(result);
  }
  res.status(500).json(result);
};

const getServices = async (req, res) => {
  const { id } = req.params;
  const result = await opsService.getServicesByWashId(id);
  
  if (result.success) return res.status(200).json(result.data);
  res.status(500).json(result);
};

const addService = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, duration_minutes } = req.body;

  const result = await opsService.addService(id, name, price, description, duration_minutes);
  
  if (result.success) {
    logger.info(`New service added to wash ${id}: ${name}`);
    return res.status(201).json(result);
  }
  res.status(500).json(result);
};

module.exports = { getHours, updateHours, getServices, addService };