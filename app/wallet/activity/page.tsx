"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Search, Filter, Sparkles, Star, Zap, Trophy, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/app/providers/auth-provider"
import { useGetTransactions } from "@/src/hooks/user/useGetTransactions"
import type { Transaction } from "@/src/services/transaction.services"

export default function WalletActivityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  
  const { 
    data: transactionData, 
    isLoading: transactionsLoading, 
    error: transactionsError,
    refetch 
  } = useGetTransactions(currentPage, 20)

  const isLoading = authLoading || transactionsLoading

  // Authentication check
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="glass-effect border-white/30 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-yellow-300 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-white">Authentication Required 🔐</h2>
            <p className="text-white/80">Please log in to view your transaction history.</p>
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
  if (transactionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="glass-effect border-white/30 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Something went wrong 😵</h2>
            <p className="text-white/80">Unable to load transaction history. Please try again.</p>
            <Button 
              onClick={() => refetch()}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold"
            >
              Try Again 🔄
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const transactions = transactionData?.transactions || []
  const stats = transactionData?.stats || {
    totalCount: 0,
    sendCount: 0,
    receiveCount: 0,
    totalSent: '0',
    totalReceived: '0'
  }

  // Helper function to get emoji for transaction
  const getTransactionEmoji = (tx: Transaction) => {
    if (tx.type === 'receive') {
      if (tx.from?.includes('Learn') || tx.from?.includes('Quest')) return '🎯'
      if (tx.from?.includes('Achievement') || tx.from?.includes('Bonus')) return '🏆'
      if (tx.from?.includes('Challenge') || tx.from?.includes('Victory')) return '⚡'
      if (tx.from?.includes('Course') || tx.from?.includes('Completion')) return '🎓'
      return '📥'
    } else {
      if (tx.to?.includes('Sarah') || tx.to?.includes('Buddy')) return '👥'
      if (tx.to?.includes('Coffee') || tx.to?.includes('Donation')) return '☕'
      return '📤'
    }
  }

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Animated Header */}
          <div className="flex items-center gap-6 mb-8">
            <Link href="/wallet">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-12 w-12 transform hover:scale-110 transition-all duration-300">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white animate-pulse">Transaction Adventures 🌟</h1>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    placeholder="Search your magical transactions... ✨"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
                  />
                </div>
                <Button className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105 transition-all duration-300">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter 🔍
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="glass-effect border-white/30 shadow-xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-yellow-300 animate-bounce" />
                {isLoading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-white animate-spin" />
                ) : (
                  <div className="text-3xl font-bold text-white">{stats.totalCount}</div>
                )}
                <div className="text-white/80 font-medium">Total Transactions</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/30 shadow-xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Star className="h-10 w-10 mx-auto mb-3 text-green-300 animate-spin" />
                {isLoading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-white animate-spin" />
                ) : (
                  <div className="text-3xl font-bold text-green-300">+{stats.totalReceived}</div>
                )}
                <div className="text-white/80 font-medium">Tokens Earned</div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-white/30 shadow-xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="h-10 w-10 mx-auto mb-3 text-blue-300 animate-pulse" />
                {isLoading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-white animate-spin" />
                ) : (
                  <div className="text-3xl font-bold text-blue-300">-{stats.totalSent}</div>
                )}
                <div className="text-white/80 font-medium">Tokens Sent</div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-yellow-300 animate-spin" />
                Your Transaction History 📚
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                          <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-white/20 rounded animate-pulse"></div>
                          <div className="w-48 h-3 bg-white/20 rounded animate-pulse"></div>
                          <div className="w-24 h-3 bg-white/20 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="w-20 h-6 bg-white/20 rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-white/20 rounded animate-pulse"></div>
                        <div className="w-20 h-6 bg-white/20 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-6 bg-white/10 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            tx.type === "receive"
                              ? "bg-gradient-to-r from-green-400 to-emerald-600 animate-bounce"
                              : "bg-gradient-to-r from-red-400 to-pink-600 animate-pulse"
                          }`}
                        >
                          <Send className={`h-6 w-6 text-white ${tx.type === "receive" ? "rotate-180" : ""}`} />
                        </div>
                        <span className="text-2xl animate-wiggle">{getTransactionEmoji(tx)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg capitalize">
                          {tx.type === "receive" ? "Received" : "Sent"} 🎉
                        </div>
                        <div className="text-white/80 text-base">
                          {tx.type === "receive" 
                            ? `From ${tx.from || 'Unknown'}`
                            : `To ${tx.to || 'Unknown'}`
                          }
                        </div>
                        <div className="text-white/60 text-sm font-mono">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-2xl ${tx.type === "receive" ? "text-green-300" : "text-red-300"}`}>
                        {tx.amount}
                      </div>
                      <div className="text-white/70 text-sm">{tx.time}</div>
                      <Badge
                        className={`mt-2 ${
                          tx.status === "completed"
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse"
                            : tx.status === "failed"
                            ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        }`}
                      >
                        {tx.status === "completed" && "✅ Completed"}
                        {tx.status === "failed" && "❌ Failed"}
                        {tx.status === "pending" && "⏳ Pending"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">
                    {searchTerm ? "🔍" : "📭"}
                  </div>
                  <div className="text-white text-xl font-bold mb-2">
                    {searchTerm ? "No transactions found!" : "No transactions yet!"}
                  </div>
                  <div className="text-white/70">
                    {searchTerm 
                      ? "Try adjusting your search terms ✨"
                      : "Start using your wallet to see transaction history 🚀"
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
