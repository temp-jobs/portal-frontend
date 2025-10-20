'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Stack, MenuItem } from '@mui/material';
import { transferFunds } from '../services/walletAPI';

interface TransferFundsCardProps {
  candidates: { id: string; name: string }[];
  refreshBalance: () => void;
}

const TransferFundsCard: React.FC<TransferFundsCardProps> = ({ candidates, refreshBalance }) => {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState<number | ''>(''); // allow empty string
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!receiverId || !amount || amount <= 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token')!;
      await transferFunds(receiverId, Number(amount) * 100, description, token); // convert to paise
      refreshBalance();
      alert('Payment successful');
      setAmount('');
      setDescription('');
      setReceiverId('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Pay Candidate</Typography>
        <Stack spacing={2}>
          <TextField
            select
            label="Select Candidate"
            value={receiverId}
            onChange={e => setReceiverId(e.target.value)}
          >
            {candidates.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Amount (₹)"
            value={amount === 0 ? '' : amount} // show empty input if 0
            onChange={e => {
              const val = e.target.value;
              setAmount(val === '' ? '' : parseFloat(val));
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Button variant="contained" onClick={handlePay} disabled={loading}>
            {loading ? 'Processing...' : 'Pay'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TransferFundsCard;
