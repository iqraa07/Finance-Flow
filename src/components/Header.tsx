import React, { useState, useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'transaction' | 'account' | 'security' | 'system';
}

const Header = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    if (!user) return;

    // Create a single channel for all database changes
    const channel = supabase.channel('db-changes')
      // Listen for transaction changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          let message = '';
          const amount = Math.abs(payload.new?.amount || 0).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          });

          switch (payload.eventType) {
            case 'INSERT':
              message = `New ${payload.new.type} of ${amount} added for ${payload.new.category}`;
              break;
            case 'UPDATE':
              message = `Transaction updated: ${amount} for ${payload.new.category}`;
              break;
            case 'DELETE':
              message = `Transaction of ${amount} has been deleted`;
              break;
          }

          const newNotification = {
            id: crypto.randomUUID(),
            title: 'Transaction Update',
            message,
            time: new Date().toLocaleString(),
            unread: true,
            type: 'transaction'
          };

          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      // Listen for user profile changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        (payload: any) => {
          let message = '';
          const changes: string[] = [];

          if (payload.eventType === 'UPDATE') {
            const oldData = payload.old || {};
            const newData = payload.new || {};

            // Compare fields and build change message
            if (oldData.full_name !== newData.full_name) {
              changes.push('name');
            }
            if (oldData.email_notifications !== newData.email_notifications) {
              changes.push('email notification settings');
            }
            if (oldData.push_notifications !== newData.push_notifications) {
              changes.push('push notification settings');
            }
            if (oldData.theme !== newData.theme) {
              changes.push('theme');
            }
            if (oldData.language !== newData.language) {
              changes.push('language');
            }
            if (oldData.timezone !== newData.timezone) {
              changes.push('timezone');
            }

            message = `Account settings updated: ${changes.join(', ')}`;
          }

          if (message) {
            const newNotification = {
              id: crypto.randomUUID(),
              title: 'Account Update',
              message,
              time: new Date().toLocaleString(),
              unread: true,
              type: 'account'
            };

            setNotifications(prev => [newNotification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'transaction':
        return 'bg-green-500';
      case 'account':
        return 'bg-blue-500';
      case 'security':
        return 'bg-red-500';
      case 'system':
        return 'bg-purple-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  return (
    <header className="h-16 bg-gradient-to-r from-navy-800 to-navy-900 flex items-center justify-between px-6 border-b border-navy-700">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-navy-900/50 border border-navy-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Notifications Button */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="group p-3 rounded-xl bg-navy-700 hover:bg-navy-600 transition-all duration-300"
            aria-label="View notifications"
          >
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white shadow-lg">
                {unreadCount}
              </div>
            )}
            <Bell className="text-gray-400 group-hover:text-white transition-colors" size={20} />
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-navy-800 rounded-xl shadow-lg border border-navy-700 z-50">
              <div className="p-4 border-b border-navy-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Notifications</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">{unreadCount} unread</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-400"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="max-h-[32rem] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-3 opacity-50" />
                    <p>No notifications yet</p>
                    <p className="text-sm mt-1">We'll notify you when something happens</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-navy-700 hover:bg-navy-700/50 cursor-pointer transition-colors ${
                        notification.unread ? 'bg-navy-700/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${getNotificationIcon(notification.type)}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm mt-1 text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-navy-700">
                <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors w-full text-center font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-6 border-l border-navy-700">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-sm font-medium text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-sm">
            <div className="text-white">{user?.email}</div>
            <div className="text-gray-400">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;