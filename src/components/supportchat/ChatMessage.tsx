import type { Message } from '@/types/chat';
import { BotMessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'enav';
  const isChatBot = message.role === 'chatbot';

  return (
    <div className="w-full flex mb-4">
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
        <div className="text-sm prose prose-sm max-w-none prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            skipHtml={true}
            components={{
              ul: ({ children }) => (
                <ul className="list-disc pl-5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5">{children}</ol>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p
          className={`text-xs ${
            isUser
              ? 'text-blue-100 text-right'
              : isChatBot
                ? 'text-blue-600 text-right'
                : 'text-gray-500'
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
