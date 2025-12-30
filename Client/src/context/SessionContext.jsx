import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {

  const [session, setSession] = useState(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      return { user: JSON.parse(savedUser), isAuthenticated: true };
    }
    return { user: null, isAuthenticated: false };
  });

  const login = (userData) => {
    localStorage.setItem('app_user', JSON.stringify(userData));

    setSession({
      user: userData,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('app_user');
    setSession({ user: null, isAuthenticated: false });
  };

  const updateSessionUser = (newData) => {
    setSession(prev => ({
      ...prev,
      user: { ...prev.user, ...newData }
    }));
  };
  return (
    <SessionContext.Provider value={{ session, login, logout, updateSessionUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);