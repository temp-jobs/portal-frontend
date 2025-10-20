'use client';

import { useEffect, useState } from 'react';
import { getWallet, getTransactions, Transaction, WalletResponse } from '../services/walletAPI';

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const wallet: WalletResponse = await getWallet();
      setBalance(wallet.balance);
      const tx: Transaction[] = await getTransactions();
      setTransactions(tx);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchWallet();
    }
  }, []);

  return { balance, transactions, loading, fetchWallet, setBalance, setTransactions };
};
