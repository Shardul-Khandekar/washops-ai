const provisionService = require('../services/provisionService');
const washService = require('../services/washService');
const logger = require('../utils/logger');

const provisionNumber = async (req, res) => {
  const { wash_id } = req.body;

  if (!wash_id) {
    return res.status(400).json({ success: false, error: "wash_id is required" });
  }

  // 1. Provision the number via Twilio
  const provisionResult = await provisionService.provisionNewNumber();
  
  if (!provisionResult.success) {
    return res.status(500).json(provisionResult);
  }

  const newNumber = provisionResult.data.phoneNumber;

  // 2. Update the database record for this wash
  const dbResult = await washService.updateWashNumber(wash_id, newNumber);

  if (dbResult.success) {
    logger.info(`Provisioned and linked ${newNumber} to wash ${wash_id}`);
    return res.status(200).json({ success: true, twilioNumber: newNumber });
  }

  res.status(500).json(dbResult);
};

module.exports = { provisionNumber };