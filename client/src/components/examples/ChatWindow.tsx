import ChatWindow from '../ChatWindow';
import { useState } from 'react';

export default function ChatWindowExample() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi! I'd like to book 2 seats for tomorrow's 9:30 AM route",
      senderId: "2",
      senderName: "John Smith",
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: "2",
      text: "Sure! I have 2 seats available. Please confirm your pickup location.",
      senderId: "1",
      senderName: "You",
      timestamp: "10:31 AM",
      isSent: true,
    },
    {
      id: "3",
      text: "Downtown Plaza would be perfect. What time will you arrive?",
      senderId: "2",
      senderName: "John Smith",
      timestamp: "10:32 AM",
      isSent: false,
    },
  ]);

  const handleSend = (text: string) => {
    setMessages([...messages, {
      id: String(messages.length + 1),
      text,
      senderId: "1",
      senderName: "You",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
    }]);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <ChatWindow
        otherUserName="John Smith"
        messages={messages}
        onSendMessage={handleSend}
        onClose={() => console.log('Close chat')}
      />
    </div>
  );
}
