import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Crear instancia de axios con configuración común
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Timeout de 15 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

const api = {
  // Get all simulators
  getSimulators: async () => {
    try {
      const response = await apiClient.get('/simulators');
      return response.data;
    } catch (error) {
      console.error('Error fetching simulators:', error);
      // Si el error es por timeout, proporcionar un mensaje específico
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: 'La solicitud tardó demasiado tiempo en responder. Por favor, intente nuevamente.'
        };
      }
      return {
        success: false,
        message: 'Error al cargar simuladores. Por favor, intente nuevamente.'
      };
    }
  },
  
  // Get all courses (including non-simulators)
  getCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: 'La solicitud tardó demasiado tiempo en responder. Por favor, intente nuevamente.'
        };
      }
      return {
        success: false,
        message: 'Error al cargar cursos. Por favor, intente nuevamente.'
      };
    }
  },
  
  // Get users for a specific simulator
  getSimulatorUsers: async (simulatorId, page = 1, limit = 6) => {
    try {
      const response = await apiClient.get(
        `/simulators/${simulatorId}/users`,
        { params: { page, limit, include_details: true } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for simulator ${simulatorId}:`, error);
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: 'La solicitud tardó demasiado tiempo en responder. Por favor, intente nuevamente.'
        };
      }
      return {
        success: false,
        message: 'Error al cargar usuarios. Por favor, intente nuevamente.'
      };
    }
  },
  
  // Get users for a specific course
  getCourseUsers: async (courseId, page = 1, limit = 6) => {
    try {
      const response = await apiClient.get(
        `/courses/${courseId}/users`,
        { params: { page, limit, include_details: true } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for course ${courseId}:`, error);
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: 'La solicitud tardó demasiado tiempo en responder. Por favor, intente nuevamente.'
        };
      }
      return {
        success: false,
        message: 'Error al cargar usuarios. Por favor, intente nuevamente.'
      };
    }
  }
};

export default api;