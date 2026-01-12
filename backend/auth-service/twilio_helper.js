const provisionNewNumber = async () => {

    console.log("Communicating with Twilio API...");
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `+1555${randomSuffix}`;
};

module.exports = { provisionNewNumber };