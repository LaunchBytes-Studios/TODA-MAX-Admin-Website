import type { ChatSession } from '@/types/chat';
import type { Patient } from '@/types/patient';

export function PatientSessionItem({
  session,
  patient,
  selected,
  onClick,
}: {
  session: ChatSession;
  patient?: Patient;
  selected: boolean;
  onClick: () => void;
}) {
  const name = patient
    ? `${patient.firstname} ${patient.surname}`
    : 'Unknown Patient';

  const initials = patient
    ? `${patient.firstname[0]}${patient.surname[0]}`
    : '??';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 border-b cursor-pointer ${
        selected ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
        {initials}
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium text-sm">{name}</p>
          <span className="text-xs text-gray-400">
            {session.last_message_at.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          {patient?.contact || 'No contact info'}
        </p>
      </div>
    </div>
  );
}
