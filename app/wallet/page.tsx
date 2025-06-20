"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Copy,
  Send,
  QrCode,
  Activity,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  WalletIcon,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/providers/auth-provider"
import { useWallet } from "@/app/providers/wallet-provider"
import { useGetBalance } from "@/src/hooks/user/useGetBalance"
import { useGetMe } from "@/src/hooks/user/useGetMe"
import { useGetTransactions } from "@/src/hooks/user/useGetTransactions"

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  
  // Use real hooks for data
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { state: walletState } = useWallet()
  const { data: balanceData, isLoading: balanceLoading, error: balanceError } = useGetBalance()
  const { data: userData, isLoading: userLoading, error: userError } = useGetMe()
  const { data: transactionData, isLoading: transactionsLoading } = useGetTransactions(1, 3) // Get latest 3 transactions

  // Loading state
  const isLoading = authLoading || balanceLoading || userLoading || walletState.isLoading || transactionsLoading

  // Error handling
  const hasError = balanceError || userError || walletState.error

  // Get wallet address from various sources
  const walletAddress = useMemo(() => {
    return walletState.walletAddress || 
           balanceData?.walletAddress || 
           userData?.walletAddress || 
           null
  }, [walletState.walletAddress, balanceData?.walletAddress, userData?.walletAddress])

  // Redirect users without wallet addresses to setup page
  useEffect(() => {
    if (isAuthenticated && !isLoading && !walletAddress) {
      router.push('/wallet/setup')
    }
  }, [isAuthenticated, isLoading, walletAddress, router])

  // Format balance data with proper styling
  const balances = useMemo(() => {
    if (!balanceData && !walletState.balance) {
      // Fallback mock data with loading state
      return [
        {
          symbol: "ARIS",
          amount: isLoading ? "..." : "0.00",
          value: isLoading ? "..." : "$0.00",
          change: "+0.0%",
          color: "from-indigo-500 to-purple-600",
          bgColor: "from-indigo-50 to-purple-50",
        },
      ]
    }

    const balance = balanceData || walletState.balance
    if (!balance) return []

    // Handle single balance object or array
    const balanceArray = Array.isArray(balance) ? balance : [balance]
    
    return balanceArray.map((bal, index) => {
      const colors = [
        { color: "from-indigo-500 to-purple-600", bgColor: "from-indigo-50 to-purple-50" },
        { color: "from-blue-500 to-cyan-600", bgColor: "from-blue-50 to-cyan-50" },
        { color: "from-emerald-500 to-teal-600", bgColor: "from-emerald-50 to-teal-50" },
      ]
      
      return {
        symbol: bal.symbol || "UNKNOWN",
        amount: bal.displayValue || bal.value || "0.00",
        value: `$${parseFloat(bal.value || "0").toFixed(2)}`,
        change: "+0.0%", // You can calculate this based on historical data
        ...colors[index % colors.length],
      }
    })
  }, [balanceData, walletState.balance, isLoading])

  // Calculate total portfolio value
  const totalPortfolioValue = useMemo(() => {
    if (isLoading) return "..."
    if (!balances.length) return "$0.00"
    
    const total = balances.reduce((sum, balance) => {
      const value = parseFloat(balance.value.replace('$', '')) || 0
      return sum + value
    }, 0)
    
    return `$${total.toFixed(2)}`
  }, [balances, isLoading])

  // Real recent transactions from blockchain
  const recentTransactions = useMemo(() => {
    return transactionData?.transactions?.slice(0, 3) || []
  }, [transactionData])

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({
        title: "✅ Address Copied!",
        description: "Wallet address copied to clipboard 📋",
      })
    }
  }

  // Show loading state while redirecting users without wallets
  if (isAuthenticated && !isLoading && !walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-white animate-spin mx-auto" />
            <p className="text-white text-lg">Setting up your wallet...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (hasError && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Error Loading Wallet</h3>
            <p className="text-slate-600 mb-4">There was an issue loading your wallet data. Please try again.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <WalletIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    My Wallet 💳
                  </h1>
                  <p className="text-slate-600 text-lg">
                    {isAuthenticated && user ? 
                      `Welcome back, ${user.name || 'User'}!` : 
                      'Manage your digital assets and transactions'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`border-0 px-4 py-2 ${
                isAuthenticated 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                  : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              }`}>
                <Shield className="h-3 w-3 mr-2" />
                {isAuthenticated ? "Secured 🔒" : "Connecting..."}
              </Badge>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl border border-slate-200 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <WalletIcon className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-600 mb-1">Wallet Address</div>
              {isLoading ? (
                <div className="w-48 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
              ) : walletAddress ? (
                <span className="font-mono text-slate-800 text-lg font-bold">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              ) : (
                <span className="text-slate-500 text-lg font-medium">
                  No wallet address
                </span>
              )}
            </div>
            <Button
              onClick={copyAddress}
              disabled={isLoading || !walletAddress}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy 📋
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
          <CardHeader className="pb-6 relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                Portfolio Balance 💰
              </CardTitle>
              <Button
                onClick={() => setShowBalance(!showBalance)}
                className="bg-white/80 text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md transition-all"
              >
                {showBalance ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showBalance ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-8">
              <div className="text-center p-8 bg-white/80 rounded-2xl border border-slate-200 shadow-lg">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="w-48 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse mx-auto"></div>
                    <div className="w-32 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-3">
                      {showBalance ? totalPortfolioValue : "****"}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-bold text-lg">+8.7% (24h) 📈</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                {balances.map((balance, index) => (
                  <div
                    key={`${balance.symbol}-${index}`}
                    className="p-6 rounded-2xl border border-slate-200 bg-white/80 hover:bg-white hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${balance.color} flex items-center justify-center shadow-lg`}
                        >
                          {isLoading ? (
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          ) : (
                            <span className="font-bold text-white text-lg">{balance.symbol[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xl">
                            {isLoading ? (
                              <div className="w-16 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                            ) : (
                              balance.symbol
                            )}
                          </div>
                          <div className="text-slate-600 font-medium">
                            {isLoading ? (
                              <div className="w-20 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                            ) : (
                              balance.amount
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800 text-xl">
                          {isLoading ? (
                            <div className="w-24 h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                          ) : (
                            showBalance ? balance.value : "****"
                          )}
                        </div>
                        <div
                          className={`font-bold ${balance.change.startsWith("+") ? "text-emerald-600" : balance.change.startsWith("-") ? "text-red-500" : "text-slate-600"}`}
                        >
                          {isLoading ? (
                            <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                          ) : (
                            balance.change
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          <Link href="/wallet/send" className={isLoading ? "pointer-events-none" : ""}>
            <Card className={`border-0 shadow-xl bg-gradient-to-r from-red-50 to-pink-50 hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
              isLoading ? "opacity-75" : ""
            }`}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Send className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="font-bold text-slate-800 text-xl mb-2">Send 📤</div>
                <div className="text-slate-600">Transfer tokens to others</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wallet/receive" className={isLoading ? "pointer-events-none" : ""}>
            <Card className={`border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
              isLoading ? "opacity-75" : ""
            }`}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <QrCode className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="font-bold text-slate-800 text-xl mb-2">Receive 📥</div>
                <div className="text-slate-600">Get tokens from others</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wallet/activity" className={isLoading ? "pointer-events-none" : ""}>
            <Card className={`border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
              isLoading ? "opacity-75" : ""
            }`}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <Activity className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="font-bold text-slate-800 text-xl mb-2">Activity 📊</div>
                <div className="text-slate-600">View transaction history</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                Recent Transactions 📈
              </CardTitle>
              <Link href="/wallet/activity">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all">
                  View all 👀
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton for transactions
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`loading-${index}`}
                    className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="w-32 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="w-20 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse ml-auto"></div>
                      <div className="w-16 h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse ml-auto"></div>
                    </div>
                  </div>
                ))
              ) : (
                recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                          tx.type === "receive"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                            : "bg-gradient-to-r from-red-500 to-pink-600"
                        }`}
                      >
                        {tx.type === "receive" ? (
                          <ArrowDownLeft className="h-6 w-6 text-white" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg capitalize">
                          {tx.type === "receive" ? `From ${tx.from}` : `To ${tx.to}`}
                        </div>
                        <div className="text-slate-600 font-medium">{tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-xl ${tx.type === "receive" ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.amount}
                      </div>
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 font-bold">
                        ✅ {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
