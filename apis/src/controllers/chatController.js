const groqService = require('../services/groqService');

class ChatController {
    async generateResponse(req, res) {
        try {
            const { messages } = req.body;
            
            if (!Array.isArray(messages)) {
                return res.status(400).json({ 
                    error: 'Messages must be an array' 
                });
            }

            const response = await groqService.generateChatResponse(messages);
            res.json({ response });

        } catch (error) {
            console.error('Chat controller error:', error);
            res.status(500).json({ 
                error: 'Failed to generate response' 
            });
        }
    }
}

module.exports = new ChatController();
