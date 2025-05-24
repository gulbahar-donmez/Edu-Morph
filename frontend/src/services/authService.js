import axios from 'axios';

const API_URL = 'http://localhost:8000';

const authService = {
    login: async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(`${API_URL}/token`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                return response.data;
            } else {
                throw new Error('Token alınamadı');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService; 