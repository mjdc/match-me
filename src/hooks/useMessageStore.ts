import { MessageDto, ClientMessage } from '@/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type MessageState = {
  messages: (MessageDto | ClientMessage)[];
  unreadCount: number;

  // For server-provided messages
  add: (message: MessageDto) => void;

  // For optimistic/pending messages
  addMessage: (message: ClientMessage) => void;
  replaceMessage: (sent: string, newMsg: ClientMessage) => void;
  markFailed: (sent: string) => void;

  remove: (id: string) => void;
  set: (messages: MessageDto[]) => void;
  updateUnreadCount: (amount: number) => void;
  resetMessages: () => void;
};

const useMessageStore = create<MessageState>()(
  devtools((set) => ({
    messages: [],
    unreadCount: 0,

    add: (message) =>
      set((state) => ({ messages: [message, ...state.messages] })),

    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),

    replaceMessage: (sent, newMsg) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          "sent" in m && m.sent === sent
            ? newMsg
            : m
        ),
      })),

    markFailed: (sent) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          "sent" in m && m.sent === sent
            ? { ...m, pending: false, error: true }
            : m
        ),
      })),

    remove: (id) =>
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      })),

    set: (messages) =>
      set((state) => {
        const map = new Map(
          [...state.messages, ...messages].map((m) => [m.id, m])
        );
        return { messages: Array.from(map.values()) };
      }),

    updateUnreadCount: (amount) =>
      set((state) => ({ unreadCount: state.unreadCount + amount })),

    resetMessages: () => set({ messages: [] }),
  }), { name: 'messageStoreDemo' })
);

export default useMessageStore;
