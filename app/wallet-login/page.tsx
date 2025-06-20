"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  Sparkles, 
  Star, 
  AlertCircle, 
  WalletIcon, 
  Shield, 
  Coins,
  Zap,
  Lock,
  Rocket,
  TrendingUp,
  Globe
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import liff from '@line/liff'

export default function WalletLoginPage() {
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
          setLiffError('LIFF ID not configured')
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
        setLiffError('Failed to initialize LINE login')
      }
    }

    initializeLiff()
  }, [])

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
        title: "🎉 Wallet Access Granted!",
        description: "Welcome to your secure Web3 wallet! 💰",
      })

      // Redirect to wallet
      router.push("/wallet")
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "❌ Wallet Access Failed",
        description: error instanceof Error ? error.message : "Unable to access your wallet. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 relative overflow-hidden">
      {/* Animated Background Elements - Crypto Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-12 w-16 h-16 bg-yellow-300/20 rounded-full animate-float flex items-center justify-center">
          <Coins className="h-8 w-8 text-yellow-300/60" />
        </div>
        <div className="absolute top-32 right-16 w-20 h-20 bg-green-300/20 rounded-full animate-bounce flex items-center justify-center">
          <TrendingUp className="h-10 w-10 text-green-300/60" />
        </div>
        <div className="absolute bottom-24 left-16 w-14 h-14 bg-blue-300/20 rounded-full animate-pulse flex items-center justify-center">
          <Globe className="h-7 w-7 text-blue-300/60" />
        </div>
        <div className="absolute bottom-32 right-12 w-18 h-18 bg-pink-300/20 rounded-full animate-spin flex items-center justify-center">
          <Zap className="h-9 w-9 text-pink-300/60" />
        </div>
        <div className="absolute top-1/2 left-8 w-12 h-12 bg-emerald-300/20 rounded-full animate-wiggle flex items-center justify-center">
          <Shield className="h-6 w-6 text-emerald-300/60" />
        </div>
        <div className="absolute top-1/3 right-8 w-10 h-10 bg-orange-300/20 rounded-full animate-pulse flex items-center justify-center">
          <Lock className="h-5 w-5 text-orange-300/60" />
        </div>
      </div>

      <Card className="w-full max-w-lg glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
        <CardHeader className="text-center relative pb-8">
          {/* Floating Wallet Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce shadow-2xl">
              <WalletIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          {/* Sparkle decoration */}
          <div className="absolute -top-4 left-1/3 transform -translate-x-1/2">
            <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
          </div>
          <div className="absolute -top-4 right-1/3 transform translate-x-1/2">
            <Star className="h-5 w-5 text-pink-300 animate-pulse" />
          </div>

          <CardTitle className="text-4xl font-bold text-white mt-6 animate-fade-in">
            🔐 Secure Wallet Access
          </CardTitle>
          <CardDescription className="text-white/90 text-lg mt-4 leading-relaxed">
            Connect to your <span className="font-bold text-yellow-300">Web3 wallet</span> and start managing your digital assets securely! 
            <br />
            <span className="text-emerald-300">💎 Your crypto journey begins here!</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pb-8">
          {liffError && (
            <div className="text-center text-red-300 bg-red-500/20 p-4 rounded-xl border border-red-500/30 animate-pulse-glow">
              <AlertCircle className="h-6 w-6 inline mr-2" />
              <span className="font-medium">{liffError}</span>
            </div>
          )}

          {/* Security Features Highlight */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 transform hover:scale-105 transition-all">
              <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
              <p className="text-white/80 text-sm font-medium">Bank-Level Security</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 transform hover:scale-105 transition-all">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
              <p className="text-white/80 text-sm font-medium">Lightning Fast</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 transform hover:scale-105 transition-all">
              <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-wiggle" />
              <p className="text-white/80 text-sm font-medium">Global Access</p>
            </div>
          </div>

          {/* Main Login Button */}
          <Button
            onClick={handleLineLogin}
            disabled={isLoading || !liffReady || !!liffError}
            className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <MessageCircle className="h-7 w-7 mr-4 animate-wiggle group-hover:animate-bounce" />
            Access My Wallet with LINE 🔑
          </Button>

          <Separator className="my-6 bg-white/30" />

          {/* Wallet Benefits */}
          <div className="text-center space-y-4">
            <h3 className="text-white font-bold text-lg flex items-center justify-center gap-2">
              <Coins className="h-6 w-6 text-yellow-400 animate-spin" />
              What You Get 
              <Coins className="h-6 w-6 text-yellow-400 animate-spin" />
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-3 rounded-lg border border-emerald-500/30">
                <TrendingUp className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-white/90 font-medium">Track Portfolio</span>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-3 rounded-lg border border-blue-500/30">
                <Rocket className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <span className="text-white/90 font-medium">Send & Receive</span>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-500/30">
                <Shield className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <span className="text-white/90 font-medium">Secure Storage</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border border-yellow-500/30">
                <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                <span className="text-white/90 font-medium">Earn Rewards</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center bg-white/10 p-6 rounded-xl border border-white/20">
              <div className="inline-flex items-center gap-3 text-white">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
                <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <WalletIcon className="h-6 w-6 ml-3 animate-pulse" />
                <span className="ml-2 font-medium animate-pulse">Connecting to your wallet...</span>
              </div>
            </div>
          )}

          {/* Initialization State */}
          {!liffReady && !liffError && (
            <div className="text-center text-white/80 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="inline-flex items-center gap-3">
                <div className="w-4 h-4 bg-white/50 rounded-full animate-pulse"></div>
                <Lock className="h-5 w-5 animate-wiggle" />
                <span className="font-medium">Initializing secure connection...</span>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="text-center text-white/60 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
            <Shield className="h-5 w-5 inline mr-2 text-green-400 animate-pulse" />
            <span className="font-medium">
              Your wallet data is encrypted and secured with military-grade protection
            </span>
            <Lock className="h-5 w-5 inline ml-2 text-green-400 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}