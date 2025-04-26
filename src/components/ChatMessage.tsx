
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

export const ChatMessage = ({ message }: { message: Message }) => {
  console.log("Rendering message:", message);
  
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg mb-4 max-w-3xl mx-auto",
        message.role === "user"
          ? "bg-zinc-800 text-white ml-auto"
          : "bg-zinc-900 border border-zinc-800"
      )}
    >
      <div className="text-sm font-medium mb-1">
        {message.role === "user" ? "Bạn" : "Trợ lý"}
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
