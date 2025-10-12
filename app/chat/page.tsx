import ChatPage from './ChatPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function ChatClient() {
  return <ChatPage />; // ✅ Client-only logic lives inside this
}
