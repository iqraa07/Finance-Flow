import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { useTransactions } from '../hooks/useTransactions';
import { Calendar, TrendingUp, DollarSign, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Analytics = () => {
  const { transactions, loading } = useTransactions();
  const [timeframe, setTimeframe] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const getChartData = () => {
    if (!transactions.length) return null;

    const now = new Date();
    const timeframeMap = {
      '1month': 1,
      '3months': 3,
      '6months': 6,
      '1year': 12
    };

    const monthsToShow = timeframeMap[timeframe as keyof typeof timeframeMap];
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsToShow, 1);

    const filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    const monthlyData = Array.from({ length: monthsToShow }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month.getMonth() && tDate.getFullYear() === month.getFullYear();
      });

      return {
        month: month.toLocaleString('default', { month: 'short' }),
        income: monthTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
        expenses: Math.abs(monthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
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
      monthlyData,
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Financial Analytics</h2>
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Metrics</option>
            <option value="income">Income Only</option>
            <option value="expenses">Expenses Only</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Trends</h3>
              <p className="text-sm text-gray-400">Income vs Expenses over time</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && (
              <Line
                data={{
                  labels: chartData.monthlyData.map(d => d.month),
                  datasets: [
                    ...(selectedMetric !== 'expenses' ? [{
                      label: 'Income',
                      data: chartData.monthlyData.map(d => d.income),
                      borderColor: '#22c55e',
                      backgroundColor: '#22c55e20',
                      fill: true,
                      tension: 0.4
                    }] : []),
                    ...(selectedMetric !== 'income' ? [{
                      label: 'Expenses',
                      data: chartData.monthlyData.map(d => d.expenses),
                      borderColor: '#ef4444',
                      backgroundColor: '#ef444420',
                      fill: true,
                      tension: 0.4
                    }] : [])
                  ]
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
              <p className="text-sm text-gray-400">Distribution by category</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <PieChart size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && (
              <Doughnut
                data={{
                  labels: chartData.categoryData.map(d => d.category),
                  datasets: [{
                    data: chartData.categoryData.map(d => d.total),
                    backgroundColor: [
                      '#8b5cf6',
                      '#ec4899',
                      '#f97316',
                      '#14b8a6',
                      '#f59e0b',
                      '#6366f1',
                      '#84cc16',
                      '#06b6d4'
                    ],
                    borderWidth: 0
                  }]
                }}
                options={{
                  ...chartOptions,
                  cutout: '70%'
                }}
              />
            )}
          </div>
        </div>

        {/* Income Sources */}
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Income Sources</h3>
              <p className="text-sm text-gray-400">Revenue breakdown</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <DollarSign size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && (
              <Bar
                data={{
                  labels: chartData.categoryData
                    .filter(d => transactions.some(t => t.category === d.category && t.amount > 0))
                    .map(d => d.category),
                  datasets: [{
                    label: 'Income',
                    data: chartData.categoryData
                      .filter(d => transactions.some(t => t.category === d.category && t.amount > 0))
                      .map(d => d.total),
                    backgroundColor: [
                      '#22c55e',
                      '#3b82f6',
                      '#f59e0b',
                      '#8b5cf6'
                    ]
                  }]
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-navy-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Comparison</h3>
              <p className="text-sm text-gray-400">Month-over-month changes</p>
            </div>
            <div className="p-2 bg-navy-900 rounded-lg">
              <Calendar size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="h-80">
            {chartData && chartData.monthlyData.length >= 2 && (
              <Bar
                data={{
                  labels: chartData.monthlyData.map(d => d.month),
                  datasets: [
                    {
                      label: 'Net Income',
                      data: chartData.monthlyData.map(d => d.income - d.expenses),
                      backgroundColor: (context) => {
                        const value = context.raw as number;
                        return value >= 0 ? '#22c55e' : '#ef4444';
                      }
                    }
                  ]
                }}
                options={chartOptions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;