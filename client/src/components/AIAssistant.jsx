import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AIAssistant = ({ onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { sender: "ai", text: t("ai.welcome") }
  ]);
  const [input, setInput] = useState("");

  // Simple frontend AI logic
  const getAIResponse = (message) => {
    const text = message.toLowerCase();
    if (text.includes("book")) return t("ai.book");
    if (text.includes("price") || text.includes("cost")) return t("ai.price");
    if (text.includes("referee") || text.includes("staff") || text.includes("volunteer"))
      return t("ai.staff");
    if (text.includes("weather")) return t("ai.weather");
    if (text.includes("help")) return t("ai.help");
    return t("ai.default");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const aiMsg = { sender: "ai", text: getAIResponse(input) };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-xl border z-50">
      <div className="flex justify-between items-center p-3 bg-green-600 text-white rounded-t-xl">
        <span>🤖 {t("ai.title")}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.sender === "ai"
                ? "bg-gray-100 text-left"
                : "bg-green-100 text-right"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 text-sm outline-none"
          placeholder={t("ai.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="px-4 bg-green-600 text-white"
        >
          {t("ai.send")}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
