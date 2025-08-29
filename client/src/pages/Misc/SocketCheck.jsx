import React, { useEffect, useState, useRef } from "react";
import { useSocketContext } from "../../context/SocketContext";

const SocketCheck = () => {
  const socket = useSocketContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("receive-msg", (msg) => {
      setMessages((prev) => [...prev, { text: msg, fromSelf: false }]);
    });

    return () => {
      socket.off("receive-msg");
    };
  }, [socket]);

  const handleSend = () => {
    if (!message.trim()) return;
    socket.emit("send-msg", message);

    setMessages((prev) => [...prev, { text: message, fromSelf: true }]);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="w-screen h-screen text-black mx-auto  p-10
    border rounded-lg shadow-lg bg-gray-200"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Chat</h2>

      <div
        className="h-80 overflow-y-auto mb-4 p-2 border '
      rounded-lg bg-gray-50 flex flex-col gap-2"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg.fromSelf
                ? "bg-blue-400 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-lg focus:outline-none
           focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg
           hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SocketCheck;
