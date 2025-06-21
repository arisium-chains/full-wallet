export const runtime = 'edge';

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share, Shield, Sparkles, Star, Zap, Copy } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CredentialDetailPage() {
  const params = useParams()
  const { toast } = useToast()

  // Mock credential data - in real app, fetch based on params.id
  const credential = {
    id: 1,
    title: "Web3 Developer Certificate 🎯",
    issuer: "Blockchain Academy",
    type: "SBT",
    date: "2024-01-15",
    status: "verified",
    description:
      "This certificate validates the holder's comprehensive understanding of Web3 technologies, including blockchain fundamentals, smart contracts, and decentralized applications.",
    skills: [
      "Blockchain Fundamentals",
      "Smart Contracts",
      "DeFi Protocols",
      "Web3 Development",
      "Solidity Programming",
    ],
    metadata: {
      tokenId: "0x1234567890abcdef",
      contractAddress: "0xabcdef1234567890",
      network: "Ethereum Mainnet",
      issueDate: "2024-01-15T10:30:00Z",
      expiryDate: null,
    },
  }

  const handleShare = () => {
    const shareUrl = `https://vault.aris.app/credential/${credential.id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "🎉 Link Copied!",
      description: "Credential sharing link copied to clipboard! ✨",
    })
  }

  const handleDownload = () => {
    toast({
      title: "📥 Download Started!",
      description: "Your credential is being prepared for download! 🚀",
    })
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Animated Header */}
          <div className="flex items-center gap-6 mb-8">
            <Link href="/vault">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-12 w-12 transform hover:scale-110 transition-all duration-300">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white animate-pulse">Credential Details 📜</h1>
            </div>
          </div>

          {/* Main Credential Card */}
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-6">
              <div className="relative mx-auto mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Shield className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-white text-3xl font-bold mb-4">{credential.title}</CardTitle>
              <CardDescription className="text-white/80 text-xl">Issued by {credential.issuer} 🏛️</CardDescription>
              <div className="flex items-center justify-center gap-4 mt-6">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg px-6 py-3 animate-pulse">
                  {credential.type} 🎯
                </Badge>
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg px-6 py-3 animate-bounce">
                  ✅ Verified
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Description */}
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-yellow-300 animate-spin" />
                Description 📝
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg leading-relaxed">{credential.description}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Zap className="h-7 w-7 text-blue-300 animate-bounce" />
                Skills Validated 🎯
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {credential.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-base px-4 py-2 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill} ⚡
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Shield className="h-7 w-7 text-green-300 animate-pulse" />
                Blockchain Metadata 🔗
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-white/70 font-medium">Token ID</div>
                  <div className="text-white font-mono bg-white/10 p-3 rounded-lg flex items-center justify-between">
                    <span>{credential.metadata.tokenId}</span>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(credential.metadata.tokenId)
                        toast({ title: "📋 Copied!", description: "Token ID copied to clipboard! ✨" })
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-8 w-8 p-0 transform hover:scale-110 transition-all duration-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/70 font-medium">Contract Address</div>
                  <div className="text-white font-mono bg-white/10 p-3 rounded-lg flex items-center justify-between">
                    <span>{credential.metadata.contractAddress}</span>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(credential.metadata.contractAddress)
                        toast({ title: "📋 Copied!", description: "Contract address copied! ✨" })
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-8 w-8 p-0 transform hover:scale-110 transition-all duration-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/70 font-medium">Network</div>
                  <div className="text-white bg-white/10 p-3 rounded-lg">{credential.metadata.network} 🌐</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/70 font-medium">Issue Date</div>
                  <div className="text-white bg-white/10 p-3 rounded-lg">
                    {new Date(credential.metadata.issueDate).toLocaleDateString()} 📅
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-6">
            <Button
              onClick={handleDownload}
              className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Download className="h-6 w-6 mr-3 animate-bounce" />
              Download Certificate 📥
            </Button>
            <Button
              onClick={handleShare}
              className="h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Share className="h-6 w-6 mr-3 animate-pulse" />
              Share Credential 🚀
            </Button>
          </div>

          {/* Verification Notice */}
          <Card className="glass-effect border-green-400/50 shadow-2xl animate-pulse-glow">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-green-300 animate-pulse" />
                <Star className="h-6 w-6 text-yellow-300 animate-spin" />
                <Shield className="h-8 w-8 text-green-300 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">🔐 Cryptographically Verified! 🔐</h3>
              <p className="text-white/90 text-lg">
                This credential is secured on the blockchain and can be independently verified by anyone! The
                authenticity and integrity are guaranteed by cryptographic proofs! ✨🛡️
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
