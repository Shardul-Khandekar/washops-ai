const axios = require('axios');
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

const syncToAI = async (req, res) => {
  const { id } = req.params;
  const { owner_email } = req.body;

  console.log(`Initiating AI sync for Wash ID: ${id} by owner: ${owner_email}`);

  try {
    // Fetch current hours and services
    const [hoursRes, servicesRes] = await Promise.all([
      opsService.getHoursByWashId(id),
      opsService.getServicesByWashId(id)
    ]);

    // Create Python payload
    const data_points = [
      ...hoursRes.data.map(h => ({
        content: `${h.day_of_week}: ${h.is_closed ? 'Closed' : h.open_time + ' to ' + h.close_time}`,
        metadata: { category: 'hours' }
      })),
      ...servicesRes.data.map(s => ({
        content: `Service: ${s.name}, Price: $${s.price}. ${s.description || ''}`,
        metadata: { category: 'service', service_id: s.id }
      }))
    ];

    console.log(`Called AI sync with data points: ${JSON.stringify(data_points)}`);

    const pythonResponse = await axios.post('http://localhost:8000/sync', {
      owner_email,
      wash_id: parseInt(id),
      data_points
    });

    return res.status(200).json({ success: pythonResponse.data.success });
  } catch (error) {
    console.error("AI Sync Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to sync with AI service" });
  }
};


module.exports = { getHours, updateHours, getServices, syncServices, syncToAI };