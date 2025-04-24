
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Conversation, Message } from "@/types/chat";
import { loadConversations, saveConversations } from "@/lib/storage";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedConversations = loadConversations();
    setConversations(savedConversations);
    if (savedConversations.length > 0) {
      setCurrentConversationId(savedConversations[0].id);
    }
  }, []);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "Cuộc trò chuyện mới",
      messages: [],
      timestamp: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    saveConversations([newConversation, ...conversations]);
  };

  const sendMessage = async (content: string) => {
    if (!currentConversationId) {
      createNewChat();
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      timestamp: Date.now(),
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          timestamp: Date.now(),
          title: content.slice(0, 30) + "...",
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    // Call n8n API
    setIsLoading(true);
    try {
      // Replace with your n8n API endpoint
      const response = await fetch("YOUR_N8N_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response || "Xin lỗi, tôi không thể xử lý yêu cầu này.",
        role: "assistant",
        timestamp: Date.now(),
      };

      const finalConversations = conversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage, assistantMessage],
          };
        }
        return conv;
      });

      setConversations(finalConversations);
      saveConversations(finalConversations);
    } catch (error) {
      console.error("Error calling n8n:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewChat}
        onSelectConversation={setCurrentConversationId}
      />
      <div className="flex-1 flex flex-col h-screen">
        <div className="text-center p-8 border-b border-zinc-800">
          <h1 className="text-2xl font-bold mb-2">KHOA VIỄN THÔNG</h1>
          <p className="text-zinc-400">Trợ lý AI hỗ trợ học tập</p>
        </div>
        <ScrollArea className="flex-1 p-4">
          {currentConversation?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </ScrollArea>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
