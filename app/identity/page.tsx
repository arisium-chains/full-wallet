"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, AlertCircle, Eye, Smartphone, Globe, Sparkles, Star, Zap, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function IdentityPage() {
  const [verificationStep, setVerificationStep] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const verificationSteps = [
    {
      title: "Worldcoin Verification 🌍",
      description: "Verify your humanity with World ID",
      completed: false,
      emoji: "🤖",
    },
    { title: "Biometric Scan 👁️", description: "Secure iris scan verification", completed: false, emoji: "👀" },
    { title: "ZK Proof Generation 🔮", description: "Generate zero-knowledge proof", completed: false, emoji: "⚡" },
    { title: "Identity Badge 🏆", description: "Receive your verified identity badge", completed: false, emoji: "🎯" },
  ]

  const handleVerification = async () => {
    setIsVerifying(true)

    // Simulate verification process
    for (let i = 0; i <= 3; i++) {
      setTimeout(() => {
        setVerificationStep(i)
        if (i === 3) {
          setIsVerifying(false)
          toast({
            title: "🎉 Identity Verified!",
            description:
              "Your magical ZK identity has been successfully verified! You're now part of the verified community! ✨",
          })
        }
      }, i * 2000)
    }
  }

  const progress = (verificationStep / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Animated Header */}
        <div className="text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
          </div>
          <h1 className="text-4xl font-bold text-white animate-bounce">ZK Identity Setup 🔮</h1>
          <p className="text-white/90 text-xl animate-pulse">
            Verify your magical identity with zero-knowledge proofs! ✨
          </p>
        </div>

        {/* Status Card */}
        <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="h-6 w-6 text-white" />
              </div>
              Identity Status 🛡️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationStep === 0 ? (
              <Alert className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/50 animate-pulse-glow">
                <AlertCircle className="h-6 w-6 text-yellow-300" />
                <AlertDescription className="text-white font-medium text-lg">
                  🔍 Your identity is not yet verified! Complete the magical verification process to unlock all premium
                  features and join the verified community! 🌟
                </AlertDescription>
              </Alert>
            ) : verificationStep < 3 ? (
              <Alert className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 border-blue-400/50 animate-pulse">
                <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                <AlertDescription className="text-white font-medium text-lg">
                  ⚡ Verification magic in progress... Please wait while we process your identity with advanced
                  cryptographic spells! 🔮
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border-green-400/50 animate-pulse-glow">
                <CheckCircle className="h-6 w-6 text-green-300" />
                <AlertDescription className="text-white font-medium text-lg">
                  🎉 Congratulations! Your identity has been successfully verified with zero-knowledge proofs! You're
                  now a verified member of the ARIS community! 🏆✨
                </AlertDescription>
              </Alert>
            )}

            {verificationStep > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>🚀 Verification Progress</span>
                  <span>{Math.round(progress)}% Complete!</span>
                </div>
                <Progress value={progress} className="h-4 bg-white/20" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Steps */}
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Target className="h-7 w-7 text-yellow-300 animate-spin" />
              Verification Quest Steps 🎯
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Complete these magical steps to establish your verified identity! 🌟
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-6 p-6 rounded-2xl border border-white/20 bg-white/5 transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index < verificationStep
                        ? "bg-gradient-to-r from-green-400 to-emerald-600 animate-bounce"
                        : index === verificationStep && isVerifying
                          ? "bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"
                          : "bg-white/20"
                    }`}
                  >
                    {index < verificationStep ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-3xl animate-wiggle">{step.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl">{step.title}</h3>
                  <p className="text-white/80 text-lg">{step.description}</p>
                </div>
                {index < verificationStep && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg px-4 py-2 animate-pulse">
                    ✅ Complete!
                  </Badge>
                )}
                {index === verificationStep && isVerifying && (
                  <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-lg px-4 py-2 animate-bounce">
                    ⚡ Processing...
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Star className="h-7 w-7 text-yellow-300 animate-bounce" />
              Amazing Benefits of Verified Identity 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                <Shield className="h-8 w-8 text-blue-300 animate-pulse" />
                <span className="text-white font-medium text-lg">
                  Access to premium features and higher earning potential 💰
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                <Eye className="h-8 w-8 text-green-300 animate-bounce" />
                <span className="text-white font-medium text-lg">
                  Privacy-preserving verification without revealing personal data 🔐
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                <Smartphone className="h-8 w-8 text-purple-300 animate-wiggle" />
                <span className="text-white font-medium text-lg">
                  Enhanced security for wallet and credential management 🛡️
                </span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-400/30">
                <Globe className="h-8 w-8 text-orange-300 animate-spin" />
                <span className="text-white font-medium text-lg">
                  Global recognition and interoperability across platforms 🌍
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {verificationStep === 0 && (
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Button
                onClick={handleVerification}
                disabled={isVerifying}
                className="w-full h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {isVerifying ? (
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying Your Magic Identity... ✨
                  </div>
                ) : (
                  <>
                    <Zap className="h-8 w-8 mr-4 animate-bounce" />
                    Start Identity Verification Quest! 🚀
                  </>
                )}
              </Button>
              <p className="text-white/80 text-lg mt-4">
                🔮 This process uses Worldcoin's World ID for secure, privacy-preserving verification magic! ✨
              </p>
            </CardContent>
          </Card>
        )}

        {verificationStep === 3 && (
          <Card className="glass-effect border-green-400/50 shadow-2xl animate-pulse-glow">
            <CardContent className="p-8 text-center">
              <div className="relative mb-8">
                <CheckCircle className="h-24 w-24 text-green-300 mx-auto animate-bounce" />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 animate-bounce">🎉 Identity Verified! 🎉</h3>
              <p className="text-white/90 text-xl mb-8">
                Congratulations! You now have a verified ZK identity! Your magical identity badge has been added to your
                vault! 🏆✨
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-xl px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <Shield className="h-6 w-6 mr-3 animate-pulse" />
                View Identity Badge 🎯
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
