const Groq = require('groq-sdk');
const { API_KEYS } = require('../config/config');
const tools = require('../tools/tools');

class GroqService {
    constructor() {
        this.currentKeyIndex = 0;
        this.keyUsage = new Map(API_KEYS.map(key => ({
            minuteRequests: 0,
            dayRequests: 0,
            lastMinuteReset: Date.now(),
            lastDayReset: Date.now()
        })));
    }

    getNextApiKey() {
        const apiKey = API_KEYS[this.currentKeyIndex];
        this.currentKeyIndex = (this.currentKeyIndex + 1) % API_KEYS.length;
        return apiKey;
    }

    async processFunctionCall(functionCall) {
        const { name, arguments: args } = functionCall;
        const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
        
        if (tools[name]) {
            return await tools[name](parsedArgs);
        }
        return { error: `Function ${name} not found` };
    }

    async generateChatResponse(messages) {
        const apiKey = this.getNextApiKey();
        const groq = new Groq({
            apiKey: apiKey
        });

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages,
                model: "llama-3.3-70b-versatile",
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "getCurrentWeather",
                            description: "Get current weather for a location",
                            parameters: {
                                type: "object",
                                properties: {
                                    location: {
                                        type: "string",
                                        description: "City name or location"
                                    }
                                },
                                required: ["location"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "searchWeb",
                            description: "Search the web for information",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "Search query"
                                    }
                                },
                                required: ["query"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "calculateMath",
                            description: "Perform mathematical calculations",
                            parameters: {
                                type: "object",
                                properties: {
                                    expression: {
                                        type: "string",
                                        description: "Mathematical expression to evaluate"
                                    }
                                },
                                required: ["expression"]
                            }
                        }
                    }
                ]
            });

            if (chatCompletion.choices[0]?.message?.tool_calls) {
                const toolCalls = chatCompletion.choices[0].message.tool_calls;
                const toolResults = await Promise.all(
                    toolCalls.map(async (call) => {
                        const result = await this.processFunctionCall(call.function);
                        return {
                            role: "tool",
                            tool_call_id: call.id,
                            content: JSON.stringify(result)
                        };
                    })
                );

                // Add assistant's message with tool calls
                messages.push(chatCompletion.choices[0].message);
                // Add tool responses
                messages.push(...toolResults);

                // Make another API call with the tool results
                return this.generateChatResponse(messages);
            }

            return chatCompletion.choices[0]?.message?.content || '';

        } catch (error) {
            console.error(`Error with API Key ${this.currentKeyIndex}:`, error);
            throw error;
        }
    }
}

module.exports = new GroqService();