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
import { GoogleOAuthProvider } from '@react-oauth/google';
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
                {/* Wrap with GoogleOAuthProvider */}
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                  <Header />
                  <NavigationEvents />
                  <main style={{ minHeight: '80vh' }}>{children}</main>
                  <Footer />
                </GoogleOAuthProvider>
              </NavigationProvider>
            </SocketProvider>
          </AuthProvider>
        </ColorModeProvider>
      </body>
    </html>
  );
}
