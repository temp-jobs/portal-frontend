'use client';
import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Stack } from '@mui/material';
import { topUpWallet } from '../services/walletAPI';

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  refreshBalance: () => void;
}

// Function to dynamically load Razorpay checkout script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);

    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const TopUpModal: React.FC<TopUpModalProps> = ({ open, onClose, refreshBalance }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    if (amount <= 0) return;
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token')!;
      const order = await topUpWallet(amount, token);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        amount: order.amount,
        currency: 'INR',
        name: 'PartTimeMatch',
        order_id: order.id,
        handler: async function (response: any) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/payment/success`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });

          refreshBalance();
          onClose();
          alert('Top-up successful!');
        },
        prefill: { email: localStorage.getItem('email') || '' },
        theme: { color: '#1A3450' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  if (typeof window === 'undefined') return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          width: { xs: 300, sm: 400 },
        }}
      >
        <Typography variant="h6" mb={2}>
          Add Funds
        </Typography>
        <Stack spacing={2}>
          <TextField
            type="number"
            label="Amount (₹)"
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
          <Button variant="contained" onClick={handleTopUp} disabled={loading}>
            {loading ? 'Processing...' : 'Pay'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TopUpModal;
