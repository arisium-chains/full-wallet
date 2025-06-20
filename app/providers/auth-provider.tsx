'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

import { useGetMe } from '@/src/hooks/user/useGetMe'
import type { User } from '@/src/interfaces/user.interface'
// import { authService } from '@/src/services/auth/auth.service'
import type { AuthProviderType, ProviderAvailability } from '@/src/interfaces/auth.interfaces'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  providerAvailability: ProviderAvailability
  isAuthServiceInitialized: boolean
  login: (provider?: AuthProviderType) => Promise<void>
  logout: (provider?: AuthProviderType) => Promise<void>
  redirectToLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthServiceInitialized, setIsAuthServiceInitialized] = useState(false)
  const [providerAvailability, setProviderAvailability] = useState<ProviderAvailability>({
    line: false,
    telegram: false
  })
  const { data: user, isLoading, error } = useGetMe()

  // Initialize auth service
  useEffect(() => {
    const initializeAuthService = async () => {
      try {
        // TODO: Re-enable when auth service is working
        // await authService.initialize()
        // setProviderAvailability(authService.getProviderAvailability())
        setProviderAvailability({ line: true, telegram: false }) // Temporary
        setIsAuthServiceInitialized(true)
      } catch (error) {
        console.error('Failed to initialize auth service:', error)
        setIsAuthServiceInitialized(true) // Still set to true to avoid infinite loading
      }
    }

    initializeAuthService()
  }, [])

  useEffect(() => {
    if (user && !error) {
      setIsAuthenticated(true)
    } else if (error) {
      setIsAuthenticated(false)
      
      // If user is not authenticated and we get an unauthorized error,
      // automatically create a guest user with wallet
      if (error.code === 'UNAUTHORIZED' && !isLoading) {
        console.log('No authenticated user found, creating guest user...')
        createGuestUser()
      }
    }
  }, [user, error, isLoading])

  const login = async (provider?: AuthProviderType) => {
    try {
      if (!provider) {
        // If no provider specified, redirect to login page for selection
        redirectToLogin()
        return
      }

      // TODO: Re-enable when auth service is working
      // const result = await authService.login(provider)
      console.log(`Login with ${provider} (temporarily disabled)`)
      
      // Temporary - just redirect to login for now
      redirectToLogin()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async (provider?: AuthProviderType) => {
    try {
      // TODO: Re-enable when auth service is working
      // await authService.logout(provider)
      console.log(`Logout with ${provider} (temporarily disabled)`)
      
      // Clear any stored tokens/session data
      localStorage.removeItem('accessToken')
      sessionStorage.clear()
      setIsAuthenticated(false)
      
      // Redirect to login page
      redirectToLogin()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state and redirect
      localStorage.removeItem('accessToken')
      sessionStorage.clear()
      setIsAuthenticated(false)
      redirectToLogin()
    }
  }

  const createGuestUser = async () => {
    try {
      console.log('Creating guest user with wallet...')
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create guest user')
      }

      console.log('Guest user created successfully:', data)
      
      // Refresh the page to reload user data
      window.location.reload()
    } catch (error) {
      console.error('Failed to create guest user:', error)
    }
  }

  const redirectToLogin = () => {
    window.location.href = '/login'
  }

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || !isAuthServiceInitialized,
    isAuthenticated,
    providerAvailability,
    isAuthServiceInitialized,
    login,
    logout,
    redirectToLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}