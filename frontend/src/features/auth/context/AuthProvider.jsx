import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { authApi } from '../api/authApi.js';

const initialStatus = 'checking';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const session = await authApi.fetchSession();

        if (!isMounted) {
          return;
        }

        setUser(session.user);
        setStatus('authenticated');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setUser(null);
        setStatus('unauthenticated');
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setStatus('authenticated');
      return response;
    } catch (error) {
      setUser(null);
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const registerAccount = useCallback(async (payload) => {
    try {
      const response = await authApi.registerAccount(payload);
      setUser(response.user);
      setStatus('authenticated');
      return response;
    } catch (error) {
      setUser(null);
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const deleteAccount = useCallback(async (payload) => {
    const response = await authApi.deleteAccount(payload);
    setUser(null);
    setStatus('unauthenticated');
    return response;
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
      registerAccount,
      deleteAccount
    }),
    [user, status, login, logout, registerAccount, deleteAccount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
