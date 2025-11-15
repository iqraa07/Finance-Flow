import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Mail, Clock, Filter, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ReportFilter {
  startDate: string;
  endDate: string;
  type: 'all' | 'income' | 'expense';
  category: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

const Reports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('income-statement');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilter>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'all',
    category: 'all',
  });

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const reports = [
    {
      id: 'income-statement',
      name: 'Income Statement',
      description: 'Detailed view of income and expenses',
      lastGenerated: new Date().toLocaleDateString(),
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Overview of assets, liabilities, and equity',
      lastGenerated: new Date().toLocaleDateString(),
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Track cash movements and liquidity',
      lastGenerated: new Date().toLocaleDateString(),
    },
    {
      id: 'transaction-history',
      name: 'Transaction History',
      description: 'Detailed list of all transactions',
      lastGenerated: new Date().toLocaleDateString(),
    },
  ];

  // Fetch transactions based on filters
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', filters.startDate)
        .lte('date', filters.endDate)
        .order('date', { ascending: false });

      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters, user]);

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
      link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess('Report exported successfully!');
    } catch (err: any) {
      setError('Failed to export report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailReport = async () => {
    try {
      setLoading(true);
      // In a real application, you would send this to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showSuccess('Report has been sent to your email!');
    } catch (err: any) {
      setError('Failed to email report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
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
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Financial Reports</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleEmailReport}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-navy-800 rounded-lg text-white hover:bg-navy-700 disabled:opacity-50"
          >
            <Mail size={20} />
            <span>Email Report</span>
          </button>
          <button 
            onClick={handleExport}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={20} />
            <span>{loading ? 'Generating...' : 'Export Report'}</span>
          </button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-navy-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Report Filters</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Transaction Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white"
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
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Income</div>
              <div className="text-xl font-bold text-green-500">
                ${totals.income.toFixed(2)}
              </div>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total Expenses</div>
              <div className="text-xl font-bold text-red-500">
                ${totals.expenses.toFixed(2)}
              </div>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4 col-span-2">
              <div className="text-sm text-gray-400">Net Balance</div>
              <div className={`text-xl font-bold ${
                totals.income - totals.expenses >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${(totals.income - totals.expenses).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview Section */}
      <div className="bg-navy-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Transactions</h3>
          <div className="text-sm text-gray-400">
            Showing {transactions.length} transactions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-navy-700">
                <th className="text-left py-4 px-4">Date</th>
                <th className="text-left py-4 px-4">Description</th>
                <th className="text-left py-4 px-4">Category</th>
                <th className="text-left py-4 px-4">Type</th>
                <th className="text-right py-4 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No transactions found for the selected filters
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-navy-700">
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-white">{transaction.description}</td>
                    <td className="py-4 px-4 text-gray-300">{transaction.category}</td>
                    <td className="py-4 px-4 text-gray-300 capitalize">{transaction.type}</td>
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
      </div>
    </div>
  );
};

export default Reports;