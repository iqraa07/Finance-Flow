import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Mock transaction data for demo
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly Salary',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    type: 'expense',
    amount: -1500,
    category: 'Housing',
    description: 'Rent Payment',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    type: 'expense',
    amount: -200,
    category: 'Food',
    description: 'Grocery Shopping',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    type: 'expense',
    amount: -100,
    category: 'Transportation',
    description: 'Fuel',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    type: 'income',
    amount: 1000,
    category: 'Investment',
    description: 'Stock Dividends',
    date: new Date().toISOString()
  }
];

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  });

  useEffect(() => {
    if (!user) return;

    // Simulate API call delay
    const timer = setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      
      // Calculate statistics
      const totalBalance = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const monthlyTransactions = MOCK_TRANSACTIONS.filter(
        (t) => new Date(t.date) >= startOfMonth
      );
      
      const monthlyIncome = monthlyTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthlyExpenses = Math.abs(
        monthlyTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0)
      );

      setStats({
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
      });
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const refetch = () => {
    setLoading(true);
    // Re-fetch mock data
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 500);
  };

  return {
    transactions,
    loading,
    stats,
    refetch,
  };
};