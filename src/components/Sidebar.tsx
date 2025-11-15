import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  FileText, 
  Settings,
  LogOut,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-navy-900 to-navy-800 text-white p-6 relative">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 p-2 rounded-lg">
          <Wallet size={24} className="text-white" />
        </div>
        <div>
          <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            FinanceHub
          </div>
          <div className="text-xs text-gray-400">Financial Management</div>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }`
            }
          >
            <div className="flex items-center space-x-3">
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-navy-900/50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-400 mb-1">Logged in as</div>
          <div className="text-white font-medium truncate">admin@example.com</div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <LogOut size={20} className="transition-transform group-hover:scale-110" />
            <span>Logout</span>
          </div>
          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;