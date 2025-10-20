import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => localStorage.getItem('token') || '';

export interface WalletResponse {
  balance: number; // in paise
}

export interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export const getWallet = async (): Promise<WalletResponse> => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/wallet`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const topUpWallet = async (amount: number, token: string): Promise<any> => {
  token = getToken();
  const res = await axios.post(
    `${API_URL}/wallet/topup`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const transferFunds = async (
receiverId: string, amount: number, description: string, token: string) => {
  token = getToken();
  const res = await axios.post(
    `${API_URL}/wallet/transfer`,
    { receiverId, amount, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/wallet/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
