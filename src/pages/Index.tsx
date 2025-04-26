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
    if (!currentConversationId) {
      createNewChat();
    }

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

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', content);
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch("https://app-02380590.n8nhost.info/webhook/8bf7025a-e9b3-4116-9bbc-7c0401a3b78b", {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      
      toast("Câu hỏi đã được gửi đi", {
        description: "Vui lòng đợi trong giây lát"
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: "Hệ thống đang xử lý câu hỏi của bạn...",
        role: "assistant",
        timestamp: Date.now(),
      };

      const tempConversations = updatedConversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });
      
      setConversations(tempConversations);
      saveConversations(tempConversations);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const getResponse = await fetch("https://app-02380590.n8nhost.info/webhook/8bf7025a-e9b3-4116-9bbc-7c0401a3b78b", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (getResponse.ok) {
          const data = await getResponse.json();
          
          const finalMessage: Message = {
            id: crypto.randomUUID(),
            content: data[0]?.output || "Xin lỗi, tôi không thể xử lý yêu cầu này.",
            role: "assistant",
            timestamp: Date.now(),
          };
          
          const finalConversations = tempConversations.map((conv) => {
            if (conv.id === currentConversationId) {
              const messagesWithoutTemp = conv.messages.filter(m => m.id !== assistantMessage.id);
              return {
                ...conv,
                messages: [...messagesWithoutTemp, finalMessage],
              };
            }
            return conv;
          });
          
          setConversations(finalConversations);
          saveConversations(finalConversations);
        }
      } catch (error) {
        console.error("Error getting response:", error);
      }
      
    } catch (error) {
      console.error("Error calling n8n:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Có lỗi xảy ra khi gọi API. Vui lòng thử lại.",
        role: "assistant",
        timestamp: Date.now(),
      };

      const errorConversations = updatedConversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage, errorMessage],
          };
        }
        return conv;
      });

      setConversations(errorConversations);
      saveConversations(errorConversations);
    } finally {
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
