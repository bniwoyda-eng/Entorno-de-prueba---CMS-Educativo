// src/chat/stores/useChatSocketStore.ts
import { create } from "zustand";
import { IChatMessage } from "../types/chats.types";

interface ChatSocketState {
  notification: boolean;
  setNotification: (value: boolean) => void;
  receivedMessage: IChatMessage | null;
  onlineEducators: string[];
  addMessage: (message: IChatMessage) => void;
  setOnlineEducators: (ids: string[]) => void;
  clearMessages: () => void;

  
}

export const useChatSocketStore = create<ChatSocketState>((set) => ({
  notification: false,
  receivedMessage: null,
  onlineEducators: [],
  lastChatMessage: null,
  addMessage: (message) =>
    set(() => ({
      receivedMessage: message,
      notification: true,
    })),
  setOnlineEducators: (ids) =>
    set(() => ({
      onlineEducators: ids,
    })),
  clearMessages: () =>
    set(() => ({
      receivedMessage: null,
      onlineEducators: [],
    })),
  setNotification: (value) =>
    set(() => ({
      notification: value,
    })),
}));
