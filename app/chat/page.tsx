'use client';

import ChatPage from './ChatPage';
import { useSearchParams } from 'next/navigation';

const ChatRoute = () => {
  const searchParams = useSearchParams();
  const chatPartnerId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');
  const chatPartnerName = searchParams.get('userName'); // new

  if (!chatPartnerId || !chatId) {
    return <div>Missing chat parameters</div>;
  }

  return <ChatPage chatPartnerId={chatPartnerId} chatPartnerName={chatPartnerName || ''} chatId={chatId} />;
};


export default ChatRoute;
