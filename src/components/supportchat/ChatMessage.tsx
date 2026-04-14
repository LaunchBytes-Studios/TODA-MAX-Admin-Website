import type { Message } from '@/types/chat';
import { BotMessageSquare } from 'lucide-react';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'enav';
  const isChatBot = message.role === 'chatbot';

  return (
    <div className="w-full flex">
      <div
        className={`p-3 rounded-xl max-w-md ${
          isUser
            ? 'bg-blue-500 text-white ml-auto rounded-br-none'
            : isChatBot
              ? 'bg-blue-100 text-blue-600 ml-auto rounded-br-none'
              : 'bg-gray-200 text-black mr-auto rounded-bl-none'
        }`}
      >
        {isChatBot && <BotMessageSquare size={20} />}
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs ${
            isUser
              ? 'text-blue-100 text-right'
              : isChatBot
                ? 'text-blue-600 text-right'
                : 'text-gray-500'
          }`}
        >
          {message.created_at.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
