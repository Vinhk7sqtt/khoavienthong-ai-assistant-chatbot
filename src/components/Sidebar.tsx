
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
    <div className="flex flex-col w-80 h-screen bg-zinc-900 border-r border-zinc-800">
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-zinc-800 hover:bg-zinc-700"
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
                "w-full px-4 py-3 rounded-lg text-left mb-2 transition-colors",
                currentConversationId === conv.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50"
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
