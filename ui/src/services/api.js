// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3012';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const chatService = {
    sendMessage: async (messages) => {
        try {
            const response = await apiClient.post('/api/chat', { messages });
            return response.data.response;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get response');
        }
    }
};