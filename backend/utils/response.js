// Standardize the response format
export const createResponse = (success, data = null, error = null)=> ({
  success,
  data,
  error: error ? error.message || error : null,
  timestamp: new Date().toISOString(),
});