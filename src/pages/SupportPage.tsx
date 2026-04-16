import { useEffect, useState } from 'react';
import type { ChatSessionWithPatient, Message } from '@/types/chat';
import { PatientChatArea } from '@/components/supportchat/PatientChatArea';
import { SessionsSidebar } from '@/components/supportchat/SessionsSidebar';
import { useGetChatSessions } from '@/hooks/supportchat/useChatSessionsWithPatients';
import { useFetchMessages } from '@/hooks/supportchat/useFetchMessages';
import { useSendMessage } from '@/hooks/supportchat/useSendMessage';
import { SupportChatSkeleton } from '@/components/skeleton/SupportChatSkeleton';
import { supabase } from '@/lib/supabaseClient';
import { useToggleChatbot } from '@/hooks/supportchat/useToggleChatbot';
import { useNotifications } from '@/contexts/NotificationContext';

export function SupportPage() {
  const { resetChats } = useNotifications();
  const [showDetails, setShowDetails] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSessionWithPatient[]>(
    [],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<ChatSessionWithPatient | null>(null);
  const { toggleChatbot } = useToggleChatbot();
  const [botActive, setBotActive] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const { getMessages, loading: messagesLoading } = useFetchMessages();
  const { getChatSessions, loading } = useGetChatSessions();
  const { sendMessage, loading: sending } = useSendMessage();

  useEffect(() => {
    resetChats();
    const fetchSessions = async () => {
      const res = await getChatSessions();
      if (res.success) {
        const sessions = res.data ?? [];
        setChatSessions(sessions);

        if (sessions.length > 0) {
          setSelectedSession(sessions[0]);
          setBotActive(sessions[0].chatbot_active);
        }
      }
    };

    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!selectedSession?.chat_id) return;

      setMessages([]);

      const res = await getMessages(selectedSession.chat_id);

      if (!isMounted) return;

      if (res.success) {
        setMessages(res.data ?? []);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedSession?.chat_id) return;

    const channel = supabase
      .channel(`chat-${selectedSession.chat_id}`)

      // MESSAGES
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ChatMessages',
          filter: `chat_id=eq.${selectedSession.chat_id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;

          setMessages((prev) => {
            const exists = prev.some(
              (msg) => msg.message_id === newMessage.message_id,
            );
            if (exists) return prev;

            return [...prev, newMessage];
          });
        },
      )
      // CHATBOT TOGGLE
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ChatSession',
          filter: `chat_id=eq.${selectedSession.chat_id}`,
        },
        (payload) => {
          const updatedSession = payload.new as ChatSessionWithPatient;

          if (!isToggling) {
            setBotActive(updatedSession.chatbot_active);
          }

          setChatSessions((prev) =>
            prev.map((s) =>
              s.chat_id === updatedSession.chat_id
                ? { ...s, chatbot_active: updatedSession.chatbot_active }
                : s,
            ),
          );
        },
      )

      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  const handleSessionSelect = (session: ChatSessionWithPatient) => {
    setShowDetails(false);
    setSelectedSession(session);
    setBotActive(session.chatbot_active);
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedSession) return;

    const res = await sendMessage(selectedSession.chat_id, messageInput);

    if (res.success) {
      setMessageInput('');
    }
  };

  const handleToggleBot = async (value: boolean) => {
    if (!selectedSession) return;

    setIsToggling(true);
    setBotActive(value);

    const res = await toggleChatbot(selectedSession.chat_id, value);
    setIsToggling(false);

    if (!res.success) {
      setBotActive(!value);
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

      {loading ? (
        <SupportChatSkeleton />
      ) : (
        <div className="flex flex-1 gap-6 min-h-0">
          {/* Sidebar */}
          <SessionsSidebar
            chatSessions={chatSessions}
            selectedSession={selectedSession}
            onSessionSelect={handleSessionSelect}
          />

          {/* Chat Area */}
          <PatientChatArea
            selectedPatient={selectedSession?.patient ?? null}
            messages={messages}
            showDetails={showDetails}
            botActive={botActive}
            setShowDetails={setShowDetails}
            setBotActive={handleToggleBot}
            loading={messagesLoading}
            input={messageInput}
            setInput={setMessageInput}
            sending={sending}
            handleSend={handleSend}
          />
        </div>
      )}
    </div>
  );
}
