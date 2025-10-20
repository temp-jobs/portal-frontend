'use client';

import React from 'react';
import { Grid } from '@mui/material';
import { useWallet } from '../../wallet/hooks/useWallet';
import WalletBalanceCard from '../../wallet/components/WalletBalanceCard';
import TransferFundsCard from '../../wallet/components/TransferFundsCard';
import TransactionHistory from '../../wallet/components/TransactionHistory';

const candidatesMock = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

const WalletPage: React.FC = () => {
  const { balance, transactions, loading, fetchWallet } = useWallet();

  return (
    <Grid container spacing={2} size={{ xs: 12 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <WalletBalanceCard balance={balance} refreshBalance={fetchWallet} />
        <TransferFundsCard candidates={candidatesMock} refreshBalance={fetchWallet} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <TransactionHistory transactions={transactions} />
      </Grid>
    </Grid>
  );
};

export default WalletPage;
