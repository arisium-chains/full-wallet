import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Users,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Award,
  Target,
  Brain,
  Trophy,
  Rocket,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LearnPage() {
  const learningPaths = [
    {
      id: 1,
      title: "Web3 Fundamentals",
      description: "Master the basics of blockchain technology and decentralized applications",
      progress: 85,
      modules: 12,
      duration: "8 hours",
      difficulty: "Beginner",
      students: 2847,
      rating: 4.9,
      instructor: "Dr. Sarah Chen",
      tags: ["Blockchain", "DApps", "Ethereum"],
      status: "in-progress",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description: "Learn Solidity programming and build secure smart contracts",
      progress: 45,
      modules: 16,
      duration: "12 hours",
      difficulty: "Intermediate",
      students: 1923,
      rating: 4.8,
      instructor: "Alex Rodriguez",
      tags: ["Solidity", "Security", "Testing"],
      status: "in-progress",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
    },
    {
      id: 3,
      title: "DeFi Protocol Design",
      description: "Advanced concepts in decentralized finance and protocol architecture",
      progress: 0,
      modules: 20,
      duration: "15 hours",
      difficulty: "Advanced",
      students: 856,
      rating: 4.9,
      instructor: "Prof. Michael Kim",
      tags: ["DeFi", "Protocols", "Economics"],
      status: "locked",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
    },
  ]

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first module",
      reward: 25,
      unlocked: true,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Knowledge Seeker",
      description: "Complete 5 modules",
      reward: 100,
      unlocked: true,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Smart Contract Expert",
      description: "Master Solidity basics",
      reward: 250,
      unlocked: false,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "DeFi Pioneer",
      description: "Complete advanced DeFi course",
      reward: 500,
      unlocked: false,
      color: "from-amber-500 to-orange-600",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
      case "Intermediate":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
      case "Advanced":
        return "bg-gradient-to-r from-red-500 to-pink-600 text-white"
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Learning Center 🎓
                  </h1>
                  <p className="text-slate-600 text-lg">Master Web3 technologies with expert-designed courses</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 w-64 bg-white border-slate-300 text-slate-800 shadow-sm focus:shadow-md transition-all"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-all">
                <Filter className="h-4 w-4 mr-2" />
                Filter ⚙️
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                      1,847
                    </div>
                    <div className="text-sm font-medium text-slate-700">ARIS Earned 💰</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                      24
                    </div>
                    <div className="text-sm font-medium text-slate-700">Modules Completed 📚</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                      8
                    </div>
                    <div className="text-sm font-medium text-slate-700">Certificates 🏆</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
                      12
                    </div>
                    <div className="text-sm font-medium text-slate-700">Day Streak 🔥</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center gap-3">
              <Rocket className="h-8 w-8 text-indigo-600" />
              Learning Paths 🚀
            </h2>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all">
              View all paths <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-6">
            {learningPaths.map((path, index) => (
              <Card
                key={path.id}
                className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${path.bgColor} opacity-50 group-hover:opacity-70 transition-opacity`}
                ></div>
                <CardContent className="p-8 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${path.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-700 mb-2">
                            {path.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty} ✨</Badge>
                            {path.status === "locked" && (
                              <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
                                🔒 Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-6 leading-relaxed text-lg">{path.description}</p>

                      <div className="flex items-center gap-8 text-slate-600 mb-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span className="font-medium">{path.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">{path.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          <span className="font-medium">{path.students.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-amber-500" />
                          <span className="font-medium">{path.rating} ⭐</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {path.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            className="bg-white/80 text-slate-700 border border-slate-200 shadow-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-slate-700 font-medium">
                        👨‍🏫 Instructor: <span className="text-slate-800 font-bold">{path.instructor}</span>
                      </div>
                    </div>

                    <div className="ml-8 text-right">
                      {path.status === "in-progress" ? (
                        <Button
                          className={`bg-gradient-to-r ${path.color} text-white border-0 shadow-lg hover:shadow-xl transition-all px-8 py-3`}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Continue 🚀
                        </Button>
                      ) : path.status === "locked" ? (
                        <Button
                          disabled
                          className="bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0 px-8 py-3"
                        >
                          🔒 Locked
                        </Button>
                      ) : (
                        <Button
                          className={`bg-gradient-to-r ${path.color} text-white border-0 shadow-lg hover:shadow-xl transition-all px-8 py-3`}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start Course ✨
                        </Button>
                      )}
                    </div>
                  </div>

                  {path.progress > 0 && (
                    <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">Progress 📈</span>
                        <span className="text-slate-800 font-bold text-lg">{path.progress}% complete</span>
                      </div>
                      <Progress value={path.progress} className="h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              Achievements Gallery 🏆
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Unlock rewards as you progress through your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    achievement.unlocked
                      ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg"
                      : "border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                          achievement.unlocked
                            ? `bg-gradient-to-r ${achievement.color}`
                            : "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                      >
                        <Trophy className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-lg ${achievement.unlocked ? "text-slate-800" : "text-slate-500"}`}
                        >
                          {achievement.title}
                        </h3>
                        <p className="text-slate-600">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.unlocked && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`font-bold ${
                        achievement.unlocked
                          ? `bg-gradient-to-r ${achievement.color} text-white`
                          : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                      }`}
                    >
                      {achievement.reward} ARIS 💰
                    </Badge>
                    {achievement.unlocked && (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                        ✅ Unlocked
                      </Badge>
                    )}
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
