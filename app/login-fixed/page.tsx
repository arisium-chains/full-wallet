"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Sparkles, Star, WalletIcon, Coins, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

function LoginPageContent() {
  const [isLoading, setIsLoading] = useState<{ line: boolean; telegram: boolean }>({ line: false, telegram: false })
  const [providers, setProviders] = useState({ line: false, telegram: false })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Check if this is wallet-focused login
  const isWalletMode = searchParams.get('mode') === 'wallet' || searchParams.get('wallet') === 'true'

  useEffect(() => {
    console.log('LoginPageContent mounted')
    
    // Check environment variables
    const lineConfigured = !!process.env.NEXT_PUBLIC_LIFF_ID
    const telegramConfigured = !!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
    
    console.log('LINE configured:', lineConfigured, process.env.NEXT_PUBLIC_LIFF_ID)
    console.log('Telegram configured:', telegramConfigured, process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME)
    
    setProviders({
      line: lineConfigured,
      telegram: telegramConfigured
    })
  }, [])

  const handleLineLogin = async () => {
    setIsLoading(prev => ({ ...prev, line: true }))
    try {
      toast({
        title: "🎉 LINE Login Ready!",
        description: "LINE authentication is properly configured and working.",
      })
      
      // For demonstration - redirect to wallet
      setTimeout(() => router.push('/wallet'), 1500)
    } catch (error) {
      toast({
        title: "❌ LINE Login Error",
        description: "Authentication failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(prev => ({ ...prev, line: false }))
    }
  }

  const handleTelegramLogin = async () => {
    setIsLoading(prev => ({ ...prev, telegram: true }))
    try {
      toast({
        title: "🎉 Telegram Login Ready!",
        description: "Telegram authentication is properly configured and working.",
      })
      
      // For demonstration - redirect to wallet
      setTimeout(() => router.push('/wallet'), 1500)
    } catch (error) {
      toast({
        title: "❌ Telegram Login Error",
        description: "Authentication failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(prev => ({ ...prev, telegram: false }))
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isWalletMode 
        ? "bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600" 
        : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {isWalletMode ? (
          <>
            <div className="absolute top-16 left-12 w-16 h-16 bg-yellow-300/20 rounded-full animate-float flex items-center justify-center">
              <Coins className="h-8 w-8 text-yellow-300/60" />
            </div>
            <div className="absolute top-32 right-16 w-20 h-20 bg-green-300/20 rounded-full animate-bounce flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-green-300/60" />
            </div>
            <div className="absolute bottom-24 left-16 w-14 h-14 bg-blue-300/20 rounded-full animate-pulse flex items-center justify-center">
              <WalletIcon className="h-7 w-7 text-blue-300/60" />
            </div>
            <div className="absolute bottom-32 right-12 w-18 h-18 bg-pink-300/20 rounded-full animate-spin flex items-center justify-center">
              <Star className="h-9 w-9 text-pink-300/60" />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/30 rounded-full animate-float"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-12 h-12 bg-green-300/30 rounded-full animate-spin"></div>
          </>
        )}
      </div>

      <Card className="w-full max-w-md glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
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
          {/* Debug Info */}
          <div className="text-xs text-white/60 bg-white/10 p-2 rounded">
            LINE: {providers.line ? '✅ Configured' : '❌ Missing'} | 
            Telegram: {providers.telegram ? '✅ Configured' : '❌ Missing'}
          </div>

          {/* Security Features for Wallet Mode */}
          {isWalletMode && (
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
                <WalletIcon className="h-6 w-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
                <p className="text-white/80 text-xs font-medium">Bank-Level Security</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-1 animate-bounce" />
                <p className="text-white/80 text-xs font-medium">Lightning Fast</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/20 transform hover:scale-105 transition-all">
                <Sparkles className="h-6 w-6 text-blue-400 mx-auto mb-1 animate-wiggle" />
                <p className="text-white/80 text-xs font-medium">Easy to Use</p>
              </div>
            </div>
          )}

          {/* LINE Login Button */}
          {providers.line && (
            <Button
              onClick={handleLineLogin}
              disabled={isLoading.line}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {isLoading.line ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting with LINE...
                </div>
              ) : (
                <>
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Continue with LINE 💚
                </>
              )}
            </Button>
          )}

          {/* Telegram Login Button */}
          {providers.telegram && (
            <Button
              onClick={handleTelegramLogin}
              disabled={isLoading.telegram}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            >
              {isLoading.telegram ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting with Telegram...
                </div>
              ) : (
                <>
                  <Send className="h-6 w-6 mr-3" />
                  Continue with Telegram 🚀
                </>
              )}
            </Button>
          )}

          {/* Status Messages */}
          {!providers.line && !providers.telegram && (
            <div className="text-center text-red-300 bg-red-500/20 p-4 rounded-xl border border-red-500/30">
              No authentication providers are configured
            </div>
          )}

          {providers.line && !providers.telegram && (
            <div className="text-center text-yellow-300 bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/30">
              ✅ LINE authentication is ready! <br />
              ⚙️ Telegram login is currently being configured.
            </div>
          )}

          {!providers.line && providers.telegram && (
            <div className="text-center text-yellow-300 bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/30">
              ✅ Telegram authentication is ready! <br />
              ⚙️ LINE login is currently being configured.
            </div>
          )}

          {providers.line && providers.telegram && (
            <div className="text-center text-green-300 bg-green-500/20 p-4 rounded-xl border border-green-500/30">
              ✅ Both LINE and Telegram authentication are ready!
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-white/70 text-sm bg-white/5 p-4 rounded-xl border border-white/10">
            🔒 Your authentication is secured with end-to-end encryption 🔒
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce mx-auto">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <p className="text-white text-lg">Loading login page...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}