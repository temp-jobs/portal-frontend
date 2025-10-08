import './globals.css';
import { ReactNode } from 'react';
import ThemeRegistry from '../components/ThemeRegistry';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';

export const metadata = {
  title: 'Job Portal',
  description: 'Part-time job platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <SocketProvider>{children}</SocketProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}