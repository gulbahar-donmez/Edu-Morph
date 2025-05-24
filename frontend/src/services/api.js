import axios from 'axios';

const API_URL = 'http://localhost:8000'; // FastAPI backend URL'i

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token'ı localStorage'dan al
const getToken = () => {
    return localStorage.getItem('token');
};

// API isteklerine token ekle
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Hata yönetimi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Sunucudan gelen hata
            console.error('API Hatası:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // İstek yapılamadı
            console.error('Bağlantı Hatası:', error.request);
            return Promise.reject({ detail: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.' });
        } else {
            // İstek oluşturulurken hata
            console.error('İstek Hatası:', error.message);
            return Promise.reject({ detail: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        }
    }
);

export const authService = {
    login: async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await api.post('/token', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Giriş hatası:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            console.error('Kayıt hatası:', error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export const learningStyleService = {
    saveAssessment: async (assessmentData) => {
        const response = await api.post('/learning-style-assessment/save', assessmentData);
        return response.data;
    },

    getRecommendations: async () => {
        const response = await api.get('/learning-style/recommendations');
        return response.data;
    }
};

export const personalityService = {
    analyze: async (answers) => {
        const response = await api.post('/personality-analysis/analyze', answers);
        return response.data;
    }
};

export default api; 