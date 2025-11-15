import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  ArrowRight,
  CreditCard,
  PiggyBank,
  Target,
  AlertCircle
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { Line, Bar } from 'react-chartjs-2';
import { useTransactions } from '../hooks/useTransactions';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { stats, transactions, loading } = useTransactions();
  const [timeframe, setTimeframe] = useState('7days');

  const getChartData = () => {
    if (!transactions.length) return null;

    const now = new Date();
    const timeframeMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90
    };

    const daysToShow = timeframeMap[timeframe as keyof typeof timeframeMap];
    const startDate = new Date(now.getTime() - (daysToShow * 24 * 60 * 60 * 1000));

    const filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    const dailyData = Array.from({ length: daysToShow }, (_, i) => {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.toDateString() === date.toDateString();
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: dayTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
        expenses: Math.abs(dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
      };
    }).reverse();

    const categories = [...new Set(transactions.map(t => t.category))];
    const categoryData = categories.map(category => {
      const categoryTransactions = transactions.filter(t => t.category === category);
      return {
        category,
        total: Math.abs(categoryTransactions.reduce((sum, t) => sum + t.amount, 0))
      };
    }).sort((a, b) => b.total - a.total);

    return {
      dailyData,
      categoryData
    };
  };

  const chartData = getChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        grid: {
          color: '#1e293b',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: (value: number) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#94a3b8'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const recentTransactions = transactions
    .slice(0, 5)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Balance"
          value={`$${stats.totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={Wallet}
          className="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <DashboardCard
          title="Monthly Income"
          value={`$${stats.monthlyIncome.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-green-600 to-green-700"
        />
        <DashboardCard
          title="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={TrendingDown}
          trend={{ value: 5, isPositive: false }}
          className="bg-gradient-to-br from-red-600 to-red-700"
        />
        <DashboardCard
          title="Savings Rate"
          value={`${Math.round((stats.monthlyIncome - stats.monthlyExpenses) / stats.monthlyIncome * 100)}%`}
          icon={PiggyBank}
          className="bg-gradient-to-br from-purple-600 to-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Cash Flow</h3>
              <p className="text-sm text-gray-400">Income vs Expenses</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <DollarSign size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && (
              <Line
                data={{
                  labels: chartData.dailyData.map(d => d.date),
                  datasets: [
                    {
                      label: 'Income',
                      data: chartData.dailyData.map(d => d.income),
                      borderColor: '#22c55e',
                      backgroundColor: '#22c55e20',
                      fill: true,
                      tension: 0.4
                    },
                    {
                      label: 'Expenses',
                      data: chartData.dailyData.map(d => d.expenses),
                      borderColor: '#ef4444',
                      backgroundColor: '#ef444420',
                      fill: true,
                      tension: 0.4
                    }
                  ]
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
              <p className="text-sm text-gray-400">Top spending categories</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <CreditCard size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && (
              <Bar
                data={{
                  labels: chartData.categoryData
                    .filter(d => transactions.some(t => t.category === d.category && t.amount < 0))
                    .slice(0, 5)
                    .map(d => d.category),
                  datasets: [{
                    label: 'Expenses',
                    data: chartData.categoryData
                      .filter(d => transactions.some(t => t.category === d.category && t.amount < 0))
                      .slice(0, 5)
                      .map(d => d.total),
                    backgroundColor: [
                      '#8b5cf6',
                      '#ec4899',
                      '#f97316',
                      '#14b8a6',
                      '#f59e0b'
                    ]
                  }]
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <p className="text-sm text-gray-400">Latest financial activities</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <Calendar size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-navy-900/50 rounded-lg border border-navy-700/50"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.amount >= 0 
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {transaction.amount >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <div className="text-white font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-400">{transaction.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.amount >= 0 ? '+' : ''}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Financial Goals</h3>
              <p className="text-sm text-gray-400">Track your progress</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <Target size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Monthly Savings Target</span>
                <span className="text-gray-400">$2,000 / $3,000</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Emergency Fund</span>
                <span className="text-gray-400">$8,000 / $10,000</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full">
                <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Investment Portfolio</span>
                <span className="text-gray-400">$15,000 / $50,000</span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full">
                <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-navy-900/50 rounded-lg border border-navy-700/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <AlertCircle size={20} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Financial Tip</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Consider increasing your emergency fund contributions to reach your target faster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;