import { useState, useEffect, useCallback } from 'react';
import type { AuthState, LoginCredentials } from '../types';

const AUTH_STORAGE_KEY = 'auth-storage';

// Load initial state from localStorage
function loadAuthState(): AuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  return { user: null, token: null };
}

// Save state to localStorage
function saveAuthState(state: AuthState) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

// Simple auth hook with localStorage persistence
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState);

  useEffect(() => {
    saveAuthState(authState);
  }, [authState]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    setAuthState({ user: data.user, token: data.token });
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null });
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!authState.token;
  }, [authState.token]);

  return {
    user: authState.user,
    token: authState.token,
    login,
    logout,
    isAuthenticated,
  };
}
