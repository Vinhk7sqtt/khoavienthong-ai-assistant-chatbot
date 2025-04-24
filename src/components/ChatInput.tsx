
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff, Paperclip } from "lucide-react";
import { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string, file?: File) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || selectedFile) && !isLoading) {
      onSend(input.trim(), selectedFile || undefined);
      setInput("");
      setSelectedFile(null);
    }
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'vi-VN';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
    }
  };

  const stopRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
      <div className="flex gap-2 max-w-3xl mx-auto items-center">
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />
        <Button
          type="button"
          onClick={toggleVoiceRecording}
          variant="ghost"
          size="icon"
          className={`${isRecording ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        {selectedFile && (
          <div className="text-sm text-zinc-400">
            {selectedFile.name}
          </div>
        )}
        <Button
          type="submit"
          disabled={(!input.trim() && !selectedFile) || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
