"use client"

import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Star, WalletIcon, Coins, TrendingUp } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ProviderSelector from "@/components/auth/ProviderSelector"
import type { AuthProviderType } from "@/src/interfaces/auth.interfaces"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Check if this is wallet-focused login
  const isWalletMode = searchParams.get('mode') === 'wallet' || searchParams.get('wallet') === 'true'

  const handleAuthSuccess = (provider: AuthProviderType) => {
    toast({
      title: isWalletMode ? "🎉 Wallet Connected!" : "🎉 Login Successful!",
      description: isWalletMode 
        ? `Welcome to your secure Web3 wallet! Authenticated with ${provider.toUpperCase()} 💰` 
        : `Welcome aboard! Logged in with ${provider.toUpperCase()}`,
    })

    // Redirect based on mode
    router.push(isWalletMode ? "/wallet" : "/wallet")
  }

  const handleAuthError = (error: string, provider: AuthProviderType) => {
    toast({
      title: "❌ Login Failed",
      description: `${provider.toUpperCase()} authentication failed: ${error}`,
      variant: "destructive"
    })
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
          // Wallet-themed background elements
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
          // Original background elements
          <>
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/30 rounded-full animate-float"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/30 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-12 h-12 bg-green-300/30 rounded-full animate-spin"></div>
          </>
        )}
      </div>

      {/* Use the new ProviderSelector component */}
      <ProviderSelector 
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        isWalletMode={isWalletMode}
        className="w-full max-w-md"
      />
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
