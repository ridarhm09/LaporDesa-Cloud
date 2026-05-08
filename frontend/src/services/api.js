import axios from 'axios';

const API_BASE_URL = 'http://13.238.194.47:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor untuk menambahkan token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Auth endpoints
export const authService = {
    register: (name, email, password, confirmPassword) =>
        api.post('/auth/register', { name, email, password, confirmPassword }),
    
    login: (email, password) =>
        api.post('/auth/login', { email, password })
};

// Reports endpoints
export const reportService = {
    createReport: (formData) =>
        api.post('/reports', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    
    getReports: () =>
        api.get('/reports'),
    
    getReportDetail: (id) =>
        api.get(`/reports/${id}`),
    
    updateReportStatus: (id, status) =>
        api.patch(`/reports/${id}/status`, { status }),
    
    deleteReport: (id) =>
        api.delete(`/reports/${id}`)
};

// Health check
export const healthCheck = () =>
    api.get('/health');

export default api;
