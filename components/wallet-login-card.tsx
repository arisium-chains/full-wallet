"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MessageCircle, 
  Sparkles, 
  AlertCircle, 
  WalletIcon, 
  Shield, 
  Coins,
  Zap,
  Lock,
  TrendingUp
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import liff from '@line/liff'

interface WalletLoginCardProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  compact?: boolean
  redirectPath?: string
}

export default function WalletLoginCard({ 
  onSuccess, 
  onError, 
  compact = false,
  redirectPath = "/wallet"
}: WalletLoginCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [liffReady, setLiffReady] = useState(false)
  const [liffError, setLiffError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID
        if (!liffId) {
          const error = 'LIFF ID not configured'
          setLiffError(error)
          onError?.(error)
          return
        }

        await liff.init({ liffId })
        setLiffReady(true)

        // Check if user is already logged in
        if (liff.isLoggedIn()) {
          handleLineLogin()
        }
      } catch (error) {
        console.error('LIFF initialization failed', error)
        const errorMsg = 'Failed to initialize LINE login'
        setLiffError(errorMsg)
        onError?.(errorMsg)
      }
    }

    initializeLiff()
  }, [onError])

  const handleLineLogin = async () => {
    setIsLoading(true)

    try {
      if (!liff.isLoggedIn()) {
        liff.login()
        return
      }

      // Get ID token
      const idToken = liff.getIDToken()
      if (!idToken) {
        throw new Error('Failed to get ID token')
      }

      // Send to our authentication endpoint
      const response = await fetch('/api/auth/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      toast({
        title: "🎉 Wallet Connected!",
        description: "Successfully connected to your Web3 wallet! 💰",
      })

      onSuccess?.()
      router.push(redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = error instanceof Error ? error.message : "Unable to connect wallet. Please try again."
      
      toast({
        title: "❌ Connection Failed",
        description: errorMsg,
        variant: "destructive"
      })
      
      onError?.(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (compact) {
    return (
      <Card className="glass-effect border-white/30 shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 animate-bounce">
              <WalletIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Wallet 🔐</h3>
            <p className="text-white/80 text-sm">Access your secure Web3 wallet</p>
          </div>

          {liffError && (
            <div className="text-center text-red-300 bg-red-500/20 p-3 rounded-lg border border-red-500/30">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              <span className="text-sm">{liffError}</span>
            </div>
          )}

          <Button
            onClick={handleLineLogin}
            disabled={isLoading || !liffReady || !!liffError}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 font-bold transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5 mr-3 animate-wiggle" />
            {isLoading ? "Connecting..." : "Connect with LINE 🔑"}
          </Button>

          {!liffReady && !liffError && (
            <div className="text-center text-white/70 text-sm">
              <Lock className="h-4 w-4 inline mr-2 animate-pulse" />
              Initializing secure connection...
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-effect border-white/30 shadow-2xl max-w-md mx-auto">
      <CardHeader className="text-center relative pb-6">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce shadow-xl">
            <WalletIcon className="h-7 w-7 text-white" />
          </div>
        </div>
        
        <div className="absolute -top-2 left-1/4">
          <Sparkles className="h-5 w-5 text-yellow-300 animate-spin" />
        </div>

        <CardTitle className="text-3xl font-bold text-white mt-4">
          🔐 Wallet Access
        </CardTitle>
        <CardDescription className="text-white/90 text-base mt-3">
          Connect to your secure Web3 wallet and manage your digital assets! 💎
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {liffError && (
          <div className="text-center text-red-300 bg-red-500/20 p-4 rounded-xl border border-red-500/30">
            <AlertCircle className="h-5 w-5 inline mr-2" />
            <span className="font-medium">{liffError}</span>
          </div>
        )}

        {/* Quick Benefits */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <Shield className="h-6 w-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
            <p className="text-white/80 text-xs font-medium">Secure</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-1 animate-bounce" />
            <p className="text-white/80 text-xs font-medium">Fast</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-1 animate-wiggle" />
            <p className="text-white/80 text-xs font-medium">Track</p>
          </div>
        </div>

        <Button
          onClick={handleLineLogin}
          disabled={isLoading || !liffReady || !!liffError}
          className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 group"
        >
          <MessageCircle className="h-6 w-6 mr-3 animate-wiggle group-hover:animate-bounce" />
          {isLoading ? "Connecting..." : "Connect with LINE 🔑"}
        </Button>

        {isLoading && (
          <div className="text-center bg-white/10 p-4 rounded-xl">
            <div className="inline-flex items-center gap-2 text-white">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <Coins className="h-5 w-5 ml-2 animate-spin" />
              <span className="ml-2 font-medium">Connecting wallet...</span>
            </div>
          </div>
        )}

        {!liffReady && !liffError && (
          <div className="text-center text-white/70 bg-white/5 p-3 rounded-lg">
            <Lock className="h-4 w-4 inline mr-2 animate-pulse" />
            <span className="text-sm">Initializing secure connection...</span>
          </div>
        )}

        <div className="text-center text-white/60 text-xs bg-white/5 p-3 rounded-lg">
          <Shield className="h-4 w-4 inline mr-1 text-green-400" />
          Your wallet data is encrypted and secure
          <Lock className="h-4 w-4 inline ml-1 text-green-400" />
        </div>
      </CardContent>
    </Card>
  )
}