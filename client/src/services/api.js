import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to all requests dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors and handle bad responses gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Capture validation errors or standard messages
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      if (error.response.data && error.response.data.errors) {
        // Return first validation error if present
        message = error.response.data.errors.map(err => err.message).join(', ');
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Could not connect to the server. Please check your internet connection.';
    }

    const formattedError = new Error(message);
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;
    
    return Promise.reject(formattedError);
  }
);

export default api;
