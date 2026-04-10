export interface ChatSession {
  chat_id: string;
  patient_id: string;
  started_at: Date;
  last_message_at: Date;
  language: string;
  chat_bot_active: boolean;
}

export interface Message {
  message_id: string;
  chat_id: string;
  sender_id: string;
  role: 'patient' | 'enav' | 'chatbot';
  content: string;
  created_at: string;
}
