'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Typography, List, ListItem, ListItemText, TextField, Button, Box, Paper,
} from '@mui/material';
import { useSocket } from '../../contexts/SocketContext';
import { useAuthContext } from '../../contexts/AuthContext';

interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
}

const ChatPage = () => {
  const socket = useSocket(); // ✅ FIXED
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit('joinRoom', user._id);

    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('message', handleMessage);
    return () => { socket.off('message', handleMessage); }
  }, [socket, user?._id]);

  const handleSend = () => {
    if (!newMessage.trim() || !socket || !user) return;
    socket.emit('sendMessage', { content: newMessage });
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography>You must be logged in to use chat.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Real-time Chat
      </Typography>
      <Paper sx={{ height: 400, overflowY: 'auto', p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg._id}
              sx={{
                justifyContent: msg.from === user._id ? 'flex-end' : 'flex-start',
              }}
            >
              <ListItemText
                primary={msg.content}
                secondary={new Date(msg.createdAt).toLocaleTimeString()}
                sx={{
                  maxWidth: '70%',
                  bgcolor: msg.from === user._id ? 'primary.main' : 'grey.300',
                  color: msg.from === user._id ? 'white' : 'black',
                  borderRadius: 2,
                  p: 1,
                }}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ChatPage;
