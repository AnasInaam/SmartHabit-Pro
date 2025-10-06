import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calendar,
  CheckCircle,
  Plus,
  Flame,
  Zap,
  BarChart3,
  Users,
  Clock,
  Trophy,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import Confetti from '../components/ui/Confetti'
import AchievementToast from '../components/rewards/AchievementToast'
import { 
  useUserStats, 
  useCreateUser, 
  useTodaysHabits, 
  useCompleteHabit,
  useCheckAchievements,
  useUserAchievements
} from '../hooks/useConvex'

function Dashboard() {
  const { user, isLoaded } = useUser()
  const userStats = useUserStats()
  const todaysHabits = useTodaysHabits()
  const achievements = useUserAchievements()
  const createUser = useCreateUser()
  const completeHabit = useCompleteHabit()
  const checkAchievements = useCheckAchievements()
  const [completingHabit, setCompletingHabit] = useState(null)
  const [showConfetti, setShowConfetti] = useState(0)
  const [newAchievement, setNewAchievement] = useState(null)
  const [prevLevel, setPrevLevel] = useState(null)

  // Sync user with Convex on mount
  useEffect(() => {
    if (user) {
      createUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        avatar: user.imageUrl,
      }).catch(error => {
        console.error('Error syncing user:', error)
      })
    }
  }, [user, createUser])

  // Track level changes for confetti
  useEffect(() => {
    if (userStats?.level) {
      if (prevLevel !== null && userStats.level > prevLevel) {
        setShowConfetti(Date.now())
      }
      setPrevLevel(userStats.level)
    }
  }, [userStats?.level, prevLevel])

  // Check for new achievements
  useEffect(() => {
    if (achievements && achievements.length > 0) {
      const latestAchievement = achievements[0]
      const timeSinceUnlock = Date.now() - latestAchievement.unlockedAt
      
      // Show if unlocked in the last 5 seconds
      if (timeSinceUnlock < 5000) {
        setNewAchievement(latestAchievement)
        setTimeout(() => setNewAchievement(null), 5000)
      }
    }
  }, [achievements])

  const handleCompleteHabit = async (habitId) => {
    if (!userStats?._id) return
    
    setCompletingHabit(habitId)
    
    try {
      const result = await completeHabit({ habitId })
      
      // Show success toast with details
      let message = `+${result.xpEarned} XP earned!`
      if (result.bonusXP > 0) {
        message += ` 🎉 +${result.bonusXP} Streak Bonus!`
      }
      if (result.leveledUp) {
        message += ` 🎊 Level Up! Now Level ${result.newLevel}!`
      }
      
      toast.success(message, {
        duration: 5000,
        icon: result.leveledUp ? '🎊' : '🎯',
      })

      // Check for new achievements
      await checkAchievements({
        userId: userStats._id,
        eventType: 'completion',
        eventData: { habitId, xpEarned: result.xpEarned },
      })
      
    } catch (error) {
      toast.error(error.message || 'Failed to complete habit')
    } finally {
      setCompletingHabit(null)
    }
  }

  // Show loading during authentication process
  if (!isLoaded || !userStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { 
      icon: Flame, 
      label: 'Current Streak', 
      value: `${userStats.currentStreak} days`, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      description: `Longest: ${userStats.longestStreak} days`
    },
    { 
      icon: Trophy, 
      label: 'Total XP', 
      value: `${userStats.xp} XP`, 
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: `${userStats.xpForNextLevel - userStats.xp} XP to Level ${userStats.level + 1}`
    },
    { 
      icon: Target, 
      label: 'Habits Completed', 
      value: userStats.totalHabitsCompleted.toString(), 
      color: 'text-green-500', 
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'All time'
    },
    { 
      icon: Award, 
      label: 'Level', 
      value: userStats.level.toString(), 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: `${Math.round(userStats.levelProgress)}% to next level`
    }
  ]

  return (
    <>
      {/* Confetti for level up */}
      <Confetti trigger={showConfetti} />

      {/* Achievement Toast */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementToast
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/habits">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Habit
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <Badge variant="outline">{stat.label}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Level Progress</CardTitle>
                    <CardDescription>
                      {userStats.xpForNextLevel - userStats.xp} XP until Level {userStats.level + 1}
                    </CardDescription>
                  </div>
                  <Badge variant="gradient" className="text-lg px-4 py-2">
                    Level {userStats.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={userStats.levelProgress} className="h-3" />
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{userStats.xp} XP</span>
                  <span>{userStats.xpForNextLevel} XP</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Habits</CardTitle>
                    <CardDescription>
                      {todaysHabits?.filter(h => h.completedToday).length || 0} of {todaysHabits?.length || 0} completed
                    </CardDescription>
                  </div>
                  <Link to="/habits">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysHabits && todaysHabits.length > 0 ? (
                  todaysHabits.map((habit) => (
                    <div
                      key={habit._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: habit.color }}
                        >
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {habit.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>{habit.currentStreak} day streak</span>
                            <span className="mx-1">•</span>
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>{habit.xpValue} XP</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={habit.completedToday ? "outline" : "gradient"}
                        size="sm"
                        onClick={() => handleCompleteHabit(habit._id)}
                        disabled={habit.completedToday || completingHabit === habit._id}
                      >
                        {completingHabit === habit._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : habit.completedToday ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Done
                          </>
                        ) : (
                          "Complete"
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No habits scheduled for today</p>
                    <Link to="/habits">
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="w-4 h-4 mr-1" />
                        Create Your First Habit
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/habits">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Plus className="w-5 h-5 mr-3" />
                    Create New Habit
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <BarChart3 className="w-5 h-5 mr-3" />
                    View Analytics
                  </Button>
                </Link>
                <Link to="/social">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Users className="w-5 h-5 mr-3" />
                    Join Challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 border-none">
              <CardContent className="pt-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Keep Going!</h3>
                </div>
                <p className="text-white/90 text-sm mb-4">
                  {userStats.currentStreak > 0 
                    ? `You're on a ${userStats.currentStreak} day streak! Don't break it now!`
                    : "Start your journey today and build lasting habits!"}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Complete all habits to maintain your streak</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Badge variant="success" className="flex items-center gap-2 w-fit">
                  <CheckCircle className="w-3 h-3" />
                  Authentication Active
                </Badge>
                <Badge variant="success" className="flex items-center gap-2 w-fit">
                  <CheckCircle className="w-3 h-3" />
                  Database Connected
                </Badge>
                {user && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <strong>User ID:</strong> {user.id.substring(0, 12)}...
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Dashboard
