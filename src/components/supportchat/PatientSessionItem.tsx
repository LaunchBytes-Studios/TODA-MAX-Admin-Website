import type { ChatSessionWithPatient } from '@/types/chat';

interface PatientSessionItemProps {
  session: ChatSessionWithPatient;
  selected: boolean;
  onClick: () => void;
}

export function PatientSessionItem({
  session,
  selected,
  onClick,
}: PatientSessionItemProps) {
  const patient = session.patient;

  const name = patient
    ? `${patient.firstname} ${patient.surname}`
    : 'Unknown Patient';

  const initials = patient
    ? `${patient.firstname?.[0] ?? ''}${patient.surname?.[0] ?? ''}`
    : '??';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b
        ${selected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      {/* Avatar */}
      <div className="relative w-11 h-11 flex shrink-0">
        <div className="w-11 h-11 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center overflow-hidden">
          {patient?.avatar_url ? (
            <img
              src={patient.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Unread dot */}
        {session.has_unread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm truncate">{name}</p>

          <div className="flex items-center gap-2 shrink-0">
            {/* AI badge */}
            {session.chatbot_active && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                AI
              </span>
            )}

            {/* time */}
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              {new Date(session.last_message_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <p className="text-xs text-gray-500 truncate">
          {patient?.contact || 'No contact info'}
        </p>
      </div>
    </div>
  );
}
