// Standardize the response format
const createResponse = (success, data = null, error = null)=> ({
  success,
  data,
  error: error ? error.message || error : null,
  timestamp: new Date().toISOString(),
});

module.exports = { createResponse };