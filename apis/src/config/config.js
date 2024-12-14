require('dotenv').config();

module.exports = {
    API_KEYS: [
        process.env.GROQ_API_KEY,
        process.env.GROQ_API_KEY2,
        process.env.GROQ_API_KEY3,
        process.env.GROQ_API_KEY4
    ],
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    SERPER_API_KEY: process.env.SERPER_API_KEY
};