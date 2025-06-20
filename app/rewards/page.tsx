"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Trophy, Sparkles, Calendar, Target, Crown, Clock, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RewardsPage() {
  const [dailyStreak, setDailyStreak] = useState(7)
  const [weeklyProgress, setWeeklyProgress] = useState(85)
  const { toast } = useToast()

  const dailyRewards = [
    { day: 1, reward: 10, claimed: true, type: "ARIS" },
    { day: 2, reward: 15, claimed: true, type: "ARIS" },
    { day: 3, reward: 20, claimed: true, type: "ARIS" },
    { day: 4, reward: 25, claimed: true, type: "ARIS" },
    { day: 5, reward: 30, claimed: true, type: "ARIS" },
    { day: 6, reward: 35, claimed: true, type: "ARIS" },
    { day: 7, reward: 50, claimed: true, type: "ARIS" },
    { day: 8, reward: 75, claimed: false, type: "ARIS", bonus: true },
  ]

  const achievements = [
    {
      id: 1,
      title: "First Steps 👶",
      description: "Complete your first learning module",
      reward: 25,
      progress: 100,
      claimed: true,
      rarity: "common",
    },
    {
      id: 2,
      title: "Knowledge Seeker 📚",
      description: "Complete 5 learning modules",
      reward: 100,
      progress: 100,
      claimed: true,
      rarity: "uncommon",
    },
    {
      id: 3,
      title: "Web3 Expert 🧠",
      description: "Complete 10 advanced courses",
      reward: 500,
      progress: 80,
      claimed: false,
      rarity: "rare",
    },
    {
      id: 4,
      title: "Community Leader 👑",
      description: "Help 50 fellow students",
      reward: 1000,
      progress: 60,
      claimed: false,
      rarity: "legendary",
    },
  ]

  const weeklyTasks = [
    { id: 1, title: "Complete 3 Learning Modules", progress: 100, reward: 150, completed: true },
    { id: 2, title: "Participate in 2 Study Groups", progress: 50, reward: 100, completed: false },
    { id: 3, title: "Earn 500 XP Points", progress: 85, reward: 200, completed: false },
    { id: 4, title: "Help 5 Community Members", progress: 40, reward: 75, completed: false },
  ]

  const handleClaimDaily = (day: number) => {
    toast({
      title: "🎉 Daily Reward Claimed!",
      description: `You've earned ${dailyRewards[day - 1].reward} ARIS tokens! Keep the streak going! 🔥`,
    })
  }

  const handleClaimAchievement = (id: number) => {
    const achievement = achievements.find((a) => a.id === id)
    toast({
      title: "🏆 Achievement Unlocked!",
      description: `Congratulations! You've earned ${achievement?.reward} ARIS for "${achievement?.title}"! ✨`,
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "uncommon":
        return "from-green-400 to-green-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "legendary":
        return "from-purple-400 to-pink-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-purple-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-green-300/20 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10 pb-24">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-12 w-12 text-yellow-300 animate-spin" />
          </div>
          <h1 className="text-5xl font-bold text-white animate-bounce">Rewards Center 🎁</h1>
          <p className="text-white/90 text-xl animate-pulse max-w-2xl mx-auto">
            Earn amazing rewards for your learning journey! Complete tasks, maintain streaks, and unlock achievements!
            ✨
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Coins className="h-12 w-12 mx-auto mb-3 text-yellow-300 animate-spin" />
              <div className="text-3xl font-bold text-white">1,250</div>
              <div className="text-white/80 font-medium">Total ARIS Earned</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-3 text-orange-300 animate-bounce" />
              <div className="text-3xl font-bold text-white">{dailyStreak}</div>
              <div className="text-white/80 font-medium">Day Streak 🔥</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-purple-300 animate-pulse" />
              <div className="text-3xl font-bold text-white">12</div>
              <div className="text-white/80 font-medium">Achievements</div>
            </CardContent>
          </Card>
          <Card className="glass-effect border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 mx-auto mb-3 text-pink-300 animate-wiggle" />
              <div className="text-3xl font-bold text-white">Gold</div>
              <div className="text-white/80 font-medium">Tier Status</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="daily" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm border-white/30 h-16">
            <TabsTrigger
              value="daily"
              className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Daily Rewards 📅
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Achievements 🏆
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="text-white font-bold text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Weekly Tasks 📋
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <Card className="glass-effect border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-yellow-300 animate-bounce" />
                  Daily Login Rewards 🌅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {dailyRewards.map((reward, index) => (
                    <div
                      key={reward.day}
                      className={`relative p-4 rounded-2xl border-2 text-center transform hover:scale-105 transition-all duration-300 ${
                        reward.claimed
                          ? "bg-gradient-to-r from-green-400/20 to-emerald-400/20 border-green-400/50"
                          : reward.bonus
                            ? "bg-gradient-to-r from-purple-400/20 to-pink-400/20 border-purple-400/50 animate-pulse-glow"
                            : "bg-white/10 border-white/30"
                      }`}
                    >
                      {reward.bonus && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="text-white font-bold text-lg mb-2">Day {reward.day}</div>
                      <div className="text-2xl mb-2">{reward.claimed ? "✅" : reward.bonus ? "👑" : "🎁"}</div>
                      <div className="text-white font-bold">{reward.reward} ARIS</div>
                      {!reward.claimed && reward.day === dailyStreak + 1 && (
                        <Button
                          onClick={() => handleClaimDaily(reward.day)}
                          className="mt-3 w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold text-sm"
                        >
                          Claim! 🎉
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl border border-orange-400/50">
                  <div className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <Target className="h-6 w-6 animate-spin" />
                    Streak Bonus Information 🔥
                  </div>
                  <div className="text-white/90">
                    Keep your daily login streak alive to unlock bigger rewards! Day 8 gives you a special bonus! 👑
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="glass-effect border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-300 animate-bounce" />
                  Achievement Gallery 🏆
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className="p-6 bg-white/10 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl">{achievement.title}</h3>
                          <p className="text-white/80 text-lg">{achievement.description}</p>
                          <Badge
                            className={`mt-2 bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white font-bold capitalize`}
                          >
                            {achievement.rarity} ✨
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-300">{achievement.reward} ARIS</div>
                        {achievement.claimed ? (
                          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold animate-pulse">
                            ✅ Claimed
                          </Badge>
                        ) : achievement.progress === 100 ? (
                          <Button
                            onClick={() => handleClaimAchievement(achievement.id)}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
                          >
                            Claim Reward! 🎉
                          </Button>
                        ) : (
                          <Badge className="bg-white/20 text-white font-bold">{achievement.progress}% Complete</Badge>
                        )}
                      </div>
                    </div>
                    {!achievement.claimed && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-white font-medium">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-3 bg-white/20" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card className="glass-effect border-white/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-300 animate-spin" />
                  Weekly Challenge Tasks 📋
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl border border-blue-400/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-bold text-xl">Weekly Progress</span>
                    <span className="text-white font-bold text-xl">{weeklyProgress}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-4 bg-white/20 mb-3" />
                  <div className="text-white/90">Complete all weekly tasks to earn a 500 ARIS bonus! 🎯</div>
                </div>

                {weeklyTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-6 bg-white/10 rounded-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          task.completed
                            ? "bg-gradient-to-r from-green-400 to-emerald-600 animate-bounce"
                            : "bg-white/20"
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 text-white" />
                        ) : (
                          <Target className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{task.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Progress value={task.progress} className="h-2 w-32 bg-white/20" />
                          <span className="text-white/80 text-sm">{task.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-300">{task.reward} ARIS</div>
                      {task.completed && (
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold animate-pulse">
                          ✅ Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
