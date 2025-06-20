"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Shield,
  Key,
  Smartphone,
  Download,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Lock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function SecuritySettingsPage() {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const { toast } = useToast()

  const seedPhrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

  const securityFeatures = [
    {
      title: "Two-Factor Authentication 📱",
      description: "Add an extra layer of security with 2FA",
      enable: twoFactorEnabled,
      setEnable: setTwoFactorEnabled,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Biometric Authentication 👆",
      description: "Use fingerprint or face recognition",
      enable: biometricEnabled,
      setEnable: setBiometricEnabled,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase)
    toast({
      title: "📋 Seed Phrase Copied!",
      description: "Your recovery phrase has been copied. Keep it safe! 🔒",
    })
  }

  const handleBackupWallet = () => {
    toast({
      title: "💾 Backup Created!",
      description: "Your wallet backup has been created and downloaded! ✨",
    })
  }

  const handleChangePassword = () => {
    toast({
      title: "🔐 Password Updated!",
      description: "Your password has been successfully changed! 🎉",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10 pb-24">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Link href="/settings">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-12 w-12 transform hover:scale-110 transition-all duration-300">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white animate-pulse">Security Settings 🛡️</h1>
          </div>
        </div>

        {/* Security Status */}
        <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-300 animate-spin" />
              Security Status 📊
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl border border-green-400/50">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300 animate-bounce" />
                <div className="text-2xl font-bold text-green-300">Excellent</div>
                <div className="text-white/80 font-medium">Overall Security</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl border border-blue-400/50">
                <Shield className="h-16 w-16 mx-auto mb-4 text-blue-300 animate-pulse" />
                <div className="text-2xl font-bold text-blue-300">5/5</div>
                <div className="text-white/80 font-medium">Security Features</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl border border-purple-400/50">
                <Star className="h-16 w-16 mx-auto mb-4 text-purple-300 animate-wiggle" />
                <div className="text-2xl font-bold text-purple-300">Premium</div>
                <div className="text-white/80 font-medium">Security Tier</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Backup */}
        <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Key className="h-8 w-8 text-yellow-300 animate-bounce" />
              Wallet Backup & Recovery 🔑
            </CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Secure your wallet with backup options and recovery phrases! 💾
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Seed Phrase */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white font-bold text-xl">Recovery Seed Phrase 🌱</Label>
                <Button
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold"
                >
                  {showSeedPhrase ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                  {showSeedPhrase ? "Hide" : "Show"}
                </Button>
              </div>

              <div className="p-6 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl border border-red-400/50 animate-pulse-glow">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-300 animate-bounce" />
                  <strong className="text-red-200 text-lg">⚠️ Critical Security Warning ⚠️</strong>
                </div>
                <div className="text-white/90 font-medium">
                  Never share your seed phrase with anyone! This gives complete access to your wallet! Store it safely
                  offline and never take screenshots! 🔒
                </div>
              </div>

              {showSeedPhrase && (
                <div className="space-y-4">
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
                  <div className="flex gap-4">
                    <Button
                      onClick={handleCopySeed}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold h-12"
                    >
                      <Copy className="h-5 w-5 mr-2 animate-pulse" />
                      Copy Seed Phrase 📋
                    </Button>
                    <Button
                      onClick={handleBackupWallet}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold h-12"
                    >
                      <Download className="h-5 w-5 mr-2 animate-bounce" />
                      Download Backup 💾
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
        <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-green-300 animate-pulse" />
              Authentication Settings 🔐
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-6 bg-white/10 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center animate-pulse`}
                  >
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">{feature.title}</div>
                    <div className="text-white/80">{feature.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={`font-bold ${
                      feature.enable
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse"
                        : "bg-white/20 text-white/70"
                    }`}
                  >
                    {feature.enable ? "✅ Enabled" : "❌ Disabled"}
                  </Badge>
                  <Switch
                    checked={feature.enable}
                    onCheckedChange={feature.setEnable}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-emerald-500"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Password Management */}
        <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Lock className="h-8 w-8 text-purple-300 animate-wiggle" />
              Password Management 🔑
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-white font-bold text-lg">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-white font-bold text-lg">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Key className="h-6 w-6 mr-3 animate-bounce" />
              Update Password 🔐
            </Button>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="glass-effect border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-300 animate-spin" />
              Security Best Practices 💡
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Use Strong Passwords",
                  tip: "Create unique, complex passwords for all accounts",
                },
                { icon: Smartphone, title: "Enable 2FA", tip: "Always use two-factor authentication when available" },
                { icon: Eye, title: "Stay Alert", tip: "Be cautious of phishing attempts and suspicious links" },
                {
                  icon: Download,
                  title: "Regular Backups",
                  tip: "Keep your wallet and important data backed up safely",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/10 rounded-xl transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="h-8 w-8 text-yellow-300 animate-pulse" />
                  <div>
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-white/80 text-sm">{item.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
