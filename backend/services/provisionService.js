const twilio = require('twilio');
const { createResponse } = require('../utils/response');
const logger = require('../utils/logger');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize client only if credentials exist
let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const provisionService = {
  provisionNewNumber: async (areaCode = '206') => {
    try {
      if (!client) throw new Error("Twilio credentials missing");

      logger.info(`Searching for available numbers in area code: ${areaCode}`);

      const availableNumbers = await client.availablePhoneNumbers('US')
        .local
        .list({ areaCode, limit: 1 });

      if (availableNumbers.length === 0) {
        return createResponse(false, null, new Error("No numbers available in this area code"));
      }

      const selectedNumber = availableNumbers[0].phoneNumber;

      // Purchase the selected number
      const purchasedNumber = await client.incomingPhoneNumbers
        .create({ phoneNumber: selectedNumber });

      logger.info(`Successfully purchased: ${purchasedNumber.phoneNumber}`);
      return createResponse(true, { phoneNumber: purchasedNumber.phoneNumber });
    } catch (error) {
      logger.error("Twilio Provisioning Error", error);
      return createResponse(false, null, error);
    }
  }
};

module.exports = provisionService;