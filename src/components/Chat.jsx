import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import AskAI from "./AskAI";

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="flex h-screen">
      <ChatSidebar
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
      />
      <div className="flex-1">
        <AskAI chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default Chat;
