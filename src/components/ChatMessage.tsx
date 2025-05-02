
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

export const ChatMessage = ({ message }: { message: Message }) => {
  console.log("Rendering message:", message);
  
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg mb-4 max-w-3xl",
        message.role === "user"
          ? "bg-zinc-800 text-white ml-auto mr-2"
          : "bg-indigo-900/50 text-white border border-indigo-800/50 ml-2 mr-auto"
      )}
    >
      <div className={cn(
        "text-sm font-medium mb-1",
        message.role === "user" ? "text-purple-200" : "text-indigo-200"
      )}>
        {message.role === "user" ? "Bạn" : "Trợ lý trả lời"}
      </div>
      <div className="text-zinc-200">{message.content}</div>
      <div className="text-xs text-zinc-500 mt-2">
        {new Date(message.timestamp).toLocaleTimeString("vi-VN")}
        {message.attachment && (
          <span className="ml-2">[File: {message.attachment.name}]</span>
        )}
      </div>
    </div>
  );
};
