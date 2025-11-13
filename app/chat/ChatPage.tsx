'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Popover,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import { AttachFile, InsertEmoticon, ArrowBack } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';
import { useAuthContext } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Message {
  _id: string;
  from: string;
  to: string | null;
  content: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: { [emoji: string]: string[] };
}

interface ChatPageProps {
  chatPartnerId: string;
  chatPartnerName: string;
  chatPartnerAvatar?: string;
  chatId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ chatPartnerId, chatPartnerName, chatPartnerAvatar, chatId }) => {
  const { user, token } = useAuthContext();
  const socket = useSocket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch messages ---
  useEffect(() => {
    if (!user?.id || !chatPartnerId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const url = chatId
          ? `${process.env.NEXT_PUBLIC_API_URL}/messages?roomId=${chatId}&limit=50`
          : `${process.env.NEXT_PUBLIC_API_URL}/messages?userA=${user.id}&userB=${chatPartnerId}&limit=50`;

        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data.messages.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id, chatPartnerId, chatId, token]);

  // --- Socket listeners ---
  useEffect(() => {
    if (!socket || !user?.id) return;

    if (chatId) socket.emit('joinRoom', chatId);

    const handleMessage = (msg: Message) => {
      if (msg.from === user.id || msg.from === chatPartnerId || msg.to === user.id) {
        setMessages(prev => [...prev, msg]);
        // Auto-scroll only if user is near bottom
        const container = messagesContainerRef.current;
        if (container) {
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
          if (isNearBottom) {
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }
        }
      }
    };
    const handleTyping = (typingUserId: string) => {
      if (typingUserId === chatPartnerId) setIsTyping(true);
    };
    const handleStopTyping = (typingUserId: string) => {
      if (typingUserId === chatPartnerId) setIsTyping(false);
    };
    const handleReaction = (reactionData: { messageId: string; emoji: string; userId: string }) => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg._id === reactionData.messageId) {
            const reactions = msg.reactions ? { ...msg.reactions } : {};
            reactions[reactionData.emoji] = reactions[reactionData.emoji] || [];
            if (!reactions[reactionData.emoji].includes(reactionData.userId)) {
              reactions[reactionData.emoji].push(reactionData.userId);
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    socket.on('message', handleMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);
    socket.on('messageReaction', handleReaction);

    return () => {
      socket.off('message', handleMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
      socket.off('messageReaction', handleReaction);
    };
  }, [socket, user?.id, chatPartnerId, chatId]);

  // --- Scroll to bottom ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Emit typing ---
  useEffect(() => {
    if (!socket || !user?.id) return;
    if (!newMessage.trim()) socket.emit('stopTyping', chatPartnerId);
    else socket.emit('typing', chatPartnerId);
  }, [newMessage, socket, chatPartnerId, user?.id]);

  // --- Send message ---
  const handleSend = () => {
    if (!newMessage.trim() || !socket || !user?.id) return;
    const payload: any = { to: chatPartnerId, content: newMessage };
    if (chatId) payload.roomId = chatId;
    socket.emit('sendMessage', payload);
    setNewMessage('');
    socket.emit('stopTyping', chatPartnerId);
    // Always scroll to bottom after sending
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!socket || !user?.id) return;
    socket.emit('messageReaction', { messageId, emoji, userId: user.id });
  };

  const toggleEmojiPicker = (event: React.MouseEvent<HTMLElement>) =>
    setEmojiAnchor(emojiAnchor ? null : event.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);

  return (
    <DashboardLayout>
      <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column', p: isMobile ? 1 : 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {isMobile && <IconButton onClick={() => window.history.back()}><ArrowBack /></IconButton>}
          <Avatar src={chatPartnerAvatar} />
          <Typography variant="h6" sx={{ flex: 1 }}>{chatPartnerName}</Typography>
          {isTyping && <Typography variant="caption" color="gray" sx={{ fontStyle: 'italic' }}>Typing...</Typography>}
        </Stack>

        {/* Messages */}
        <Paper
          ref={messagesContainerRef}
          sx={{
            flex: 1, // takes all remaining space
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            bgcolor: '#f9fafb',
            borderRadius: 2,
            minHeight: 0, // important for flex scrolling
          }}
        >
          <AnimatePresence initial={false}>
            {loading ? (
              <Typography variant="body2" color="textSecondary">Loading messages...</Typography>
            ) : messages.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No messages yet.</Typography>
            ) : messages.map(msg => {
              const isSelf = msg.from === user?.id;
              return (
                <motion.div key={msg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: isSelf ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1 }}>
                    {!isSelf && <Avatar src={chatPartnerAvatar} sx={{ width: 28, height: 28 }} />}
                    <Box sx={{ position: 'relative', maxWidth: '70%' }}>
                      <Box
                        sx={{
                          bgcolor: isSelf ? '#1A3450FF' : '#AFAFCAFF',
                          color: isSelf ? 'white' : 'black',
                          borderRadius: 2,
                          borderTopLeftRadius: isSelf ? 12 : 0,
                          borderTopRightRadius: isSelf ? 0 : 12,
                          p: 1,
                          wordBreak: 'break-word',
                          boxShadow: 1,
                          cursor: 'pointer'
                        }}
                        /* onClick={() => {
                          const emoji = prompt('React with emoji:');
                          if (emoji) handleAddReaction(msg._id, emoji);
                        }} */
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: isSelf ? 'rgba(255,255,255,0.7)' : 'gray' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>

                      {/* Reactions */}
                      {msg.reactions && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <Box key={emoji} sx={{ px: 0.5, py: 0.2, bgcolor: '#eee', borderRadius: 1, fontSize: 12 }}>
                              {emoji} {users.length}
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>
                    {isSelf && <Avatar src={user?.avatar} sx={{ width: 28, height: 28 }} />}
                  </Box>
                </motion.div>
              );
            })}

          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Paper>

        {/* Input */}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton color="primary" title="Attach file"><AttachFile /></IconButton>
          <IconButton color="primary" onClick={toggleEmojiPicker} title="Add emoji"><InsertEmoticon /></IconButton>
          <Popover
            open={Boolean(emojiAnchor)}
            anchorEl={emojiAnchor}
            onClose={closeEmojiPicker}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <EmojiPicker onEmojiClick={emojiData => { setNewMessage(prev => prev + emojiData.emoji); closeEmojiPicker(); }} />
          </Popover>

          <TextField
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Box>
      </Box>

    </DashboardLayout>
  );
};

export default ChatPage;
