// src/shared/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore } from '../features/auth/auth.store';
import { useChatSocketStore } from '../features/educators/stores/useChatStocketStore';
import { IChatMessage } from '../features/educators/types/chats.types';
import { getEnvs } from '../config';

const { VITE_SOCKET_URL } = getEnvs();
const url = `${VITE_SOCKET_URL}/socket.io/socket.io.js`;

let socket: Socket;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { addMessage, setOnlineEducators } = useChatSocketStore();
  const token = useAuthStore.getState().token;
  if (!token) return;

  useEffect(() => {
    const manager = new Manager(url, {
      extraHeaders: {
        authentication: token
      }
    });

    socket = manager.socket('/');
    socket.connect();
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current = socket;

    // OK
    socket.on('clients-updated', (educatorIds: string[]) => {
      setOnlineEducators(educatorIds);
    });

    socket.on('new_message', (message: IChatMessage) => {
      addMessage(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return { socket: socketRef.current };
};
