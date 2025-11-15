import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: 'Demo User',
    email: user?.email || '',
    phone: '+1 (555) 000-0000',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: true,
    twoFactorEnabled: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Simulate API call
    setTimeout(() => {
      showSuccess('Profile updated successfully');
      setLoading(false);
    }, 800);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (profileData.newPassword !== profileData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      if (profileData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      showSuccess('Password updated successfully');
      
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfileData(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));

      showSuccess(`Two-factor authentication ${profileData.twoFactorEnabled ? 'disabled' : 'enabled'} successfully`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (type: 'email' | 'push', value: boolean) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfileData(prev => ({
        ...prev,
        [type === 'email' ? 'emailNotifications' : 'pushNotifications']: value
      }));

      showSuccess('Notification preferences updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      content: (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <select
                value={profileData.language}
                onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              <Save size={20} />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="bg-navy-900/50 backdrop-blur-sm rounded-lg p-6 border border-navy-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={loading}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  profileData.twoFactorEnabled
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                }`}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : profileData.twoFactorEnabled ? (
                  <>
                    <span>Disable 2FA</span>
                  </>
                ) : (
                  <>
                    <span>Enable 2FA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h4 className="text-white font-medium">Change Password</h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={profileData.currentPassword}
                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="New Password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              <Save size={20} />
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-navy-900/50 backdrop-blur-sm rounded-lg border border-navy-700/50">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Receive notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.emailNotifications}
                  onChange={(e) => handleNotificationUpdate('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900/50 backdrop-blur-sm rounded-lg border border-navy-700/50">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Receive push notifications in your browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.pushNotifications}
                  onChange={(e) => handleNotificationUpdate('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-navy-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Globe,
      content: (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time Zone
              </label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date Format
              </label>
              <select
                value={profileData.dateFormat}
                onChange={(e) => setProfileData({ ...profileData, dateFormat: e.target.value })}
                className="w-full px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="bg-navy-900/50 backdrop-blur-sm rounded-lg p-6 border border-navy-700/50">
            <h4 className="text-white font-medium mb-4">Theme Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProfileData({ ...profileData, theme: 'dark' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  profileData.theme === 'dark'
                    ? 'bg-navy-900 border-blue-500 text-white'
                    : 'bg-navy-900 border-transparent text-gray-400 hover:border-navy-700'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-navy-900 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-center font-medium">Dark Mode</div>
              </button>
              <button
                type="button"
                onClick={() => setProfileData({ ...profileData, theme: 'light' })}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  profileData.theme === 'light'
                    ? 'bg-gray-100 border-blue-500 text-gray-900'
                    : 'bg-gray-100 border-transparent text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="text-center font-medium">Light Mode</div>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg disabled:opacity-50 transition-all duration-200"
            >
              <Save size={20} />
              <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      ),
    },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-4 flex items-center space-x-2">
          <Check size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-4 border border-navy-700/50">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  <section.icon size={20} />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50">
            {sections.find((section) => section.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;