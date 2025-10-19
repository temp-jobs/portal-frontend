'use client';

import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import NavigationEvents from '../components/NavigationEvents';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ColorModeProvider } from '../contexts/ColorModeContext';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ColorModeProvider>
          <AuthProvider>
            <SocketProvider>
              <NavigationProvider>
                <Header />
                <NavigationEvents />
                <main style={{ minHeight: '80vh' }}>{children}</main>
                <Footer />
              </NavigationProvider>
            </SocketProvider>
          </AuthProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
