import api from './api';

const authService = {
  register: async (name, email, password) => {
    try {
      console.log('Sending registration request with:', { name, email, password: '****' });
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Extract the most relevant error message to throw
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Express validator errors format
        throw { message: error.response.data.errors[0].msg };
      } else if (error.response?.data?.message) {
        // Custom error message from API
        throw { message: error.response.data.message };
      } else {
        throw { message: 'Registration failed. Please try again.' };
      }
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  checkAuthStatus: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset request failed' };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },
};

export default authService;