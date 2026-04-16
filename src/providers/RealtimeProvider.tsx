import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { eventBus } from '@/utils/eventBus';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // =========================
    // ORDERS
    // =========================
    const ordersChannel = supabase
      .channel('global:orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Order' },
        (payload) => {
          eventBus.emit('order:new', payload.new);
        },
      )
      .subscribe();

    // =========================
    // CHAT MESSAGES
    // =========================
    const chatMessagesChannel = supabase
      .channel('global:chat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ChatMessages' },
        (payload) => {
          eventBus.emit('chat:new-message', payload.new);
        },
      )
      .subscribe();

    // =========================
    // CHAT SESSION UPDATES
    // =========================
    const chatSessionChannel = supabase
      .channel('global:chat-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ChatSession' },
        (payload) => {
          console.log('New Chat Session Update', {
            new: payload.new,
            old: payload.old,
            eventType: payload.eventType,
          });
          eventBus.emit('chat:session-change', {
            new: payload.new,
            old: payload.old,
            eventType: payload.eventType,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(chatMessagesChannel);
      supabase.removeChannel(chatSessionChannel);
    };
  }, []);

  return children;
}
