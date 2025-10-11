'use client';

import './globals.css';
import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';


// export const metadata = {
//   title: 'Job Portal',
//   description: 'Part-time job platform',
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <SocketProvider>
              <Header />
              <main style={{ minHeight: '80vh' }}>{children}</main>
              <Footer />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}