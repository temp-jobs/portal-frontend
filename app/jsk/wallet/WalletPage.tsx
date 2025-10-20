'use client';

import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useWallet } from '../../wallet/hooks/useWallet';
import WalletBalanceCard from '../../wallet/components/WalletBalanceCard';
import TransactionHistory from '../../wallet/components/TransactionHistory';
import TransferFundsCard from '../../wallet/components/TransferFundsCard';
import axios from 'axios';

const WalletPage: React.FC = () => {
  const { balance, transactions, loading, fetchWallet } = useWallet();
  const [candidates, setCandidates] = useState<{ id: string; name: string }[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/wallet/users/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Expected payload: [{ id: 'userId', name: 'User Name' }, ...]
        setCandidates(res.data);
      } catch (err) {
        console.error('Failed to fetch candidates', err);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <Grid container spacing={2} size={{ xs: 12 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <WalletBalanceCard balance={balance} refreshBalance={fetchWallet} />
        <TransferFundsCard candidates={candidates} refreshBalance={fetchWallet} />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <TransactionHistory transactions={transactions} />
      </Grid>
    </Grid>
  );
};

export default WalletPage;
