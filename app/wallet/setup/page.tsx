"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Plus, Import, Shield, Sparkles, Star, Zap, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { useGetMe } from "@/src/hooks/user/useGetMe"

export default function WalletSetupPage() {
  const [seedPhrase] = useState(
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
  )
  const [importSeed, setImportSeed] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: userData, isLoading: userLoading } = useGetMe()

  // Redirect authenticated users with wallet addresses
  useEffect(() => {
    if (isAuthenticated && userData?.walletAddress) {
      router.push('/wallet')
    }
  }, [isAuthenticated, userData, router])

  // Show loading while checking authentication
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
            <p className="text-white text-lg">Checking your wallet status...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleCreateWallet = async () => {
    setIsCreating(true)
    
    try {
      // Call the backend API to create a new wallet
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create wallet')
      }

      toast({
        title: "🎉 Wallet Created!",
        description: "Your magical wallet has been successfully created and secured! ✨",
      })
      
      // Refresh user data and redirect to wallet
      window.location.href = "/wallet"
    } catch (error) {
      console.error('Error creating wallet:', error)
      toast({
        title: "❌ Wallet Creation Failed",
        description: error instanceof Error ? error.message : "An error occurred while creating your wallet. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleImportWallet = async () => {
    if (!importSeed.trim()) {
      toast({
        title: "⚠️ Oops!",
        description: "Please enter your magical seed phrase first! 🌱",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    setTimeout(() => {
      toast({
        title: "🎉 Wallet Imported!",
        description: "Your wallet has been successfully imported! Welcome back! 🚀",
      })
      router.push("/wallet")
      setIsCreating(false)
    }, 2000)
  }

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase)
    toast({
      title: "📋 Copied!",
      description: "Seed phrase copied to clipboard! Keep it safe! 🔒",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-pink-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Animated Header */}
          <div className="text-center space-y-4 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 animate-bounce">Wallet Setup 🪄</h1>
            <p className="text-white/90 text-xl animate-pulse">Create or import your magical Web3 wallet! ✨</p>
          </div>

          <Tabs defaultValue="create" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm border-white/30 h-14">
              <TabsTrigger
                value="create"
                className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Create New 🆕
              </TabsTrigger>
              <TabsTrigger
                value="import"
                className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Import Existing 📥
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    Create New Wallet 🎯
                  </CardTitle>
                  <CardDescription className="text-white/80 text-lg">
                    Generate a brand new wallet with a super secure seed phrase! 🔐
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/50 animate-pulse-glow">
                    <Shield className="h-6 w-6 text-yellow-300" />
                    <AlertDescription className="text-white font-medium text-lg">
                      🔒 Your seed phrase is the master key to your wallet! Store it safely and never share it with
                      anyone! 🛡️
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Label className="text-white font-bold text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-300 animate-spin" />
                      Your Magic Seed Phrase ✨
                    </Label>
                    <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        {seedPhrase.split(" ").map((word, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20"
                          >
                            <span className="text-yellow-300 font-bold">{index + 1}.</span>
                            <span className="text-white font-medium">{word}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={copySeedPhrase}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold h-12 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <Copy className="h-5 w-5 mr-2 animate-pulse" />
                      Copy 📋
                    </Button>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold h-12 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <Download className="h-5 w-5 mr-2 animate-bounce" />
                      Download 💾
                    </Button>
                  </div>

                  <Button
                    onClick={handleCreateWallet}
                    disabled={isCreating}
                    className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Your Magic Wallet... ✨
                      </div>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-3 animate-bounce" />
                        Create Wallet! 🚀
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="import" className="space-y-6">
              <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <Import className="h-6 w-6 text-white" />
                    </div>
                    Import Existing Wallet 📥
                  </CardTitle>
                  <CardDescription className="text-white/80 text-lg">
                    Import your existing wallet using your magical seed phrase! 🔮
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="seed" className="text-white font-bold text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-300 animate-spin" />
                      Enter Your Seed Phrase 🌱
                    </Label>
                    <Input
                      id="seed"
                      placeholder="Enter your 12 or 24 word magical seed phrase here... ✨"
                      value={importSeed}
                      onChange={(e) => setImportSeed(e.target.value)}
                      className="min-h-[100px] bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg backdrop-blur-sm"
                    />
                  </div>

                  <Button
                    onClick={handleImportWallet}
                    disabled={isCreating}
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Importing Your Wallet... 🔄
                      </div>
                    ) : (
                      <>
                        <Import className="h-6 w-6 mr-3 animate-pulse" />
                        Import Wallet! 🎯
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
