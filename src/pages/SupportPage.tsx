import { useState } from 'react';
import type { ChatSession, Message } from '@/types/chat';
import type { Patient } from '@/types/patient';
import { PatientChatArea } from '@/components/supportchat/PatientChatArea';
import { SessionsSidebar } from '@/components/supportchat/SessionsSidebar';

/* =========================
   MOCK PATIENTS
========================= */
const patients: Patient[] = [
  {
    patientId: 'p1',
    contact: 'sarah.johnson@email.com',
    address: 'Quezon City',
    diagnosis: { diabetes: false, hypertension: true },
    birthday: new Date('1979-05-12'),
    firstname: 'Sarah',
    surname: 'Johnson',
    sex: 'female',
    philhealth_num: 'PH-10001',
    avatar_url: '',
  },
  {
    patientId: 'p2',
    contact: 'michael.chen@email.com',
    address: 'Manila',
    diagnosis: { diabetes: true, hypertension: false },
    birthday: new Date('1965-09-03'),
    firstname: 'Michael',
    surname: 'Chen',
    sex: 'male',
    philhealth_num: 'PH-10002',
    avatar_url: '',
  },
  {
    patientId: 'p3',
    contact: 'emily.rodriguez@email.com',
    address: 'Pasig City',
    diagnosis: { diabetes: true, hypertension: true },
    birthday: new Date('1992-01-20'),
    firstname: 'Emily',
    surname: 'Rodriguez',
    sex: 'female',
    philhealth_num: 'PH-10003',
    avatar_url: '',
  },
  {
    patientId: 'p4',
    contact: 'david.thompson@email.com',
    address: 'Makati',
    diagnosis: { diabetes: true, hypertension: false },
    birthday: new Date('1967-11-18'),
    firstname: 'David',
    surname: 'Thompson',
    sex: 'male',
    philhealth_num: 'PH-10004',
    avatar_url: '',
  },
  {
    patientId: 'p5',
    contact: 'lisa.martinez@email.com',
    address: 'Caloocan',
    diagnosis: { diabetes: true, hypertension: false },
    birthday: new Date('1983-07-09'),
    firstname: 'Lisa',
    surname: 'Martinez',
    sex: 'female',
    philhealth_num: 'PH-10005',
    avatar_url: '',
  },
];

/* =========================
   CHAT SESSIONS
========================= */
const chatSessions: ChatSession[] = [
  {
    chat_id: 'c1',
    patient_id: 'p1',
    started_at: new Date('2026-04-11T08:00:00'),
    last_message_at: new Date('2026-04-11T08:40:00'),
    language: 'en',
    chat_bot_active: true,
  },
  {
    chat_id: 'c2',
    patient_id: 'p2',
    started_at: new Date('2026-04-11T07:10:00'),
    last_message_at: new Date('2026-04-11T07:30:00'),
    language: 'en',
    chat_bot_active: true,
  },
  {
    chat_id: 'c3',
    patient_id: 'p3',
    started_at: new Date('2026-04-10T18:00:00'),
    last_message_at: new Date('2026-04-10T18:15:00'),
    language: 'en',
    chat_bot_active: false,
  },
  {
    chat_id: 'c4',
    patient_id: 'p4',
    started_at: new Date('2026-04-09T12:00:00'),
    last_message_at: new Date('2026-04-09T12:45:00'),
    language: 'en',
    chat_bot_active: false,
  },
  {
    chat_id: 'c5',
    patient_id: 'p5',
    started_at: new Date('2026-04-10T09:00:00'),
    last_message_at: new Date('2026-04-10T09:25:00'),
    language: 'en',
    chat_bot_active: true,
  },
];

/* =========================
   MESSAGES
========================= */
const messages: Message[] = [
  {
    message_id: 'm1',
    chat_id: 'c1',
    sender_id: 'p1',
    role: 'patient',
    content:
      'Hi doctor, I forgot to take my blood pressure medication this morning. Should I take it now?',
    created_at: '08:30:00',
  },
  {
    message_id: 'm2',
    chat_id: 'c1',
    sender_id: 'enav',
    role: 'enav',
    content:
      'Hello Sarah! Yes, you can take it now. Try to take it at the same time each day.',
    created_at: '08:35:00',
  },
  {
    message_id: 'm3',
    chat_id: 'c1',
    sender_id: 'p1',
    role: 'patient',
    content: 'Thank you! I will set a reminder on my phone.',
    created_at: '08:40:00',
  },
  {
    message_id: 'm4',
    chat_id: 'c2',
    sender_id: 'p2',
    role: 'patient',
    content: 'My sugar levels have been unstable lately.',
    created_at: '07:20:00',
  },
  {
    message_id: 'm5',
    chat_id: 'c2',
    sender_id: 'enav',
    role: 'enav',
    content: 'Please monitor your glucose levels and avoid high sugar intake.',
    created_at: '07:30:00',
  },
];

export function SupportPage() {
  const [showDetails, setShowDetails] = useState(false);

  const [selectedSession, setSelectedSession] = useState<ChatSession>(
    chatSessions[0],
  );

  const selectedPatient = patients.find(
    (p) => p.patientId === selectedSession.patient_id,
  );

  const [botActive, setBotActive] = useState(selectedSession.chat_bot_active);

  const filteredMessages = messages.filter(
    (m) => m.chat_id === selectedSession.chat_id,
  );

  const handleSessionSelect = (session: ChatSession) => {
    setShowDetails(false);
    setSelectedSession(session);
    setBotActive(session.chat_bot_active);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col p-4 gap-4 bg-gray-50">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Support Page</h1>
        <p className="text-sm text-gray-500">
          Communicate with patients in real-time
        </p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar */}
        <SessionsSidebar
          chatSessions={chatSessions}
          patients={patients}
          selectedSession={selectedSession}
          onSessionSelect={handleSessionSelect}
        />

        {/* Chat Area */}
        <PatientChatArea
          selectedPatient={selectedPatient}
          filteredMessages={filteredMessages}
          showDetails={showDetails}
          botActive={botActive}
          setShowDetails={setShowDetails}
          setBotActive={setBotActive}
        />
      </div>
    </div>
  );
}
