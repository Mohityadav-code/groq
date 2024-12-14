import { useState } from 'react';
import { useChat } from './ChatContext';
import axios from 'axios';  
import { chatService } from './services/api';

export function ChatComponent() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { chatHistory, addMessage, clearHistory } = useChat();

    const makeGroqRequest = async (messages) => {
        try {
            const response = await axios.post('http://localhost:3012/api/chat', {
                messages
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data.response;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get response');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        addMessage(userMessage);
        setInput('');
        setIsLoading(true);

        try {
            const allMessages = [...chatHistory, userMessage];
            const response = await chatService.sendMessage(allMessages);
            addMessage({ 
                role: 'assistant', 
                content: response 
            });
        } catch (error) {
            console.error('Error:', error);
            addMessage({ 
                role: 'system', 
                content: 'Sorry, there was an error processing your request.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && <div className="loading">Loading...</div>}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    Send
                </button>
                <button type="button" onClick={clearHistory}>
                    Clear History
                </button>
            </form>
        </div>
    );
}