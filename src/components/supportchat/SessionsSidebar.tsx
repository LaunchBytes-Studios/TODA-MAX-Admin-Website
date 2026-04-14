import type { ChatSessionWithPatient } from '@/types/chat';
import { PatientSessionItem } from './PatientSessionItem';

interface SessionsSidebarProps {
  chatSessions: ChatSessionWithPatient[];
  selectedSession: ChatSessionWithPatient;
  onSessionSelect: (session: ChatSessionWithPatient) => void;
}

export function SessionsSidebar({
  chatSessions,
  selectedSession,
  onSessionSelect,
}: SessionsSidebarProps) {
  return (
    <div className="w-1/3 border flex flex-col bg-white rounded-xl shadow-lg">
      <div className="p-4 border-b">
        <input
          placeholder="Search sessions..."
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatSessions.length > 0 ? (
          chatSessions.map((session) => {
            return (
              <PatientSessionItem
                key={session.chat_id}
                session={session}
                selected={
                  selectedSession && session.chat_id === selectedSession.chat_id
                }
                onClick={() => onSessionSelect(session)}
              />
            );
          })
        ) : (
          <p className="text-gray-500 p-4">No sessions available.</p>
        )}
      </div>
    </div>
  );
}
