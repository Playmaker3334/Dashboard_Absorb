require('dotenv').config({ path: '../../.env' });

module.exports = {
  port: process.env.PORT || 8080,
  environment: process.env.NODE_ENV || 'development',
  absorbApiUrl: process.env.ABSORB_API_URL || 'http://localhost:5000/api/v1'
};