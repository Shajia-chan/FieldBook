// AIAssistantButton.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const AIAssistantButton = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Only show on homepage
  if (location.pathname !== '/') return null;

  const toggleChatBox = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    setChatHistory((prev) => [...prev, { sender: 'ai', text: "Sorry, I am just a demo AI for now!" }]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating AI Button */}
      <button
        onClick={toggleChatBox}
        className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition-transform hover:scale-110"
        title="AI Assistant"
      >
        🤖
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="mt-3 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  chat.sender === 'user'
                    ? 'bg-green-100 text-right self-end'
                    : 'bg-gray-100 text-left self-start'
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-2 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantButton;


