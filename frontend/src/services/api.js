import axios from 'axios';

// Set your backend API URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // Log information about the request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request includes auth token');
    } else {
      console.warn('No auth token available for request:', config.url);
    }
    
    // Don't log the entire payload for security, but log that there is a payload
    if (config.data) {
      console.log('Request includes data payload of size:', 
        JSON.stringify(config.data).length, 'bytes');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    
    // Log response data size without exposing sensitive data
    const dataSize = JSON.stringify(response.data).length;
    console.log(`Response data size: ${dataSize} bytes`);
    
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // If unauthorized (401), clear token and redirect to login
    if (error.response && error.response.status === 401) {
      console.warn('401 Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors or timeouts more clearly
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be overloaded');
    }
    
    if (!error.response) {
      console.error('Network error - no response from server');
    }
    
    return Promise.reject(error);
  }
);

// Add helper to check token validity
api.checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // Make a request to your auth verification endpoint
    const response = await api.get('/auth/verify');
    return !!response.data.valid;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return false;
  }
};

export default api;