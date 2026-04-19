import { useEffect, useState, useRef } from 'react';
import type { ChatSessionWithPatient, Message } from '@/types/chat';
import { PatientChatArea } from '@/components/supportchat/PatientChatArea';
import { SessionsSidebar } from '@/components/supportchat/SessionsSidebar';
import { useGetChatSessions } from '@/hooks/supportchat/useChatSessionsWithPatients';
import { useFetchMessages } from '@/hooks/supportchat/useFetchMessages';
import { useSendMessage } from '@/hooks/supportchat/useSendMessage';
import { SupportChatSkeleton } from '@/components/skeleton/SupportChatSkeleton';
import { supabase } from '@/lib/supabaseClient';
import { useToggleChatbot } from '@/hooks/supportchat/useToggleChatbot';
import { eventBus } from '@/utils/eventBus';
import { useNotifications } from '@/contexts/NotificationContext';
import { useHydrateChatSession } from '@/hooks/supportchat/useHydrateChatSession';

type SessionChangePayload = {
  new: ChatSessionWithPatient | null;
  old: ChatSessionWithPatient | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export function SupportPage() {
  const { resetChats, syncUnreadChats } = useNotifications();
  const [showDetails, setShowDetails] = useState(false);

  const [chatSessions, setChatSessions] = useState<ChatSessionWithPatient[]>(
    [],
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<ChatSessionWithPatient | null>(null);

  const selectedSessionRef = useRef<ChatSessionWithPatient | null>(null);

  const { toggleChatbot } = useToggleChatbot();
  const [botActive, setBotActive] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const { getMessages, loading: messagesLoading } = useFetchMessages();
  const { getChatSessions, loading } = useGetChatSessions();
  const { sendMessage, loading: sending } = useSendMessage();
  const { hydrateChatSession } = useHydrateChatSession();

  useEffect(() => {
    selectedSessionRef.current = selectedSession;
  }, [selectedSession]);

  const markAsRead = async (chatId: string) => {
    await supabase
      .from('ChatSession')
      .update({ last_read_at: new Date().toISOString() })
      .eq('chat_id', chatId);

    setChatSessions((prev) => {
      const updated = prev.map((s) =>
        s.chat_id === chatId ? { ...s, has_unread: false, unread_count: 0 } : s,
      );
      return updated;
    });

    setTimeout(() => {
      syncUnreadChats();
    }, 500);
  };

  useEffect(() => {
    resetChats();
    const fetchSessions = async () => {
      const res = await getChatSessions();

      if (res.success) {
        const sessions = (res.data ?? []).map((s: ChatSessionWithPatient) => ({
          ...s,
          has_unread: s.unread_count > 0,
        }));

        setChatSessions(sessions);
        syncUnreadChats();

        if (sessions.length > 0) {
          setSelectedSession(sessions[0]);
          setBotActive(sessions[0].chatbot_active);

          if (sessions[0].has_unread) {
            markAsRead(sessions[0].chat_id);
          }
        }
      }
    };

    fetchSessions();
    syncUnreadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;

    const fetchMessages = async () => {
      if (!selectedSession?.chat_id) return;

      const res = await getMessages(selectedSession.chat_id);

      if (!alive) return;

      if (res.success) {
        setMessages(res.data ?? []);
      }
    };

    fetchMessages();

    if (selectedSession?.chat_id) {
      markAsRead(selectedSession.chat_id);
    }

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession?.chat_id]);

  useEffect(() => {
    const unsubscribe = eventBus.on('chat:new-message', (msg: Message) => {
      setChatSessions((prev) => {
        const activeId = selectedSessionRef.current?.chat_id;

        const updated = prev.map((session) => {
          if (session.chat_id !== msg.chat_id) return session;

          if (msg.role !== 'patient') return session;

          const isActive = session.chat_id === activeId;

          return {
            ...session,
            has_unread: !isActive,
            unread_count: isActive ? 0 : (session.unread_count || 0) + 1, // Add this line
          };
        });

        return [...updated].sort(
          (a, b) =>
            new Date(b.last_message_at).getTime() -
            new Date(a.last_message_at).getTime(),
        );
      });

      // Mark as read immediately if message is for active session
      if (
        msg.chat_id === selectedSessionRef.current?.chat_id &&
        msg.role === 'patient'
      ) {
        supabase
          .from('ChatSession')
          .update({ last_read_at: new Date().toISOString() })
          .eq('chat_id', msg.chat_id);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!selectedSession?.chat_id) return;

    const channel = supabase
      .channel(`chat:${selectedSession.chat_id}`)
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
              (m) => m.message_id === newMessage.message_id,
            );

            return exists ? prev : [...prev, newMessage];
          });

          setChatSessions((prev) =>
            prev.map((s) =>
              s.chat_id === selectedSession.chat_id
                ? { ...s, has_unread: false, unread_count: 0 }
                : s,
            ),
          );
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ChatSession',
          filter: `chat_id=eq.${selectedSession.chat_id}`,
        },
        (payload) => {
          const updated = payload.new as ChatSessionWithPatient;

          setBotActive(updated.chatbot_active);

          setChatSessions((prev) =>
            prev.map((s) =>
              s.chat_id === updated.chat_id
                ? { ...s, chatbot_active: updated.chatbot_active }
                : s,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession?.chat_id]);

  useEffect(() => {
    const unsubscribe = eventBus.on(
      'chat:session-change',
      async (payload: SessionChangePayload) => {
        const { eventType, new: session, old } = payload;

        if (eventType === 'INSERT' && session) {
          const res = await hydrateChatSession(session.chat_id);

          if (!res.success || !res.data) return;

          const fullSession = res.data;

          setChatSessions((prev) => {
            const updated = [
              {
                ...fullSession,
                has_unread: true,
              },
              ...prev,
            ];

            return updated.sort(
              (a, b) =>
                new Date(b.last_message_at).getTime() -
                new Date(a.last_message_at).getTime(),
            );
          });

          return;
        }

        if (eventType === 'UPDATE' && session) {
          setChatSessions((prev) => {
            const updated = prev.map((s) =>
              s.chat_id === session.chat_id
                ? {
                    ...s,
                    chatbot_active: session.chatbot_active,
                    last_message_at: session.last_message_at,
                    patient: session.patient ?? s.patient,
                  }
                : s,
            );

            return updated.sort(
              (a, b) =>
                new Date(b.last_message_at).getTime() -
                new Date(a.last_message_at).getTime(),
            );
          });

          return;
        }

        if (eventType === 'DELETE' && old) {
          setChatSessions((prev) =>
            prev.filter((s) => s.chat_id !== old.chat_id),
          );

          if (selectedSessionRef.current?.chat_id === old.chat_id) {
            setSelectedSession(null);
            setMessages([]);
            setBotActive(false);
          }

          return;
        }
      },
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSessionSelect = async (session: ChatSessionWithPatient) => {
    setShowDetails(false);
    setSelectedSession(session);

    const latest = chatSessions.find((s) => s.chat_id === session.chat_id);

    if (latest) {
      setBotActive(latest.chatbot_active);
    }

    setChatSessions((prev) =>
      prev.map((s) =>
        s.chat_id === session.chat_id ? { ...s, has_unread: false } : s,
      ),
    );
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

    setBotActive(value);

    const res = await toggleChatbot(selectedSession.chat_id, value);

    if (!res.success) {
      setBotActive(!value);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col p-4 gap-4 bg-gray-50">
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
          <SessionsSidebar
            chatSessions={chatSessions}
            selectedSession={selectedSession}
            onSessionSelect={handleSessionSelect}
          />

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
