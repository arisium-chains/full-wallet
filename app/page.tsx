import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  ArrowUpRight,
  Target,
  Zap,
  ChevronRight,
  BarChart3,
  Calendar,
  Clock,
  Sparkles,
  Trophy,
  Rocket,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const stats = [
    {
      title: "Total Earnings",
      value: "$1,847.50",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      description: "ARIS tokens earned this month",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Courses Completed",
      value: "24",
      change: "+3",
      trend: "up",
      icon: BookOpen,
      description: "Learning modules finished",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Certificates",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Award,
      description: "NFT credentials earned",
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Study Streak",
      value: "12 days",
      change: "Active",
      trend: "neutral",
      icon: Target,
      description: "Current learning streak",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ]

  const recentActivity = [
    {
      title: "Completed Advanced DeFi Protocol Analysis",
      time: "2 hours ago",
      reward: "+150 ARIS",
      type: "completion",
      icon: Trophy,
      color: "text-emerald-600",
    },
    {
      title: "Earned 'Smart Contract Auditor' Certificate",
      time: "1 day ago",
      reward: "NFT Badge",
      type: "achievement",
      icon: Award,
      color: "text-amber-600",
    },
    {
      title: "Joined 'Blockchain Developers' Study Group",
      time: "2 days ago",
      reward: "+25 XP",
      type: "social",
      icon: Users,
      color: "text-blue-600",
    },
  ]

  const quickActions = [
    {
      title: "Continue Learning Path",
      description: "Web3 Security Fundamentals - 68% complete",
      href: "/learn",
      icon: BookOpen,
      progress: 68,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Claim Daily Rewards",
      description: "7-day streak bonus available",
      href: "/rewards",
      icon: Award,
      badge: "Ready",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Generate ZK Proof",
      description: "Create privacy-preserving credentials",
      href: "/proofs",
      icon: Zap,
      badge: "New",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Good morning, Alex! 🌟
                  </h1>
                  <p className="text-slate-600 text-lg">Ready to continue your Web3 learning journey?</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-4 py-2 text-sm font-medium">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Premium Member ⭐
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-xl shadow-sm`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-emerald-600"
                        : stat.trend === "down"
                          ? "text-red-500"
                          : "text-slate-600"
                    }`}
                  >
                    {stat.trend === "up" && <ArrowUpRight className="h-4 w-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-700">{stat.title}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Rocket className="h-4 w-4 text-white" />
                  </div>
                  Quick Actions 🚀
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="group p-6 rounded-2xl border border-slate-200 hover:border-slate-300 bg-gradient-to-r from-white to-slate-50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 ${action.bgColor} rounded-xl shadow-sm group-hover:shadow-md transition-shadow`}
                          >
                            <action.icon
                              className={`h-6 w-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`}
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-slate-700">
                              {action.title}
                            </h3>
                            <p className="text-slate-600">{action.description}</p>
                            {action.progress && (
                              <div className="mt-3">
                                <Progress value={action.progress} className="h-2 w-48" />
                                <p className="text-xs text-slate-500 mt-1">{action.progress}% complete</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {action.badge && (
                            <Badge
                              className={`bg-gradient-to-r ${action.color} text-white border-0 px-3 py-1 font-medium`}
                            >
                              {action.badge} ✨
                            </Badge>
                          )}
                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                    Learning Progress 📊
                  </CardTitle>
                  <Link href="/learn">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:shadow-lg transition-all">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">Weekly Goal 🎯</h3>
                        <p className="text-slate-600">Complete 5 learning modules this week</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                          3/5
                        </div>
                        <div className="text-sm text-slate-600 font-medium">60% complete</div>
                      </div>
                    </div>
                    <Progress value={60} className="h-3 mb-4" />

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-800">12h</div>
                        <div className="text-xs text-slate-600 font-medium">Study time ⏰</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-800">8.4</div>
                        <div className="text-xs text-slate-600 font-medium">Avg score ⭐</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-slate-800">94%</div>
                        <div className="text-xs text-slate-600 font-medium">Completion 🎉</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  Recent Activity 🌟
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-200">
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{activity.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
                          <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
                            {activity.reward}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Upcoming Events 📅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800">DeFi Study Group 🤝</h3>
                      <Badge className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                        Today 3:00 PM
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">Weekly discussion on yield farming strategies</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800">Assignment Due 📝</h3>
                      <Badge className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                        Tomorrow
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">Smart Contract Security Analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Stats */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 animate-scale-in">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              Global Community Insights 🌍
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/70 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  24.7K
                </div>
                <div className="text-sm font-medium text-slate-700">Active Learners 👨‍🎓</div>
                <div className="text-xs text-emerald-600 mt-1 font-medium">+12% this week</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  3.2M
                </div>
                <div className="text-sm font-medium text-slate-700">ARIS Distributed 💰</div>
                <div className="text-xs text-blue-600 mt-1 font-medium">+8% this week</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
                  189
                </div>
                <div className="text-sm font-medium text-slate-700">Countries 🌎</div>
                <div className="text-xs text-slate-600 mt-1 font-medium">Global reach</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                  98.9%
                </div>
                <div className="text-sm font-medium text-slate-700">Satisfaction ⭐</div>
                <div className="text-xs text-amber-600 mt-1 font-medium">5-star rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
