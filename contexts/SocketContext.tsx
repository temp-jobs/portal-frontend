'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token } = useAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }

    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token }, // JWT for backend
      transports: ['websocket'],
    });

    socketIo.on('connect', () => {
      console.log('Socket connected:', socketIo.id);
    });

    socketIo.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
