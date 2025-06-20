/**
 * Static Authentication Hook for Cloudflare Pages deployment
 */

import { useState, useEffect } from 'react';
import { staticAuthService } from '@/src/services/auth/static-auth.service';
import type { AuthProviderType } from '@/src/interfaces/auth.interfaces';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
}

interface UseStaticAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (provider: AuthProviderType, authData: any) => Promise<void>;
  logout: () => void;
  createGuest: () => Promise<void>;
  balance: any;
  refetch: () => void;
}

export function useStaticAuth(): UseStaticAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<any>(null);

  // Initialize and check auth status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      if (staticAuthService.isAuthenticated()) {
        const currentUser = staticAuthService.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            avatar: currentUser.avatar,
            walletAddress: currentUser.walletAddress,
          });
          setIsAuthenticated(true);
          
          // Fetch balance
          const userBalance = await staticAuthService.getUserBalance();
          setBalance(userBalance);
        }
      } else {
        // Auto-create guest user if no authentication
        setError({ message: 'No authentication found', code: 'UNAUTHORIZED' } as any);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Failed to check authentication status');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (provider: AuthProviderType, authData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (provider) {
        case 'telegram':
          result = await staticAuthService.authenticateWithTelegram(authData);
          break;
        case 'line':
          result = await staticAuthService.authenticateWithLine(authData);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }

      // Refresh auth status
      await checkAuthStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createGuest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await staticAuthService.createGuestUser();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create guest user');
      }

      // Refresh auth status
      await checkAuthStatus();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create guest user';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    staticAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setBalance(null);
    setError(null);
  };

  const refetch = () => {
    checkAuthStatus();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    createGuest,
    balance,
    refetch,
  };
}