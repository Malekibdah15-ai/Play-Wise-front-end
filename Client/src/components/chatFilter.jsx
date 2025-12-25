import React, { useState } from "react";
import axios from "axios";

const ChatFilter = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkMessage = async () => {
    if (!message) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/ai/chat-filter",
        { message }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({
        safe: false,
        reason: "Unable to verify message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-14 w-full max-w-xl bg-[#111] border border-white/10 rounded-xl p-6 text-left">
      <h3 className="text-xl font-bold mb-4">AI Chat Filter</h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message to check if it's safe..."
        className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg p-3 text-gray-200 outline-none resize-none"
        rows={4}
      />

      <button
        onClick={checkMessage}
        className="mt-3 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-semibold"
      >
        Check Message
      </button>

      {loading && (
        <p className="mt-3 text-gray-400">Analyzing message...</p>
      )}

      {result && (
        <div className="mt-4">
          {result.safe ? (
            <p className="text-green-400 font-semibold">
               Message is safe
            </p>
          ) : (
            <p className="text-red-400 font-semibold">
               Message blocked: {result.reason}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatFilter;
