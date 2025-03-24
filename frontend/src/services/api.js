import axios from 'axios';

// In development, this comes from .env
// In production, we'll use the same server
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = {
  // Get all simulators
  getSimulators: async () => {
    try {
      const response = await axios.get(`${API_URL}/simulators`);
      return response.data;
    } catch (error) {
      console.error('Error fetching simulators:', error);
      throw error;
    }
  },
  
  // Get all courses (including non-simulators)
  getCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },
  
  // Get users for a specific simulator
  getSimulatorUsers: async (simulatorId, page = 1, limit = 20) => {
    try {
      const response = await axios.get(
        `${API_URL}/simulators/${simulatorId}/users`,
        { params: { page, limit, include_details: true } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for simulator ${simulatorId}:`, error);
      throw error;
    }
  },
  
  // Get users for a specific course
  getCourseUsers: async (courseId, page = 1, limit = 20) => {
    try {
      const response = await axios.get(
        `${API_URL}/courses/${courseId}/users`,
        { params: { page, limit, include_details: true } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for course ${courseId}:`, error);
      throw error;
    }
  }
};

export default api;