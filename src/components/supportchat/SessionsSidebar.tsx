import type { ChatSession } from '@/types/chat';
import { PatientSessionItem } from './PatientSessionItem';
import type { Patient } from '@/types/patient';

interface SessionsSidebarProps {
  chatSessions: ChatSession[];
  patients: Patient[];
  selectedSession: ChatSession;
  onSessionSelect: (session: ChatSession) => void;
}

export function SessionsSidebar({
  chatSessions,
  patients,
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
        {chatSessions.map((session) => {
          const patient = patients.find(
            (p) => p.patientId === session.patient_id,
          );

          return (
            <PatientSessionItem
              key={session.chat_id}
              session={session}
              patient={patient}
              selected={session.chat_id === selectedSession.chat_id}
              onClick={() => onSessionSelect(session)}
            />
          );
        })}
      </div>
    </div>
  );
}
