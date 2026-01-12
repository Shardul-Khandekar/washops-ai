const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials missing in .env file");
}

const client = twilio(accountSid, authToken);

const provisionNewNumber = async () => {

    console.log("Searching for available Twilio numbers...");

    // Search for available phone numbers
    const availableNumbers = await client.availablePhoneNumbers('US')
    .local
    .list({ areaCode: '206', limit: 1 });

    if (availableNumbers.length === 0) {
        throw new Error("No numbers available in this area code.");
    }

    const selectedNumber = availableNumbers[0].phoneNumber;

    // Purchase the selected number
    const purchasedNumber = await client.incomingPhoneNumbers
    .create({ phoneNumber: selectedNumber });

    console.log(`Successfully provisioned: ${purchasedNumber.phoneNumber}`);
    return purchasedNumber.phoneNumber;
};

module.exports = { provisionNewNumber };