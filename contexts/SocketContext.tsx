'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (token) {
      const socketIo = io(SOCKET_URL || '', {
        auth: { token },
        autoConnect: false,
      });
      socketIo.connect();
      setSocket(socketIo);

      return () => {
        socketIo.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [token]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};