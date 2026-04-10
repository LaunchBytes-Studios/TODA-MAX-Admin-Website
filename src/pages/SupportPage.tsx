import { useState } from 'react';
import { ChatBotToggle } from '@/components/supportchat/ChatBotToggle';
import type { ChatSession, Message } from '@/types/chat';
import { ChatMessage } from '@/components/supportchat/ChatMessage';
import { ChevronDown } from 'lucide-react';
import type { Patient } from '@/types/patient';
import { PatientSessionItem } from '@/components/supportchat/PatientSessionItem';

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
                  onClick={() => {
                    setSelectedSession(session);
                    setBotActive(session.chat_bot_active);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
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
                  onClick={() => setShowDetails((p) => !p)}
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
                onToggle={() => setBotActive((p) => !p)}
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
      </div>
    </div>
  );
}
