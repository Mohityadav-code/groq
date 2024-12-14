// src/tools/tools.js
const axios = require('axios');

const tools = {
    getCurrentWeather: async ({ location }) => {
        // Example weather API call (replace with your preferred weather API)
        try {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`);
            return {
                temperature: response.data.current.temp_c,
                condition: response.data.current.condition.text
            };
        } catch (error) {
            return { error: 'Failed to fetch weather data' };
        }
    },

    searchWeb: async ({ query }) => {
        // Example web search (replace with your preferred search API)
        try {
            const response = await axios.get(`https://api.serper.dev/search`, {
                headers: { 'X-API-KEY': 'YOUR_SERPER_API_KEY' },
                params: { q: query }
            });
            return response.data.organic.slice(0, 3);
        } catch (error) {
            return { error: 'Failed to perform web search' };
        }
    },

    calculateMath: ({ expression }) => {
        try {
            // Be careful with eval - this is just an example
            // In production, use a proper math expression parser
            return { result: eval(expression) };
        } catch (error) {
            return { error: 'Invalid math expression' };
        }
    }
};

module.exports = tools;
