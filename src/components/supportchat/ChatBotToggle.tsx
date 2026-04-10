import { Bot, BotOff } from 'lucide-react';

export function ChatBotToggle({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-600">Chat Bot</p>
        <p className="text-xs text-gray-500">
          {active ? 'Active' : 'Inactive'}
        </p>
      </div>

      <button
        onClick={onToggle}
        className={`w-14 h-9 rounded-full relative transition ${
          active ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-8 h-8 bg-white rounded-full absolute top-0.5 flex items-center justify-center transition ${
            active ? 'right-1' : 'left-1'
          }`}
        >
          {active ? <Bot size={16} /> : <BotOff size={16} />}
        </div>
      </button>
    </div>
  );
}
