import api from './api';

// API_URL handled by api instance
// const API_URL = 'http://localhost:5000/api/auth';

// Register new user
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Apply dark mode if user has preference
        if (response.data.user?.darkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }
    return response.data;
};

// Login user
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Apply dark mode if user has preference
        if (response.data.user?.darkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }
    return response.data;
};

// Logout user
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Google OAuth login/signup
export const googleLogin = async (credential) => {
    const response = await api.post('/auth/google', { credential });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // Apply dark mode if user has preference
        if (response.data.user?.darkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }
    return response.data;
};

// Get stored token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Initialize auth headers from stored token
// No longer needed with api interceptor
export const initializeAuth = () => {
    // const token = getToken();
    // if (token) {
    //     setAuthToken(token);
    // }
};

export default {
    register,
    login,
    googleLogin,
    logout,
    getCurrentUser,
    getToken,
    initializeAuth
};
