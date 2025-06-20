"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QRScanner } from "@/components/ui/qr-scanner"
import { ArrowLeft, Send, Sparkles, Zap, Target, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { useWallet } from "@/app/providers/wallet-provider"
import { ethers } from "ethers"
import { fetchTokens } from "@/src/services/token.services"
import type { Token } from "@/src/interfaces/token.interface"

export default function SendTokensPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)
  const [tokens, setTokens] = useState<Token[]>([])
  const [addressError, setAddressError] = useState("")
  const [amountError, setAmountError] = useState("")
  
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { state: walletState, refreshBalance } = useWallet()

  // Load available tokens
  useEffect(() => {
    const loadTokens = async () => {
      if (!user?.walletAddress || !walletState.balance) return
      
      try {
        setIsLoadingTokens(true)
        const availableTokens = await fetchTokens(
          user.walletAddress, 
          walletState.balance.value
        )
        setTokens(availableTokens)
        // Set default token to first available token with balance > 0
        const defaultToken = availableTokens.find(t => parseFloat(t.value) > 0)
        if (defaultToken) {
          setSelectedTokenAddress(defaultToken.address)
        } else if (availableTokens.length > 0) {
          setSelectedTokenAddress(availableTokens[0].address)
        }
      } catch (error) {
        console.error("Error loading tokens:", error)
        toast({
          title: "Error",
          description: "Failed to load token balances",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTokens(false)
      }
    }

    loadTokens()
  }, [user?.walletAddress, walletState.balance, toast])

  // Address validation
  const validateAddress = (address: string) => {
    if (!address) {
      setAddressError("Recipient address is required")
      return false
    }
    if (!ethers.utils.isAddress(address)) {
      setAddressError("Invalid Ethereum address format")
      return false
    }
    setAddressError("")
    return true
  }

  // Amount validation
  const validateAmount = (value: string, tokenBalance: string) => {
    if (!value) {
      setAmountError("Amount is required")
      return false
    }
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      setAmountError("Amount must be greater than 0")
      return false
    }
    const balance = parseFloat(tokenBalance)
    if (numValue > balance) {
      setAmountError("Insufficient balance")
      return false
    }
    setAmountError("")
    return true
  }

  const handleSend = async () => {
    if (!isAuthenticated || !user?.walletAddress) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send tokens",
        variant: "destructive",
      })
      return
    }

    const selectedToken = tokens.find(t => t.address === selectedTokenAddress)
    if (!selectedToken) {
      toast({
        title: "Error",
        description: "Please select a token to send",
        variant: "destructive",
      })
      return
    }

    const isValidAddress = validateAddress(recipient)
    const isValidAmount = validateAmount(amount, selectedToken.value)

    if (!isValidAddress || !isValidAmount) {
      return
    }

    if (recipient.toLowerCase() === user.walletAddress.toLowerCase()) {
      toast({
        title: "Invalid Recipient",
        description: "Cannot send tokens to yourself",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAddress: recipient,
          tokenAddress: selectedTokenAddress,
          amount: amount,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Transfer failed')
      }

      toast({
        title: "🎉 Transaction Sent!",
        description: `Successfully sent ${amount} ${selectedToken.symbol} to ${recipient.slice(0, 6)}...${recipient.slice(-4)}! 🚀`,
      })

      // Clear form and refresh balance
      setRecipient("")
      setAmount("")
      refreshBalance()
    } catch (error) {
      console.error('Transfer error:', error)
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to send transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQRScan = (address: string) => {
    setRecipient(address)
    validateAddress(address)
  }

  const handleMaxAmount = () => {
    const selectedToken = tokens.find(t => t.address === selectedTokenAddress)
    if (selectedToken) {
      setAmount(selectedToken.value)
      validateAmount(selectedToken.value, selectedToken.value)
    }
  }

  const selectedToken = tokens.find(t => t.address === selectedTokenAddress)
  const networkFee = "0.001" // Estimated network fee
  const isFormValid = recipient && amount && selectedTokenAddress && !addressError && !amountError

  // Show loading state if not authenticated or loading tokens
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
        <Card className="glass-effect border-white/30 shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-white mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
            <p className="text-white/80">Please log in to access the send tokens feature.</p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-purple-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
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
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white animate-pulse">Send Magic Tokens 💸</h1>
            </div>
          </div>

          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <Sparkles className="h-8 w-8 text-yellow-300 animate-spin" />
                Send Transaction ✨
              </CardTitle>
              <CardDescription className="text-white/80 text-lg">
                Transfer your magical tokens to friends and fellow students! 🎓
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Token Selection */}
              <div className="space-y-4">
                <Label className="text-white font-bold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-yellow-300 animate-spin" />
                  Choose Your Token 🪙
                </Label>
                {isLoadingTokens ? (
                  <div className="h-14 bg-white/10 border-white/30 rounded-md flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white/70">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading tokens...
                    </div>
                  </div>
                ) : (
                  <Select value={selectedTokenAddress} onValueChange={setSelectedTokenAddress}>
                    <SelectTrigger className="h-14 bg-white/10 border-white/30 text-white backdrop-blur-sm text-lg">
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-sm">
                      {tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address} className="text-lg font-medium">
                          <div className="flex items-center gap-3">
                            {token.logoURI ? (
                              <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                {token.symbol.charAt(0)}
                              </div>
                            )}
                            {token.symbol} ({parseFloat(token.value).toFixed(6)}) {token.symbol === 'XL3' ? '⚡' : '🎯'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Recipient Address */}
              <div className="space-y-4">
                <Label htmlFor="recipient" className="text-white font-bold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-300 animate-pulse" />
                  Recipient Address 📍
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="recipient"
                      placeholder="0x... or ENS name or friend's wallet 🏠"
                      value={recipient}
                      onChange={(e) => {
                        setRecipient(e.target.value)
                        if (e.target.value) validateAddress(e.target.value)
                      }}
                      className={`h-14 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg backdrop-blur-sm ${
                        addressError ? 'border-red-400' : ''
                      }`}
                    />
                    {addressError && (
                      <div className="flex items-center gap-2 mt-2 text-red-300 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {addressError}
                      </div>
                    )}
                  </div>
                  <QRScanner
                    onScan={handleQRScan}
                    className="h-14 w-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-4">
                <Label htmlFor="amount" className="text-white font-bold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-300 animate-bounce" />
                  Amount to Send 💰
                </Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        if (e.target.value && selectedToken) {
                          validateAmount(e.target.value, selectedToken.value)
                        }
                      }}
                      className={`h-14 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg backdrop-blur-sm pr-20 ${
                        amountError ? 'border-red-400' : ''
                      }`}
                      step="any"
                      max={selectedToken ? selectedToken.value : undefined}
                    />
                    <Button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold transform hover:scale-105 transition-all duration-300"
                      onClick={handleMaxAmount}
                      disabled={!selectedToken}
                    >
                      MAX 🔥
                    </Button>
                  </div>
                  {selectedToken && (
                    <div className="text-white/70 text-sm">
                      Available: {parseFloat(selectedToken.value).toFixed(6)} {selectedToken.symbol}
                    </div>
                  )}
                  {amountError && (
                    <div className="flex items-center gap-2 text-red-300 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {amountError}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Summary */}
              {amount && recipient && selectedToken && isFormValid && (
                <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/30 space-y-4 animate-pulse-glow">
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
                    Transaction Summary 📊
                  </h3>
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between text-white">
                      <span>Token:</span>
                      <span className="font-bold">
                        {selectedToken.symbol} 💎
                      </span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Amount:</span>
                      <span className="font-bold">
                        {amount} {selectedToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>To:</span>
                      <span className="font-bold font-mono text-sm">
                        {recipient.slice(0, 6)}...{recipient.slice(-4)} 📍
                      </span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>Network Fee:</span>
                      <span className="font-bold">~{networkFee} XL3 ⚡</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-yellow-300 border-t border-white/30 pt-3">
                      <span>Total Cost:</span>
                      <span>
                        {amount} {selectedToken.symbol} + Fee 🚀
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSend}
                disabled={isLoading || !isFormValid || !isAuthenticated}
                className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending Transaction... ✨
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <AlertCircle className="h-6 w-6 mr-3" />
                    Please Log In 🔐
                  </>
                ) : !isFormValid ? (
                  <>
                    <AlertCircle className="h-6 w-6 mr-3" />
                    Complete Form to Send 📝
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 mr-3 animate-bounce" />
                    Send Transaction! 🚀
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
