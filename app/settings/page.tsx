"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  LogOut,
  ChevronRight,
  Smartphone,
  Lock,
  Star,
  SettingsIcon,
  Palette,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "👋 Logged Out!",
      description: "You have been successfully logged out! See you soon! ✨",
    })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <div className="container mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Settings ⚙️
                </h1>
                <p className="text-slate-600 text-lg">Manage your account and preferences!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-slate-800 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              Profile Settings 👤
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-2xl">John Doe 🎓</h3>
                <p className="text-slate-600 text-lg mb-1">john.doe@example.com</p>
                <p className="text-slate-500">Connected via LINE 💚</p>
              </div>
            </div>
            <Button className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg font-bold">
              <User className="h-5 w-5 mr-2" />
              Edit Profile ✏️
            </Button>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-slate-800 text-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              Security & Privacy 🛡️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Link href="/settings/security">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lock className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg">Wallet Security 🔐</div>
                    <div className="text-slate-600">Backup and recovery options</div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-slate-400" />
              </div>
            </Link>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Two-Factor Authentication 📱</div>
                  <div className="text-slate-600">Add extra security to your account</div>
                </div>
              </div>
              <Switch className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-600" />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="pb-6">
            <CardTitle className="text-slate-800 text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              Preferences ⚡
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <Label htmlFor="notifications" className="text-slate-800 font-bold text-lg">
                  Push Notifications 🔔
                </Label>
              </div>
              <Switch
                id="notifications"
                defaultChecked
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-600"
              />
            </div>

            <Separator className="bg-slate-200" />

            <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <Label htmlFor="dark-mode" className="text-slate-800 font-bold text-lg">
                  Dark Mode 🌙
                </Label>
              </div>
              <Switch
                id="dark-mode"
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-600"
              />
            </div>

            <Separator className="bg-slate-200" />

            <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Language 🌍</div>
                  <div className="text-slate-600">English</div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader className="pb-6">
            <CardTitle className="text-slate-800 text-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              About & Support 📖
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-200">
              <span className="text-slate-800 font-bold text-lg">Version</span>
              <span className="text-slate-600 font-bold">1.0.0 🚀</span>
            </div>
            <div className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
              <span className="text-slate-800 font-bold text-lg">Terms of Service 📜</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
              <span className="text-slate-800 font-bold text-lg">Privacy Policy 🔒</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
              <span className="text-slate-800 font-bold text-lg">Support 💬</span>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-6">
            <Button
              onClick={handleLogout}
              className="w-full h-16 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all text-xl font-bold"
            >
              <LogOut className="h-6 w-6 mr-3" />
              Logout 👋
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
