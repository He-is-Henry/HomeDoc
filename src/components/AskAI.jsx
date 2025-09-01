import { useState, useRef, useEffect } from "react";
import axios from "../api/axios";
import "../index.css";
import { useAuth } from "../hooks/useAuth";

const AskAI = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const chatEndRef = useRef(null);

  const { accessToken } = useAuth();
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history, typingText, showThinking]);
  const handleResend = async (index) => {
    const failedMsg = history[index - 1];
    if (!failedMsg) return;

    // remove the failed message from history
    setHistory((prev) => prev.filter((_, i) => i !== index));

    // re-trigger the same prompt
    setPrompt(failedMsg.text || "");
    // then call handleSubmit manually
    handleSubmit({ preventDefault: () => {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading || typingText) return;

    const userMessage = { role: "User", text: prompt };
    setHistory((prev) => [...prev, userMessage]);
    setPrompt("");
    setTypingText("");
    setLoading(true);
    setShowThinking(true);

    try {
      const { data } = await axios.post(
        "/api/ai/ask",
        {
          prompt,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setShowThinking(false);

      const fullText = data.message;
      let index = 0;
      setTypingText(fullText[0]);
      let currentText = fullText[0];
      index = 1;

      const interval = setInterval(() => {
        currentText += fullText[index];
        setTypingText(currentText);
        index++;

        if (index >= fullText.length) {
          clearInterval(interval);
          setHistory((prev) => [...prev, { role: "AI", text: fullText }]);
          setTypingText("");
        }
      }, 15);
    } catch (err) {
      console.log(err);
      setShowThinking(false);
      setTypingText("");
      setHistory((prev) => [
        ...prev,
        {
          role: "AI",
          text: "Something went wrong. Please try again.",
          failed: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] w-full mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
      <h1 className="text-center bg-[#1e3a8a] text-white text-2xl font-semibold p-4">
        Homedoc Assistant
      </h1>

      <div className="flex-1 p-5 overflow-y-auto bg-[#f9fbff] text-[#1e3a8a]">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] text-sm mb-2.5 p-4 rounded-[16px] break-words leading-relaxed ${
              msg.role === "User"
                ? "self-end ml-auto bg-blue-100 text-[#1e3a8a] rounded-br-sm"
                : "self-start mr-auto bg-yellow-100 text-gray-800 rounded-bl-sm"
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />

            {msg.failed && (
              <button
                onClick={() => handleResend(index)}
                className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded"
              >
                Resend
              </button>
            )}
          </div>
        ))}
        {showThinking && (
          <div className="max-w-[75%] p-4 mb-2.5 rounded-[16px] bg-yellow-100 text-gray-800 self-start mr-auto rounded-bl-sm">
            <i>Thinking...</i>
          </div>
        )}
        {typingText && (
          <div
            className="max-w-[75%] p-4 mb-2.5 rounded-[16px] bg-yellow-100 text-gray-800 self-start mr-auto rounded-bl-sm"
            dangerouslySetInnerHTML={{
              __html: typingText + "<span class='blinking-cursor'>|</span>",
            }}
          />
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex border-t border-gray-300 bg-white"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your health question..."
          className="flex-1 p-3 text-base outline-none"
        />
        <button
          className={`px-6 font-bold text-white ${
            loading || typingText
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-[#1e3a8a] hover:bg-[#1741a1]"
          }`}
          disabled={loading || typingText}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default AskAI;
