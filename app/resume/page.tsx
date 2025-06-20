"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Share, Eye, Edit, Sparkles, Star, Zap, Trophy, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResumePage() {
  const [selectedCredentials, setSelectedCredentials] = useState<number[]>([1, 2, 3])
  const { toast } = useToast()

  const credentials = [
    {
      id: 1,
      title: "Web3 Developer Certificate",
      issuer: "Blockchain Academy",
      verified: true,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      emoji: "🎓",
    },
    {
      id: 2,
      title: "KYC Verification Badge",
      issuer: "Identity Provider",
      verified: true,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      emoji: "🔐",
    },
    {
      id: 3,
      title: "Employment History Record",
      issuer: "TechCorp Inc.",
      verified: true,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      emoji: "🏢",
    },
    {
      id: 4,
      title: "Achievement Master Badge",
      issuer: "ARIS Platform",
      verified: true,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      emoji: "⭐",
    },
  ]

  const handleExport = (format: "pdf" | "json") => {
    toast({
      title: "🎉 Export Started!",
      description: `Your professional resume is being exported as ${format.toUpperCase()}! ✨`,
    })
  }

  const handleShare = () => {
    const shareUrl = "https://resume.aris.app/john-doe-zkresume"
    navigator.clipboard.writeText(shareUrl)
    toast({
      title: "🔗 Link Copied!",
      description: "Resume sharing link copied to clipboard! Share your achievements! 🚀",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="container mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Resume Builder 📄
                </h1>
                <p className="text-slate-600 text-lg">Create your professional zkCV from verified credentials!</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="builder" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 shadow-lg h-16 p-2">
            <TabsTrigger
              value="builder"
              className="text-slate-700 font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
            >
              🛠️ Builder
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="text-slate-700 font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl"
            >
              👁️ Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-8">
            {/* Personal Information */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  Personal Information 👤
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Basic information from your verified identity ✨
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-slate-700 font-bold text-lg">Full Name 📝</label>
                    <div className="p-4 bg-white rounded-xl text-slate-800 font-semibold text-lg border border-slate-200 shadow-sm">
                      John Doe 🎓
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-slate-700 font-bold text-lg">Email 📧</label>
                    <div className="p-4 bg-white rounded-xl text-slate-800 font-semibold text-lg border border-slate-200 shadow-sm">
                      john.doe@example.com
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-slate-700 font-bold text-lg">Professional Title 💼</label>
                  <div className="p-4 bg-white rounded-xl text-slate-800 font-semibold text-lg border border-slate-200 shadow-sm">
                    Web3 Developer & Blockchain Wizard 🧙‍♂️
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all px-6 py-3">
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Information ✏️
                </Button>
              </CardContent>
            </Card>

            {/* Credential Selection */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  Select Credentials 🎯
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Choose which verified credentials to showcase in your resume! ⭐
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {credentials.map((credential, index) => (
                  <div
                    key={credential.id}
                    className={`flex items-center justify-between p-6 border-2 rounded-2xl transition-all duration-300 ${
                      selectedCredentials.includes(credential.id)
                        ? `border-emerald-300 bg-gradient-to-r ${credential.bgColor} shadow-lg`
                        : "border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <input
                        type="checkbox"
                        checked={selectedCredentials.includes(credential.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCredentials([...selectedCredentials, credential.id])
                          } else {
                            setSelectedCredentials(selectedCredentials.filter((id) => id !== credential.id))
                          }
                        }}
                        className="w-6 h-6 rounded-lg accent-emerald-500"
                      />
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${credential.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-3xl">{credential.emoji}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xl">{credential.title}</div>
                        <div className="text-slate-600 font-medium">Issued by {credential.issuer} 🏛️</div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg px-4 py-2 shadow-md">
                      ✅ Verified
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader className="pb-6">
                <CardTitle className="text-slate-800 text-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  Export & Share 🚀
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Export your professional resume or create a shareable link! ✨
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    onClick={() => handleExport("pdf")}
                    className="h-16 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg font-bold"
                  >
                    <Download className="h-6 w-6 mr-3" />
                    Export PDF 📄
                  </Button>
                  <Button
                    onClick={() => handleExport("json")}
                    className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg font-bold"
                  >
                    <FileText className="h-6 w-6 mr-3" />
                    Export JSON 📊
                  </Button>
                </div>
                <Button
                  onClick={handleShare}
                  className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-xl font-bold"
                >
                  <Share className="h-6 w-6 mr-3" />
                  Create Shareable Link 🔗
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            {/* Resume Preview */}
            <Card className="border-0 shadow-2xl bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  Resume Preview 👁️
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Preview how your professional zkCV will appear! ✨
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-10 space-y-8 max-w-4xl mx-auto shadow-2xl">
                  {/* Header */}
                  <div className="text-center border-b-2 border-slate-200 pb-8">
                    <div className="relative inline-block mb-6">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        John Doe 🎓
                      </h1>
                      <div className="absolute -top-4 -right-12 w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl text-slate-700 font-semibold mb-4">Web3 Developer & Blockchain Wizard 🧙‍♂️</p>
                    <p className="text-lg text-slate-600 mb-6">john.doe@example.com 📧</p>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg px-8 py-3 shadow-lg">
                      🔐 ZK Verified Identity
                    </Badge>
                  </div>

                  {/* Credentials Section */}
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                      <Trophy className="h-8 w-8 text-amber-500" />
                      Verified Credentials ⭐
                    </h2>
                    <div className="space-y-6">
                      {credentials
                        .filter((c) => selectedCredentials.includes(c.id))
                        .map((credential, index) => (
                          <div
                            key={credential.id}
                            className={`flex items-center justify-between p-8 bg-gradient-to-r ${credential.bgColor} rounded-3xl border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all`}
                          >
                            <div className="flex items-center gap-6">
                              <div
                                className={`w-16 h-16 bg-gradient-to-r ${credential.color} rounded-2xl flex items-center justify-center shadow-lg`}
                              >
                                <Trophy className="h-8 w-8 text-white" />
                              </div>
                              <span className="text-4xl">{credential.emoji}</span>
                              <div>
                                <div className="font-bold text-slate-800 text-2xl mb-2">{credential.title}</div>
                                <div className="text-slate-700 text-lg">Issued by {credential.issuer} 🏛️</div>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg px-6 py-3 shadow-md">
                              ✅ Verified
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* ZK Proof Notice */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-8 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <Zap className="h-8 w-8 text-indigo-600" />
                      <strong className="text-indigo-800 text-2xl">🔮 Privacy Magic Notice 🔮</strong>
                      <Sparkles className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="text-indigo-700 font-medium text-lg leading-relaxed">
                      This resume uses zero-knowledge proofs to verify credentials without revealing sensitive personal
                      information! All claims are cryptographically verifiable on-chain! Your privacy is protected by
                      advanced cryptographic magic! ✨🛡️
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
