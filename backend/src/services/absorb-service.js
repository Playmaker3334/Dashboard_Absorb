const axios = require('axios');
const config = require('../config');

class AbsorbService {
  constructor() {
    this.absorbApiUrl = config.absorbApiUrl;
    
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: this.absorbApiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
  
  /**
   * Make a request to the Absorb API
   * @param {string} method - HTTP method (GET, POST, etc)
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} data - Request body data
   * @returns {Promise} - API response
   */
  async request(method, endpoint, params = {}, data = null) {
    try {
      const response = await this.api.request({
        method,
        url: endpoint,
        params,
        data
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error calling Absorb API: ${endpoint}`, error.message);
      
      if (error.response) {
        // The request was made and the server responded with an error status
        throw {
          status: error.response.status,
          message: error.response.data.message || 'Error from Absorb API',
          data: error.response.data
        };
      } else if (error.request) {
        // The request was made but no response was received
        throw {
          status: 503,
          message: 'No response from Absorb API server'
        };
      } else {
        // Something happened in setting up the request
        throw {
          status: 500,
          message: `Error setting up request: ${error.message}`
        };
      }
    }
  }
  
  /**
   * Get all simulators
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async getSimulators(options = {}) {
    const { limit = 100, includeAllCourses = false } = options;
    return this.request('GET', '/simulators', { 
      limit, 
      include_all: includeAllCourses 
    });
  }
  
  /**
   * Get all courses (including non-simulators)
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async getCourses(options = {}) {
    const { limit = 100 } = options;
    return this.request('GET', '/simulators', { 
      limit, 
      include_all: true 
    });
  }
  
  /**
   * Get users for a specific simulator
   * @param {string} simulatorId - Simulator ID
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async getSimulatorUsers(simulatorId, options = {}) {
    const { page = 1, limit = 20, includeDetails = true } = options;
    return this.request('GET', `/simulators/${simulatorId}/users`, {
      page,
      limit,
      include_details: includeDetails
    });
  }
  
  /**
   * Get users for a specific course
   * @param {string} courseId - Course ID
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async getCourseUsers(courseId, options = {}) {
    const { page = 1, limit = 20, includeDetails = true } = options;
    return this.request('GET', `/courses/${courseId}/users`, {
      page,
      limit,
      include_details: includeDetails
    });
  }
}

// Export a singleton instance
module.exports = new AbsorbService();