
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Star, StarOff, Trash2 } from "lucide-react";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { deleteConversation, toggleFavorite } from "@/lib/storage";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  setConversations: (conversations: Conversation[]) => void;
}

export const Sidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  setConversations,
}: SidebarProps) => {
  
  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updatedConversations = deleteConversation(id);
    setConversations(updatedConversations);
    
    // If we deleted the current conversation, select another one if available
    if (currentConversationId === id) {
      const nextConversation = updatedConversations[0];
      if (nextConversation) {
        onSelectConversation(nextConversation.id);
      } else {
        onNewChat();
      }
    }
    toast("Cuộc trò chuyện đã được xóa");
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updatedConversations = toggleFavorite(id);
    setConversations(updatedConversations);
    const conversation = updatedConversations.find(conv => conv.id === id);
    toast(conversation?.favorite ? 
      "Đã thêm vào mục yêu thích" : 
      "Đã xóa khỏi mục yêu thích"
    );
  };

  // Sort conversations: favorites first, then by timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 w-56">
      <div className="p-3 flex flex-col space-y-4">
        <img 
          src="/lovable-uploads/afb1c28f-002f-4cb3-995c-375bd60bd993.png" 
          alt="Khoa Viễn Thông Logo" 
          className="h-8 w-8 object-contain mx-auto"
        />
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg text-xs"
        >
          <MessageSquare className="mr-2 h-3 w-3" />
          Cuộc trò chuyện mới
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {sortedConversations.map((conv) => (
            <ContextMenu key={conv.id}>
              <ContextMenuTrigger>
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-left mb-1 transition-all duration-200 text-xs flex items-center justify-between group",
                    currentConversationId === conv.id
                      ? "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-white border border-purple-500/20"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate flex items-center">
                      {conv.favorite && <Star className="h-3 w-3 mr-1 text-yellow-500 inline-block" />}
                      {conv.title}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(conv.timestamp).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleToggleFavorite(conv.id, e)}
                      className="p-1 rounded-md hover:bg-zinc-700/50"
                    >
                      {conv.favorite ? (
                        <StarOff className="h-3 w-3 text-yellow-500" />
                      ) : (
                        <Star className="h-3 w-3 text-zinc-400" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => handleDelete(conv.id, e)}
                      className="p-1 rounded-md hover:bg-zinc-700/50"
                    >
                      <Trash2 className="h-3 w-3 text-zinc-400 hover:text-red-400" />
                    </button>
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={() => handleToggleFavorite(conv.id)}>
                  {conv.favorite ? (
                    <>
                      <StarOff className="mr-2 h-4 w-4 text-yellow-500" />
                      Xóa khỏi mục yêu thích
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Thêm vào mục yêu thích
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleDelete(conv.id)} className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa cuộc trò chuyện
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
