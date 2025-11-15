import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Calendar, ArrowUp, ArrowDown, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import NewTransactionModal from '../components/NewTransactionModal';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

interface TransactionFilters {
  startDate: string;
  endDate: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  minAmount: string;
  maxAmount: string;
}

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<TransactionFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', filters.startDate)
        .lte('date', filters.endDate);

      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.minAmount) {
        query = query.gte('amount', Number(filters.minAmount));
      }

      if (filters.maxAmount) {
        query = query.lte('amount', Number(filters.maxAmount));
      }

      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, filters, sortField, sortDirection]);

  const handleSort = (field: 'date' | 'amount' | 'category') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      // Format data for CSV
      const csvData = transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Type: t.type,
        Category: t.category,
        Description: t.description,
        Amount: t.amount.toFixed(2)
      }));

      // Create CSV content
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csvContent = `${headers}\n${rows.join('\n')}`;

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Transactions exported successfully!');
    } catch (err: any) {
      setError('Failed to export transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.amount > 0) {
        acc.income += t.amount;
      } else {
        acc.expenses += Math.abs(t.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Transactions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Transaction</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-4 flex items-center space-x-2">
          <Check size={20} />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="text-sm text-gray-400">Total Income</div>
          <div className="text-2xl font-bold text-green-500 mt-1">
            ${totals.income.toFixed(2)}
          </div>
        </div>
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="text-sm text-gray-400">Total Expenses</div>
          <div className="text-2xl font-bold text-red-500 mt-1">
            ${totals.expenses.toFixed(2)}
          </div>
        </div>
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="text-sm text-gray-400">Net Balance</div>
          <div className={`text-2xl font-bold mt-1 ${
            totals.income - totals.expenses >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            ${(totals.income - totals.expenses).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-navy-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white hover:bg-navy-700 transition-colors"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white hover:bg-navy-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-navy-900 rounded-lg border border-navy-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Housing">Housing</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Food">Food</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Salary">Salary</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-navy-700">
                <th className="text-left py-4 px-4 cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center space-x-2">
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-4">Description</th>
                <th className="text-left py-4 px-4 cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center space-x-2">
                    <span>Category</span>
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                    )}
                  </div>
                </th>
                <th className="text-right py-4 px-4 cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center justify-end space-x-2">
                    <span>Amount</span>
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-navy-700 hover:bg-navy-700 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-white">{transaction.description}</td>
                    <td className="py-4 px-4 text-gray-300">{transaction.category}</td>
                    <td className={`py-4 px-4 text-right font-medium ${
                      transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center text-gray-400">
          <div>Showing {filteredTransactions.length} transactions</div>
        </div>
      </div>

      <NewTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          fetchTransactions();
          showSuccess('Transaction created successfully!');
        }}
      />
    </div>
  );
};

export default Transactions;