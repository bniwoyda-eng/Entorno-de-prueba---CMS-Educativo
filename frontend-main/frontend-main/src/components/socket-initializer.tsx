// src/shared/components/SocketInitializer.tsx
import { useSocket } from '../hooks/useSocket';

export const SocketInitializer = () => {
  useSocket(); // Esto establece la conexión WebSocket al montar la app
  return null;
};
