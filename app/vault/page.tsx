import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Award, GraduationCap, Building, Eye, Sparkles, Star, Trophy, Zap } from "lucide-react"
import Link from "next/link"

export default function VaultPage() {
  const credentials = [
    {
      id: 1,
      title: "Web3 Developer Certificate 🎯",
      issuer: "Blockchain Academy",
      type: "SBT",
      date: "2024-01-15",
      status: "verified",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      emoji: "🎓",
    },
    {
      id: 2,
      title: "KYC Verification Badge 🛡️",
      issuer: "Identity Provider",
      type: "VC",
      date: "2024-01-10",
      status: "verified",
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      emoji: "🔐",
    },
    {
      id: 3,
      title: "Employment History Record 💼",
      issuer: "TechCorp Inc.",
      type: "VC",
      date: "2023-12-20",
      status: "verified",
      icon: Building,
      color: "from-purple-500 to-pink-500",
      emoji: "🏢",
    },
    {
      id: 4,
      title: "Achievement Master Badge 🏆",
      issuer: "ARIS Platform",
      type: "SBT",
      date: "2024-01-05",
      status: "verified",
      icon: Award,
      color: "from-yellow-500 to-orange-500",
      emoji: "⭐",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-green-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-orange-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Animated Header */}
        <div className="text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
          </div>
          <h1 className="text-4xl font-bold text-white animate-bounce">Credential Vault 🏛️</h1>
          <p className="text-white/90 text-xl animate-pulse">
            Your magical collection of verified achievements and credentials! ✨
          </p>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="relative">
                <Shield className="h-16 w-16 mx-auto mb-4 text-blue-300 animate-pulse" />
                <Star className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-spin" />
              </div>
              <div className="text-4xl font-bold text-blue-300 animate-bounce">2</div>
              <div className="text-white/90 font-bold text-lg">Verifiable Credentials 📜</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="relative">
                <Award className="h-16 w-16 mx-auto mb-4 text-yellow-300 animate-bounce" />
                <Star className="absolute -top-2 -right-2 h-6 w-6 text-pink-300 animate-ping" />
              </div>
              <div className="text-4xl font-bold text-yellow-300 animate-pulse">2</div>
              <div className="text-white/90 font-bold text-lg">Soul Bound Tokens 🎯</div>
            </CardContent>
          </Card>
        </div>

        {/* Credentials List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-300 animate-bounce" />
            Your Amazing Credentials 🌟
          </h2>
          {credentials.map((credential, index) => (
            <Card
              key={credential.id}
              className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${credential.color} rounded-2xl flex items-center justify-center animate-pulse shadow-lg`}
                      >
                        <credential.icon className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-3xl animate-bounce">{credential.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-xl mb-2">{credential.title}</h3>
                      <p className="text-white/80 text-lg mb-4">Issued by {credential.issuer} 🏛️</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge
                          className={`font-bold text-lg px-4 py-2 ${
                            credential.type === "SBT"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white animate-bounce"
                          }`}
                        >
                          {credential.type} {credential.type === "SBT" ? "🎯" : "📜"}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold animate-pulse border-0">
                          ✅ {credential.status}
                        </Badge>
                        <span className="text-white/70 font-medium">
                          📅 {new Date(credential.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/vault/${credential.id}`}>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold h-12 w-12 transform hover:scale-110 transition-all duration-300 shadow-lg">
                      <Eye className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {credentials.length === 0 && (
          <Card className="glass-effect border-white/30 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="relative mb-8">
                <Shield className="h-24 w-24 mx-auto text-white/60" />
                <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-300 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Magical Credentials Yet! 🎭</h3>
              <p className="text-white/80 text-lg mb-8">
                Complete epic learning quests and verify your identity to start collecting amazing credentials! 🚀
              </p>
              <Link href="/learn">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  <Zap className="h-6 w-6 mr-3 animate-bounce" />
                  Start Your Adventure! 🎯
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
