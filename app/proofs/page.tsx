"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Zap,
  Eye,
  Copy,
  Download,
  Share,
  Sparkles,
  Star,
  Lock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProofsPage() {
  const [selectedProofType, setSelectedProofType] = useState("age")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState<string | null>(null)
  const { toast } = useToast()

  const proofTypes = [
    {
      id: "age",
      title: "Age Verification 🎂",
      description: "Prove you're over 18 without revealing your exact age",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      complexity: "Simple",
    },
    {
      id: "education",
      title: "Education Level 🎓",
      description: "Prove your education credentials without revealing the institution",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      complexity: "Medium",
    },
    {
      id: "income",
      title: "Income Range 💰",
      description: "Prove your income bracket without revealing exact salary",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      complexity: "Advanced",
    },
    {
      id: "location",
      title: "Location Proof 🌍",
      description: "Prove you're in a specific region without revealing exact location",
      icon: Eye,
      color: "from-orange-500 to-red-500",
      complexity: "Simple",
    },
  ]

  const existingProofs = [
    {
      id: 1,
      type: "Age Verification",
      statement: "User is over 18 years old",
      created: "2024-01-15",
      verified: true,
      uses: 3,
      hash: "0x1234...abcd",
    },
    {
      id: 2,
      type: "Education Level",
      statement: "User has bachelor's degree or higher",
      created: "2024-01-10",
      verified: true,
      uses: 1,
      hash: "0x5678...efgh",
    },
    {
      id: 3,
      type: "Income Range",
      statement: "User earns between $50k-$100k annually",
      created: "2024-01-05",
      verified: false,
      uses: 0,
      hash: "0x9abc...ijkl",
    },
  ]

  const handleGenerateProof = async () => {
    setIsGenerating(true)

    // Simulate proof generation
    setTimeout(() => {
      const mockProof = `zk_proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setGeneratedProof(mockProof)
      setIsGenerating(false)
      toast({
        title: "🎉 ZK Proof Generated!",
        description: "Your zero-knowledge proof has been successfully created! Privacy preserved! ✨",
      })
    }, 3000)
  }

  const handleCopyProof = (proof: string) => {
    navigator.clipboard.writeText(proof)
    toast({
      title: "📋 Proof Copied!",
      description: "Zero-knowledge proof copied to clipboard! 🔐",
    })
  }

  const selectedProof = proofTypes.find((p) => p.id === selectedProofType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10 pb-24">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
          </div>
          <h1 className="text-5xl font-bold text-white animate-bounce">ZK Proof Generator 🔮</h1>
          <p className="text-white/90 text-xl animate-pulse max-w-3xl mx-auto">
            Generate zero-knowledge proofs to verify claims about yourself without revealing sensitive information!
            Privacy-first verification powered by advanced cryptography! ✨
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm border-white/30 h-16">
            <TabsTrigger
              value="generate"
              className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Generate Proof 🔧
            </TabsTrigger>
            <TabsTrigger
              value="existing"
              className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              My Proofs 📋
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-8">
            {/* Proof Type Selection */}
            <Card className="glass-effect border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-300 animate-pulse" />
                  Select Proof Type 🎯
                </CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Choose what you want to prove while keeping your data private! 🔐
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {proofTypes.map((proof, index) => (
                    <div
                      key={proof.id}
                      onClick={() => setSelectedProofType(proof.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                        selectedProofType === proof.id
                          ? "bg-gradient-to-r from-white/20 to-white/10 border-white/50 animate-pulse-glow"
                          : "bg-white/10 border-white/20 hover:bg-white/20"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${proof.color} rounded-2xl flex items-center justify-center shadow-lg animate-pulse`}
                        >
                          <proof.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-xl mb-2">{proof.title}</h3>
                          <p className="text-white/80 mb-3">{proof.description}</p>
                          <Badge className={`bg-gradient-to-r ${proof.color} text-white font-bold`}>
                            {proof.complexity} Level
                          </Badge>
                        </div>
                        {selectedProofType === proof.id && (
                          <CheckCircle className="h-6 w-6 text-green-300 animate-bounce" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Proof Configuration */}
            {selectedProof && (
              <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <selectedProof.icon className="h-8 w-8 text-yellow-300 animate-bounce" />
                    Configure {selectedProof.title} ⚙️
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedProofType === "age" && (
                    <div className="space-y-4">
                      <Label className="text-white font-bold text-lg">Minimum Age Threshold</Label>
                      <Input
                        type="number"
                        placeholder="18"
                        className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg"
                      />
                      <div className="p-4 bg-blue-400/20 rounded-xl border border-blue-400/50">
                        <div className="text-white font-medium">
                          🔐 This will generate a proof that you are over the specified age without revealing your
                          actual birthdate or age.
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProofType === "education" && (
                    <div className="space-y-4">
                      <Label className="text-white font-bold text-lg">Education Level</Label>
                      <select className="w-full h-12 bg-white/10 border border-white/30 rounded-lg text-white px-4">
                        <option value="highschool">High School Graduate</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD</option>
                      </select>
                      <div className="p-4 bg-green-400/20 rounded-xl border border-green-400/50">
                        <div className="text-white font-medium">
                          🎓 This will prove your education level without revealing which institution you attended or
                          your grades.
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProofType === "income" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white font-bold text-lg">Minimum Income</Label>
                          <Input
                            type="number"
                            placeholder="50000"
                            className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-white font-bold text-lg">Maximum Income</Label>
                          <Input
                            type="number"
                            placeholder="100000"
                            className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg"
                          />
                        </div>
                      </div>
                      <div className="p-4 bg-purple-400/20 rounded-xl border border-purple-400/50">
                        <div className="text-white font-medium">
                          💰 This will prove your income falls within the specified range without revealing your exact
                          salary or employer.
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProofType === "location" && (
                    <div className="space-y-4">
                      <Label className="text-white font-bold text-lg">Region/Country</Label>
                      <Input
                        placeholder="United States"
                        className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg"
                      />
                      <div className="p-4 bg-orange-400/20 rounded-xl border border-orange-400/50">
                        <div className="text-white font-medium">
                          🌍 This will prove you're located in the specified region without revealing your exact address
                          or city.
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateProof}
                    disabled={isGenerating}
                    className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generating ZK Proof... 🔮
                      </div>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-3 animate-bounce" />
                        Generate Zero-Knowledge Proof! ⚡
                      </>
                    )}
                  </Button>

                  {generatedProof && (
                    <div className="p-6 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl border border-green-400/50 animate-pulse-glow">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-300 animate-bounce" />
                        <h3 className="text-white font-bold text-xl">Proof Generated Successfully! 🎉</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white font-bold">Generated Proof Hash:</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 p-3 bg-white/10 rounded-lg font-mono text-white text-sm break-all">
                              {generatedProof}
                            </div>
                            <Button
                              onClick={() => handleCopyProof(generatedProof)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-12 w-12 p-0"
                            >
                              <Copy className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold">
                            <Download className="h-5 w-5 mr-2" />
                            Download Proof
                          </Button>
                          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold">
                            <Share className="h-5 w-5 mr-2" />
                            Share Proof
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="existing" className="space-y-6">
            <Card className="glass-effect border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-300 animate-pulse" />
                  Your Generated Proofs 📋
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {existingProofs.map((proof, index) => (
                  <div
                    key={proof.id}
                    className="p-6 bg-white/10 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            proof.verified
                              ? "bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse"
                              : "bg-gradient-to-r from-yellow-400 to-orange-600 animate-bounce"
                          }`}
                        >
                          {proof.verified ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl">{proof.type}</h3>
                          <p className="text-white/80 text-lg">{proof.statement}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-white/70">Created: {proof.created}</span>
                            <span className="text-white/70">Used: {proof.uses} times</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge
                          className={`font-bold ${
                            proof.verified
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse"
                              : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-bounce"
                          }`}
                        >
                          {proof.verified ? "✅ Verified" : "⏳ Pending"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopyProof(proof.hash)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-8 w-8 p-0">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-white/70 text-sm font-mono break-all">Hash: {proof.hash}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Lock className="h-8 w-8 text-purple-300 animate-wiggle" />
              How Zero-Knowledge Proofs Work 🧠
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/50">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto mb-3 text-blue-300 animate-pulse" />
                  <h3 className="font-bold text-white text-lg mb-2">Privacy First 🔐</h3>
                  <p className="text-white/80">
                    Prove statements about your data without revealing the actual data itself.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/50">
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-3 text-green-300 animate-bounce" />
                  <h3 className="font-bold text-white text-lg mb-2">Cryptographically Secure 🛡️</h3>
                  <p className="text-white/80">
                    Mathematically guaranteed security using advanced cryptographic techniques.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/50">
                <div className="text-center">
                  <Zap className="h-12 w-12 mx-auto mb-3 text-purple-300 animate-wiggle" />
                  <h3 className="font-bold text-white text-lg mb-2">Instantly Verifiable ⚡</h3>
                  <p className="text-white/80">
                    Anyone can verify your proofs instantly without accessing your private information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
