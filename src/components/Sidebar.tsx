
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export const Sidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
}: SidebarProps) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800">
      <div className="p-4 flex flex-col space-y-4">
        <img 
          src="/lovable-uploads/afb1c28f-002f-4cb3-995c-375bd60bd993.png" 
          alt="Khoa Viễn Thông Logo" 
          className="h-10 w-10 object-contain mx-auto"
        />
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Cuộc trò chuyện mới
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full px-4 py-3 rounded-lg text-left mb-2 transition-all duration-200",
                currentConversationId === conv.id
                  ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <div className="font-medium truncate">{conv.title}</div>
              <div className="text-xs text-zinc-500">
                {new Date(conv.timestamp).toLocaleDateString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
