
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { Conversation, Message } from "@/types/chat";
import { loadConversations, saveConversations } from "@/lib/storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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

  const sendMessage = async (content: string, file?: File) => {
    let activeConversationId = currentConversationId;

    let currentConversations = conversations;

    if (!activeConversationId) {
      // Create new chat and wait for state to update
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: "Cuộc trò chuyện mới",
        messages: [],
        timestamp: Date.now(),
      };
      
      currentConversations = [newConversation, ...conversations];
      
      await new Promise<void>((resolve) => {
        setConversations(currentConversations);
        setCurrentConversationId(newConversation.id);
        saveConversations(currentConversations);
        resolve();
      });
      
      activeConversationId = newConversation.id;
    }

    console.log("Starting sendMessage function with:", { content, file });

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: file ? `${content} [File: ${file.name}]` : content,
      role: "user",
      timestamp: Date.now(),
      attachment: file ? {
        name: file.name,
        type: file.type,
        size: file.size
      } : undefined
    };

    const updatedConversations = currentConversations.map((conv) => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          timestamp: Date.now(),
          title: content.slice(0, 30) + "...",
        };
      }
      return conv;
    });

    console.log("Updated conversations with user message:", updatedConversations);
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', content);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch("https://app-02380590.n8nhost.info/webhook/8bf7025a-e9b3-4116-9bbc-7c0401a3b78b", {
        method: "POST",
        // mode: "no-cors", // Remove if CORS is handled correctly by the server
        body: formData,
      });

      if (!response.ok) {
        // Handle non-2xx responses
        console.error("API request failed:", response.status, response.statusText);
        const errorText = await response.text(); // Try to get error details
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Assuming the API returns JSON with the assistant's message
      // Adjust '.output' based on the actual structure of your API response
      const data = await response.json();

      console.log("POST response data:", data);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        // Access the output property from the first element of the array
        content: data[0]?.output || "Xin lỗi, tôi không thể xử lý yêu cầu này.",
        role: "assistant",
        timestamp: Date.now(),
      };

      // Add the assistant's message directly to the updated conversations
      const finalConversations = updatedConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });

      console.log("Final conversations with AI response:", finalConversations);
      setConversations(finalConversations);
      saveConversations(finalConversations);

      toast("Phản hồi đã được nhận", {
        description: "AI đã trả lời câu hỏi của bạn."
      });
    } catch (error) {
      //console.error("Error in main try/catch block:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Có lỗi xảy ra khi gọi API. Vui lòng thử lại.",
        role: "assistant",
        timestamp: Date.now(),
      };

      const errorConversations = updatedConversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage],
          };
        }
        return conv;
      });

      setConversations(errorConversations);
      saveConversations(errorConversations);
    } finally {
      console.log("Request process completed, setting isLoading to false");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <div className="flex-shrink-0">
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={createNewChat}
          onSelectConversation={setCurrentConversationId}
        />
      </div>
      <div className="flex-1 flex flex-col h-screen max-w-6xl mx-auto">
        <div className="text-center p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-zinc-800">
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            KHOA VIỄN THÔNG
          </h1>
          <p className="text-zinc-300 text-sm">Trợ lý AI hỗ trợ học tập</p>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Removed console log from here */}
            {currentConversation?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
