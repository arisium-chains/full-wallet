"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Share, Sparkles, Star, Zap, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { useWallet } from "@/app/providers/wallet-provider"
import { useGetMe } from "@/src/hooks/user/useGetMe"
import QRCode from "qrcode"

export default function ReceiveTokensPage() {
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { state: walletState } = useWallet()
  const { data: userData, isLoading: userLoading, error: userError } = useGetMe()
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("")
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  // Get wallet address from multiple sources with fallback
  const walletAddress = 
    userData?.walletAddress || 
    walletState.walletAddress || 
    user?.walletAddress || 
    "0x0000000000000000000000000000000000000000"

  const isLoading = authLoading || userLoading || isGeneratingQR

  // Generate QR code when wallet address is available
  useEffect(() => {
    const generateQRCode = async () => {
      if (walletAddress && walletAddress !== "0x0000000000000000000000000000000000000000") {
        setIsGeneratingQR(true)
        try {
          const qrDataURL = await QRCode.toDataURL(walletAddress, {
            width: 240,
            margin: 2,
            color: {
              dark: '#1a202c',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
          })
          setQrCodeDataURL(qrDataURL)
        } catch (error) {
          console.error('Error generating QR code:', error)
          toast({
            title: "❌ QR Code Error",
            description: "Failed to generate QR code. Please try again.",
            variant: "destructive"
          })
        } finally {
          setIsGeneratingQR(false)
        }
      }
    }

    generateQRCode()
  }, [walletAddress, toast])

  const copyAddress = () => {
    if (walletAddress === "0x0000000000000000000000000000000000000000") {
      toast({
        title: "⚠️ No Wallet Address",
        description: "Please set up your wallet first.",
        variant: "destructive"
      })
      return
    }

    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "📋 Address Copied!",
      description: "Your magical wallet address is ready to share! ✨",
    })
  }

  const shareAddress = async () => {
    if (walletAddress === "0x0000000000000000000000000000000000000000") {
      toast({
        title: "⚠️ No Wallet Address",
        description: "Please set up your wallet first.",
        variant: "destructive"
      })
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Magic Wallet Address 🪄",
          text: walletAddress,
        })
      } catch (err) {
        copyAddress()
      }
    } else {
      copyAddress()
    }
  }

  // Authentication check
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="glass-effect border-white/30 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-yellow-300 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Authentication Required 🔐</h2>
            <p className="text-white/80">Please log in to access your wallet address.</p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold">
                Go to Login 🚀
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="glass-effect border-white/30 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Something went wrong 😵</h2>
            <p className="text-white/80">Unable to load your wallet information. Please try again.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold"
            >
              Try Again 🔄
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-orange-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-cyan-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Animated Header */}
          <div className="flex items-center gap-6 mb-8">
            <Link href="/wallet">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-12 w-12 transform hover:scale-110 transition-all duration-300">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white animate-bounce">Receive Magic Tokens 📥</h1>
            </div>
          </div>

          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-white text-2xl">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-spin" />
                Your Magic Wallet Address ✨
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Share this magical address to receive tokens from friends and rewards! 🎁
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-white/90 border-4 border-white/50 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-2xl transform hover:scale-105 transition-all duration-300">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        <p className="text-blue-600 font-medium">Generating QR Code...</p>
                      </div>
                    ) : qrCodeDataURL ? (
                      <img
                        src={qrCodeDataURL}
                        alt="Wallet Address QR Code"
                        className="w-56 h-56 rounded-2xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <p className="text-red-600 font-medium text-center px-4">
                          {walletAddress === "0x0000000000000000000000000000000000000000" 
                            ? "No wallet address available" 
                            : "Failed to generate QR code"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  {!isLoading && qrCodeDataURL && (
                    <>
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/30 backdrop-blur-sm">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3 bg-white/10 p-4 rounded-xl">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                      <span className="text-white">Loading address...</span>
                    </div>
                  ) : (
                    <div className="text-center font-mono text-lg text-white break-all bg-white/10 p-4 rounded-xl">
                      {walletAddress === "0x0000000000000000000000000000000000000000" ? (
                        <span className="text-yellow-300 font-normal">
                          ⚠️ No wallet address available
                        </span>
                      ) : (
                        walletAddress
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={copyAddress}
                    disabled={isLoading || walletAddress === "0x0000000000000000000000000000000000000000"}
                    className="h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Copy className="h-5 w-5 mr-2 animate-pulse" />
                    )}
                    Copy 📋
                  </Button>
                  <Button
                    onClick={shareAddress}
                    disabled={isLoading || walletAddress === "0x0000000000000000000000000000000000000000"}
                    className="h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Share className="h-5 w-5 mr-2 animate-bounce" />
                    )}
                    Share 📤
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50 rounded-2xl animate-pulse-glow">
                <div className="text-white font-medium text-lg text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-yellow-300 animate-spin" />
                    <strong>Important Magic Rule! 🔮</strong>
                    <Star className="h-6 w-6 text-yellow-300 animate-spin" />
                  </div>
                  Only send tokens that are compatible with this magical network! Sending incompatible tokens may result
                  in them getting lost in the digital void! 🌌
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
