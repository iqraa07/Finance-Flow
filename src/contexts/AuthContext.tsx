import React, { createContext, useContext, useState } from 'react';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: () => {},
  signIn: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Demo user with valid UUID
const DEMO_USER = {
  email: 'demo@example.com',
  // Using a fixed UUID for demo user
  id: '00000000-0000-0000-0000-000000000000'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Demo credentials
    const DEMO_EMAIL = 'demo@example.com';
    const DEMO_PASSWORD = 'demo123456';

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser(DEMO_USER);
      return;
    }

    throw new Error('Invalid email or password');
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};