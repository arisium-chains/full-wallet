"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageCircle, 
  Send, 
  Shield, 
  Zap, 
  Star, 
  AlertCircle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authService } from '@/src/services/auth/auth.service'
import TelegramLoginButton from './TelegramLoginButton'
import type { AuthProviderType, ProviderAvailability } from '@/src/interfaces/auth.interfaces'

interface ProviderSelectorProps {
  onAuthSuccess: (provider: AuthProviderType) => void
  onAuthError: (error: string, provider: AuthProviderType) => void
  isWalletMode?: boolean
  className?: string
}

export default function ProviderSelector({ 
  onAuthSuccess, 
  onAuthError, 
  isWalletMode = false,
  className = ""
}: ProviderSelectorProps) {
  const [isLoading, setIsLoading] = useState<AuthProviderType | null>(null)
  const [availability, setAvailability] = useState<ProviderAvailability>({ line: false, telegram: false })
  const [isInitialized, setIsInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const { toast } = useToast()

  // Initialize auth service
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Starting auth service initialization...')
        await authService.initialize()
        console.log('Auth service initialized successfully')
        
        const providerAvailability = authService.getProviderAvailability()
        console.log('Provider availability:', providerAvailability)
        
        setAvailability(providerAvailability)
        setIsInitialized(true)
        
        // Show warning if no providers are available
        if (!providerAvailability.line && !providerAvailability.telegram) {
          setInitError('No authentication providers are configured')
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        setInitError('Failed to initialize authentication system')
      }
    }

    initializeAuth()
  }, [])

  const handleProviderLogin = async (provider: AuthProviderType) => {
    if (isLoading) return

    setIsLoading(provider)
    
    try {
      const result = await authService.login(provider)
      
      if (result.success) {
        toast({
          title: "🎉 Authentication Successful!",
          description: `Welcome! You're now logged in with ${provider.toUpperCase()}.`,
        })
        onAuthSuccess(provider)
      } else {
        throw new Error(result.error || 'Authentication failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      console.error(`${provider} authentication error:`, error)
      
      toast({
        title: "❌ Authentication Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      onAuthError(errorMessage, provider)
    } finally {
      setIsLoading(null)
    }
  }

  // Loading state during initialization
  if (!isInitialized) {
    return (
      <Card className={`glass-effect border-white/30 shadow-2xl ${className}`}>
        <CardContent className="p-8 text-center space-y-4">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
          <p className="text-white text-lg">Initializing authentication...</p>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (initError) {
    return (
      <Card className={`glass-effect border-white/30 shadow-2xl ${className}`}>
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Authentication Unavailable</h3>
            <p className="text-white/80">{initError}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300 ${className}`}>
      <CardHeader className="text-center relative pb-6">
        <CardTitle className="text-3xl font-bold text-white animate-pulse">
          {isWalletMode ? "🔐 Choose Your Login Method" : "Welcome to ARIS! 🎓"}
        </CardTitle>
        <CardDescription className="text-white/90 text-lg">
          {isWalletMode 
            ? "Select your preferred authentication method to access your wallet"
            : "Choose how you'd like to sign in to start your Web3 journey"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Features for Wallet Mode */}
        {isWalletMode && (
          <div className="grid grid-cols-3 gap-3 text-center mb-6">
            <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
              <Shield className="h-6 w-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
              <p className="text-white/80 text-xs font-medium">Bank-Level Security</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-1 animate-bounce" />
              <p className="text-white/80 text-xs font-medium">Lightning Fast</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
              <Star className="h-6 w-6 text-blue-400 mx-auto mb-1 animate-wiggle" />
              <p className="text-white/80 text-xs font-medium">Easy to Use</p>
            </div>
          </div>
        )}

        {/* LINE Login Button */}
        {availability.line && (
          <Button
            onClick={() => handleProviderLogin('line')}
            disabled={!!isLoading}
            className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 group"
          >
            {isLoading === 'line' ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                Connecting with LINE...
              </div>
            ) : (
              <>
                <MessageCircle className="h-6 w-6 mr-3 animate-wiggle group-hover:animate-bounce" />
                Continue with LINE 💚
              </>
            )}
          </Button>
        )}

        {/* Telegram Login Button */}
        <TelegramLoginButton
          onSuccess={() => onAuthSuccess('telegram')}
          onError={(error) => onAuthError(error, 'telegram')}
          disabled={!!isLoading}
        />

        {/* Separator when LINE is available */}
        {availability.line && (
          <div className="relative">
            <Separator className="bg-white/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                OR
              </span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-center text-white/70 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
          <Shield className="h-4 w-4 inline mr-2 text-green-400" />
          Your authentication is secured with end-to-end encryption
          <Shield className="h-4 w-4 inline ml-2 text-green-400" />
        </div>

        {/* Telegram Widget Container (hidden by default, used by Telegram provider) */}
        <div id="telegram-login-container" className="hidden"></div>
      </CardContent>
    </Card>
  )
}