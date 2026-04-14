import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://churchmanagement-backend.onrender.com/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling and data normalization
apiClient.interceptors.response.use(
    (response) => {
        const body = response.data;
        // If success is true but data is missing and there's another array property (like 'users', 'members'), map it to 'data'
        if (body && body.success && body.data === undefined) {
            const listKey = Object.keys(body).find(key =>
                Array.isArray(body[key]) && key !== 'success' && key !== 'message' && key !== 'require2FA'
            );
            if (listKey) {
                body.data = body[listKey];
            }
        }
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);

            // If we get a 401 error about invalid/expired token, clear it
            if (error.response.status === 401) {
                const message = error.response.data?.message || '';
                if (message.includes('token') || message.includes('logged in')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Only redirect to login if we're on a protected route (dashboard)
                    if (window.location.pathname.startsWith('/dashboard')) {
                        window.location.href = '/login';
                    }
                }
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
