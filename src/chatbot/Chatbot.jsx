import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChatbot } from '../hooks/useChatbot';

/**
 * Floating AI chatbot with expandable chat window
 */
export default function Chatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef } = useChatbot();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };

  const formatTimestamp = (ts) => {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
          bg-gradient-to-br from-nebula-500 to-cosmic-500 text-white text-2xl
          shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110
          ${isOpen ? 'rotate-0' : 'animate-float'}`}
        style={{
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden
            shadow-2xl animate-slide-up
            ${theme === 'dark'
              ? 'bg-space-800/95 border border-white/10'
              : 'bg-white/95 border border-gray-200'
            } backdrop-blur-xl`}
          style={{ maxHeight: 'calc(100vh - 160px)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-nebula-500/20 to-cosmic-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-500 to-cosmic-500 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  SpacePulse AI
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Dashboard Assistant
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className={`text-xs px-2 py-1 rounded-lg transition-colors
                ${theme === 'dark'
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 chat-messages">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🛰️</div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Ask me anything about the dashboard data!
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    'Where is the ISS right now?',
                    'How fast is the ISS moving?',
                    'How many astronauts are in space?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); sendMessage(q); }}
                      className={`block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors
                        ${theme === 'dark'
                          ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-nebula-500 to-nebula-400 text-white rounded-br-sm'
                      : msg.isError
                        ? theme === 'dark'
                          ? 'bg-danger-500/10 text-danger-400 rounded-bl-sm'
                          : 'bg-red-50 text-red-500 rounded-bl-sm'
                        : theme === 'dark'
                          ? 'bg-white/8 text-gray-300 rounded-bl-sm'
                          : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm
                  ${theme === 'dark' ? 'bg-white/8' : 'bg-gray-100'}`}
                >
                  <div className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={`p-3 border-t
            ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about dashboard data..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-colors
                  ${theme === 'dark'
                    ? 'bg-white/5 text-white placeholder-gray-600 focus:bg-white/8 border border-white/5 focus:border-nebula-500/30'
                    : 'bg-gray-50 text-gray-800 placeholder-gray-400 focus:bg-white border border-gray-200 focus:border-nebula-400'
                  }`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-nebula-500 to-cosmic-500 text-white text-sm font-semibold
                  disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
