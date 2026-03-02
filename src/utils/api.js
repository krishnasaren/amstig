import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Response error:', error);

        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - please try again');
        }

        if (error.response) {
            // Server responded with error status
            const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Unable to connect to server. Please check your connection.');
        } else {
            // Something else happened
            throw new Error('An unexpected error occurred');
        }
    }
);

// Code execution API
export const executeCode = async (code, language = 'javascript') => {
    try {
        const response = await api.post('/code/execute', {
            code,
            language
        });
        return response;
    } catch (error) {
        console.error('Code execution error:', error);
        throw error;
    }
};

// Get supported languages
export const getSupportedLanguages = async () => {
    try {
        const response = await api.get('/code/languages');
        return response;
    } catch (error) {
        console.error('Error fetching supported languages:', error);
        throw error;
    }
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

export default api;