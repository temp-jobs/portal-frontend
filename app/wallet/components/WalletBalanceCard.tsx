'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import TopUpModal from './TopUpModal';

interface WalletBalanceCardProps {
  balance: number;
  refreshBalance: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance, refreshBalance }) => {
  const [openTopUp, setOpenTopUp] = useState(false);

  return (
    <>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Wallet Balance</Typography>
            <Typography variant="h5">₹{(balance / 100).toFixed(2)}</Typography>
          </Stack>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => setOpenTopUp(true)}>
            Add Funds
          </Button>
        </CardContent>
      </Card>

      {openTopUp && <TopUpModal open={openTopUp} onClose={() => setOpenTopUp(false)} refreshBalance={refreshBalance} />}
    </>
  );
};

export default WalletBalanceCard;
