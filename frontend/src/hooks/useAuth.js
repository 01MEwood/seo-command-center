import { useState, useEffect, useCallback } from 'react';
import { USERS } from '../config/constants';

const STORAGE_KEY = 'scc_user';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [user]);

  const login = useCallback((username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      return { ok: true };
    }
    return { ok: false, error: 'Falscher Benutzername oder Passwort' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { user, login, logout };
}
