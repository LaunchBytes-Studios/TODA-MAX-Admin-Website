import type { Message } from '@/types/chat';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'enav';

  return (
    <div className="w-full flex">
      <div
        className={`p-3 rounded-xl max-w-md ${
          isUser
            ? 'bg-blue-500 text-white ml-auto rounded-br-none'
            : 'bg-gray-200 text-black mr-auto rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p
          className={`text-xs ${
            isUser ? 'text-blue-100 text-right' : 'text-gray-500'
          }`}
        >
          {message.created_at}
        </p>
      </div>
    </div>
  );
}
