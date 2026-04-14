import { useEffect, useState } from 'react';
import type { ChatSessionWithPatient, Message } from '@/types/chat';
import { PatientChatArea } from '@/components/supportchat/PatientChatArea';
import { SessionsSidebar } from '@/components/supportchat/SessionsSidebar';
import { useGetChatSessions } from '@/hooks/supportchat/useChatSessionsWithPatients';
import { useFetchMessages } from '@/hooks/supportchat/useFetchMessages';
import { useSendMessage } from '@/hooks/supportchat/useSendMessage';

export function SupportPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSessionWithPatient[]>(
    [],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<ChatSessionWithPatient>(chatSessions[0] ?? null);
  const [botActive, setBotActive] = useState(
    selectedSession?.chatbot_active ?? false,
  );
  const [messageInput, setMessageInput] = useState('');

  const { getChatSessions, loading } = useGetChatSessions();
  const { getMessages, loading: messagesLoading } = useFetchMessages();
  const { sendMessage, loading: sending } = useSendMessage();

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await getChatSessions();
      if (res.success) {
        setChatSessions(res.data ?? []);
        if (res.data && res.data.length > 0) {
          setSelectedSession(res.data[0]);
          setBotActive(res.data[0].chatbot_active);
        }
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSession?.chat_id) return;

      const res = await getMessages(selectedSession.chat_id);
      if (res.success) {
        setMessages(res.data ?? []);
        setBotActive(selectedSession.chatbot_active);
      }
    };

    fetchMessages();
  }, [selectedSession]);

  const handleSessionSelect = (session: ChatSessionWithPatient) => {
    setShowDetails(false);
    setSelectedSession(session);
    setBotActive(session.chatbot_active);
    console.log('Selected session:', session);
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedSession) return;

    const res = await sendMessage(selectedSession.chat_id, messageInput);

    if (res.success) {
      setMessages((prev) => [...prev, res.data as Message]);
      setMessageInput('');
    }
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
        {loading ? (
          <div className="w-1/3 border flex flex-col bg-white rounded-xl shadow-lg items-center justify-center">
            <p className="text-gray-500">Loading sessions...</p>
          </div>
        ) : (
          <SessionsSidebar
            chatSessions={chatSessions}
            selectedSession={selectedSession}
            onSessionSelect={handleSessionSelect}
          />
        )}

        {/* Chat Area */}
        <PatientChatArea
          selectedPatient={selectedSession?.patient ?? null}
          messages={messages}
          showDetails={showDetails}
          botActive={botActive}
          setShowDetails={setShowDetails}
          setBotActive={setBotActive}
          loading={messagesLoading}
          input={messageInput}
          setInput={setMessageInput}
          sending={sending}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
}
