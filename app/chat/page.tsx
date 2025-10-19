'use client';

import { Suspense } from 'react';
import ChatPage from './ChatPage';
import { useSearchParams } from 'next/navigation';

function ChatContent() {
  const searchParams = useSearchParams();
  const chatPartnerId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');
  const chatPartnerName = searchParams.get('userName');

  if (!chatPartnerId || !chatId) {
    return <div>Missing chat parameters</div>;
  }

  return (
    <ChatPage
      chatPartnerId={chatPartnerId}
      chatPartnerName={chatPartnerName || ''}
      chatId={chatId}
    />
  );
}

export default function ChatRoute() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
