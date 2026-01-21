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

const syncServices = async (req, res) => {
  const { id } = req.params;
  const { services } = req.body;

  if (!Array.isArray(services)) {
    return res.status(400).json({ success: false, error: "Invalid data format" });
  }

  const result = await opsService.syncServices(id, services);
  if (result.success) {
    logger.info(`Service catalog synced for wash ${id}`);
    return res.status(200).json(result);
  }
  res.status(500).json(result);
};

module.exports = { getHours, updateHours, getServices, syncServices };