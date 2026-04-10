import type { Message } from '@/types/chat';
import type { Patient } from '@/types/patient';
import { ChatMessage } from './ChatMessage';
import { ChevronDown } from 'lucide-react';
import { ChatBotToggle } from './ChatBotToggle';

interface PatientChatAreaProps {
  selectedPatient?: Patient;
  filteredMessages: Message[];
  showDetails: boolean;
  botActive: boolean;
  setShowDetails: (show: boolean) => void;
  setBotActive: (isActive: boolean) => void;
}

export function PatientChatArea({
  selectedPatient,
  filteredMessages,
  showDetails,
  botActive,
  setShowDetails,
  setBotActive,
}: PatientChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg border min-h-0">
      {/* Header */}
      <div className="border-b">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
              {selectedPatient
                ? `${selectedPatient.firstname[0]}${selectedPatient.surname[0]}`
                : '??'}
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
                      selectedPatient.birthday.getFullYear()
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
          <div className="px-4 pb-4 pt-2 bg-gray-50 border-t text-sm space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="text-gray-500">Contact:</span>{' '}
                {selectedPatient.contact}
              </p>
              <p>
                <span className="text-gray-500">Sex:</span>{' '}
                {selectedPatient.sex}
              </p>
              <p>
                <span className="text-gray-500">Address:</span>{' '}
                {selectedPatient.address}
              </p>
              <p>
                <span className="text-gray-500">PhilHealth:</span>{' '}
                {selectedPatient.philhealth_num}
              </p>
              <p>
                <span className="text-gray-500">Birthday:</span>{' '}
                {selectedPatient.birthday.toLocaleDateString()}
              </p>
            </div>

            {/* Diagnosis */}
            <div className="flex flex-row gap-6">
              <p className="text-gray-500 mb-1 text-center">Diagnosis:</p>
              <div className="flex gap-2 items-center justify-center">
                {selectedPatient.diagnosis.hypertension && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full items-center justify-center flex-1 text-center">
                    Hypertension
                  </span>
                )}
                {selectedPatient.diagnosis.diabetes && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    Diabetes
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end gap-4">
        {filteredMessages.map((m) => (
          <ChatMessage key={m.message_id} message={m} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-3">
        <input
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-lg text-sm"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
          Send
        </button>
      </div>
    </div>
  );
}
