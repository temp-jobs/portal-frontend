'use client';

import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { useSocketContext } from '../../contexts/SocketContext';
import { useAuthContext } from '../../contexts/AuthContext';

interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
}

const ChatPage = () => {
  const { socket } = useSocketContext();
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', user?._id);

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket, user]);

  const handleSend = () => {
    if (!newMessage.trim() || !socket || !user) return;
    socket.emit('sendMessage', { content: newMessage, to: null }); // to: null for broadcast or implement user selection
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
      <Paper
        sx={{
          height: 400,
          overflowY: 'auto',
          p: 2,
          mb: 2,
          bgcolor: '#f5f5f5',
        }}
      >
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default ChatPage;