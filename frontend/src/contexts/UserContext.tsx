import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  role: string;
  stytchUserId?: string;
  sessionToken: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (sessionToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Load user data from localStorage on app start
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const sessionToken = localStorage.getItem('stytch_session');
        const userEmail = localStorage.getItem('user_email');
        const userRole = localStorage.getItem('user_role');
        const userId = localStorage.getItem('user_id');
        const stytchUserId = localStorage.getItem('stytch_user_id');

        if (sessionToken && userEmail && userRole && userId) {
          setUser({
            id: userId,
            email: userEmail,
            role: userRole,
            stytchUserId: stytchUserId || undefined,
            sessionToken,
          });
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        clearUserStorage();
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const clearUserStorage = () => {
    localStorage.removeItem('stytch_session');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('stytch_user_id');
    localStorage.removeItem('token'); // Remove old token if exists
  };

  const login = async (sessionToken: string): Promise<void> => {
    try {
      // Import stytchService dynamically to avoid circular dependency
      const { default: stytchService } = await import('../services/stytch');
      
      // Validate the session with the backend
      const data = await stytchService.authenticateSession(sessionToken);
      
      // Update localStorage with fresh data
      localStorage.setItem('stytch_session', data.session_token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_id', data.user_id);
      if (data.stytch_user_id) {
        localStorage.setItem('stytch_user_id', data.stytch_user_id);
      }

      // Update user state
      setUser({
        id: data.user_id,
        email: data.email,
        role: data.role,
        stytchUserId: data.stytch_user_id,
        sessionToken: data.session_token,
      });
    } catch (error) {
      clearUserStorage();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    clearUserStorage();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update localStorage
      if (userData.email) localStorage.setItem('user_email', userData.email);
      if (userData.role) localStorage.setItem('user_role', userData.role);
      if (userData.sessionToken) localStorage.setItem('stytch_session', userData.sessionToken);
      if (userData.stytchUserId) localStorage.setItem('stytch_user_id', userData.stytchUserId);
    }
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
