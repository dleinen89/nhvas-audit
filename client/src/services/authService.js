import axios from 'axios';

const API_URL = '/api/auth';

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get(`${API_URL}/me`, config);
    return response.data.data;
  } catch (error) {
    localStorage.removeItem('token');
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
};

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
