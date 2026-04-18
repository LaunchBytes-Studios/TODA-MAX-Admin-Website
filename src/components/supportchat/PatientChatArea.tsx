import type { Message } from '@/types/chat';
import type { Patient } from '@/types/patient';
import { ChatMessage } from './ChatMessage';
import { ChevronDown, Loader } from 'lucide-react';
import { ChatBotToggle } from './ChatBotToggle';
import { ExpandedPatientDetails } from './ExpandedPatientDetails';
import { useEffect, useRef } from 'react';

interface PatientChatAreaProps {
  selectedPatient?: Patient | null;
  messages: Message[];
  showDetails: boolean;
  botActive: boolean;
  setShowDetails: (show: boolean) => void;
  setBotActive: (isActive: boolean) => void;
  loading?: boolean;
  input: string;
  setInput: (input: string) => void;
  sending: boolean;
  handleSend: () => void;
}

export function PatientChatArea({
  selectedPatient,
  messages,
  showDetails,
  botActive,
  setShowDetails,
  setBotActive,
  loading,
  input,
  setInput,
  sending,
  handleSend,
}: PatientChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border min-h-0">
      {/* Header */}
      <div className="border-b">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold border border-blue-500">
              {selectedPatient ? (
                selectedPatient.avatar_url ? (
                  <img
                    src={selectedPatient.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  `${selectedPatient.firstname[0]}${selectedPatient.surname[0]}`
                )
              ) : (
                '??'
              )}
            </div>

            {/* Basic Info */}
            <div>
              <h2 className="font-semibold">
                {selectedPatient
                  ? `${selectedPatient.firstname} ${selectedPatient.surname}`
                  : 'Unknown'}
              </h2>

              <p className="text-sm text-gray-500">
                {selectedPatient
                  ? `Age ${
                      new Date().getFullYear() -
                      new Date(selectedPatient.birthday).getFullYear()
                    } • ${selectedPatient.sex}`
                  : ''}
              </p>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="ml-2"
            >
              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform ${
                  showDetails ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <ChatBotToggle
            active={botActive}
            onToggle={() => setBotActive(!botActive)}
          />
        </div>

        {/* EXPANDED PATIENT DETAILS */}
        {showDetails && selectedPatient && (
          <ExpandedPatientDetails selectedPatient={selectedPatient} />
        )}
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center flex-col">
          <Loader type="spin" color="#2b7fff" height={40} width={40} />
          <p className="text-blue-500 font-medium text-lg">
            Loading messages...
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pl-6 pt-4 pb-8 flex flex-col">
          <div className="mt-auto flex flex-col pr-4 mr-2 min-h-full">
            {messages.map((m) => (
              <ChatMessage key={m.message_id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!selectedPatient || sending}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg text-sm"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || !selectedPatient || sending}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
        >
          {sending ? (
            <Loader type="spin" color="#ffffff" height={20} width={20} />
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}
