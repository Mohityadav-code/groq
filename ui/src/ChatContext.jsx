import { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [chatHistory, setChatHistory] = useState([]);

    // Load chat history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save to localStorage whenever chat history changes
    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    const addMessage = (message) => {
        setChatHistory(prev => [...prev, message]);
    };

    const clearHistory = () => {
        setChatHistory([]);
        localStorage.removeItem('chatHistory');
    };

    return (
        <ChatContext.Provider value={{ chatHistory, addMessage, clearHistory }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);