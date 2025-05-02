
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

export const ChatMessage = ({ message }: { message: Message }) => {
  console.log("Rendering message:", message);
  
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "px-4 py-3 rounded-lg max-w-3xl",
          message.role === "user"
            ? "bg-purple-600 text-white mr-2 ml-auto md:ml-0 md:max-w-[80%]"
            : "bg-zinc-800/90 text-white ml-2 mr-auto md:mr-0 md:max-w-[80%]"
        )}
      >
        <div className={cn(
          "text-sm font-medium mb-1",
          message.role === "user" ? "text-purple-100" : "text-zinc-300"
        )}>
          {message.role === "user" ? "Bạn" : "Trợ lý trả lời"}
        </div>
        <div className="text-zinc-100 break-words">{message.content}</div>
        <div className="text-xs mt-2 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString("vi-VN")}
          {message.attachment && (
            <span className="ml-2">[File: {message.attachment.name}]</span>
          )}
        </div>
      </div>
    </div>
  );
};
