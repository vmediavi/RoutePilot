import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isSent: boolean;
}

interface ChatWindowProps {
  otherUserName: string;
  otherUserAvatar?: string;
  messages: Message[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}

export default function ChatWindow({
  otherUserName,
  otherUserAvatar,
  messages,
  onSendMessage,
  onClose,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <Card className="flex flex-col h-[500px]" data-testid="container-chat-window">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUserAvatar} />
              <AvatarFallback>{otherUserName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm" data-testid="text-chat-user-name">{otherUserName}</p>
              <p className="text-xs text-chart-2">Online</p>
            </div>
          </div>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-chat">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
            data-testid={`message-${message.id}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isSent
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isSent ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            data-testid="input-chat-message"
          />
          <Button size="icon" onClick={handleSend} data-testid="button-send-message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
