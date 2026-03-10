import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const STORAGE_KEY = 'meos_seo_user';

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

  const login = useCallback(async (email, password) => {
    try {
      const result = await api.authLogin(email, password);
      if (result.user) {
        setUser(result.user);
        return { ok: true };
      }
      return { ok: false, error: 'Login fehlgeschlagen' };
    } catch (e) {
      return { ok: false, error: e.message || 'Falscher Benutzername oder Passwort' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { user, login, logout };
}
