import { useState, useEffect, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chatService';
import { useDashboard } from '../context/DashboardContext';

const MAX_MESSAGES = 30;
const STORAGE_KEY = 'spacepulse_chat_messages';

/**
 * Custom hook for the AI chatbot
 */
export function useChatbot() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const {
    issPosition,
    currentSpeed,
    nearestLocation,
    astronauts,
    positions,
    techNews,
    spaceNews,
  } = useDashboard();

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch (e) {
      console.warn('Failed to save chat messages:', e);
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Build dashboard data context
      const allNews = [...(techNews || []), ...(spaceNews || [])];
      const dashboardData = {
        issPosition,
        issSpeed: currentSpeed,
        nearestLocation,
        astronautCount: astronauts.count,
        astronauts: astronauts.people,
        newsArticles: allNews.slice(0, 10),
        trackedPositions: positions.length,
      };

      const response = await sendChatMessage(userMessage, dashboardData);

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.message);
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${err.message}`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [issPosition, currentSpeed, nearestLocation, astronauts, positions, techNews, spaceNews]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
