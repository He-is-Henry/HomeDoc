import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";

const ChatSidebar = ({ selectedChatId, setSelectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false); // popup toggle
  const { accessToken } = useAuth();

  const deleteChat = async (id) => {
    try {
      const response = await axios.delete(`/chats/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (id === selectedChatId) setSelectedChatId(null);
    } catch (err) {
      console.error("Error deleting chat", err);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!accessToken) return;

        const { data } = await axios.get("/chats", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    };
    fetchChats();
  }, [accessToken]);

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-[#1e3a8a] text-white fixed top-4 left-4 rounded-md z-50 md:hidden"
        >
          ☰
        </button>
      )}

      {/* Sidebar container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-100 border-r flex flex-col transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="p-4 font-semibold text-[#1e3a8a] border-b flex justify-between items-center">
          My Chats
          <button onClick={() => setOpen(false)} className="md:hidden">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChatId(chat._id);
                setOpen(false); // auto close on mobile
              }}
              className={`p-3 cursor-pointer flex justify-between items-center ${
                chat._id === selectedChatId ? "bg-blue-200" : "hover:bg-blue-50"
              }`}
            >
              <span className="truncate">
                {chat.messages[0]?.text || "New chat"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="text-red-500 ml-2 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
