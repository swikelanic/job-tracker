import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register?: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Automatically switch between local and production
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://job-tracker-api-ader.onrender.com' // <-- your Render backend URL here
    : 'http://localhost:5000');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      );

      if (!res.ok) {
        console.error(`Login request failed: ${res.status} ${res.statusText}`);
        return false;
      }

      const data = await res.json();
      if (data.length > 0) {
        setUser(username);
        localStorage.setItem('loggedInUser', username);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const checkRes = await fetch(
        `${API_BASE_URL}/users?username=${encodeURIComponent(username)}`
      );
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) return false;

      // Create new user
      const createRes = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (createRes.ok) {
        setUser(username);
        localStorage.setItem('loggedInUser', username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
