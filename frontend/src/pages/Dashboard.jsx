import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { motion } from 'framer-motion'
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
  Trophy
} from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'

function Dashboard() {
  const { user, isLoaded } = useUser()
  const createUser = useMutation(api.users.createUser)

  useEffect(() => {
    // Sync user data with Convex when user is authenticated
    if (user) {
      console.log('User authenticated:', user)
      
      // Create or update user in Convex database
      createUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.firstName || user.lastName || user.primaryEmailAddress?.emailAddress || 'User',
        avatar: user.imageUrl || null,
      }).then((result) => {
        console.log('User synced with Convex:', result)
      }).catch((error) => {
        console.log('User already exists or sync complete:', error)
      })
    }
  }, [user, createUser])

  // Show loading during authentication process
  if (!isLoaded) {
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
    { icon: Flame, label: 'Current Streak', value: '0 days', color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { icon: Trophy, label: 'Total XP', value: '0 XP', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { icon: Target, label: 'Habits Completed', value: '0', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { icon: Award, label: 'Level', value: '1', color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' }
  ]

  const todayHabits = [
    { id: 1, name: 'Morning Meditation', completed: false, xp: 10, time: '08:00 AM' },
    { id: 2, name: 'Exercise', completed: false, xp: 20, time: '09:00 AM' },
    { id: 3, name: 'Read 30 mins', completed: false, xp: 15, time: '08:00 PM' }
  ]

  const quickActions = [
    { icon: Plus, label: 'Add Habit', color: 'from-primary-600 to-secondary-600' },
    { icon: BarChart3, label: 'View Analytics', color: 'from-blue-600 to-cyan-600' },
    { icon: Users, label: 'Join Challenge', color: 'from-purple-600 to-pink-600' }
  ]

  console.log('Dashboard render:', { user: user?.primaryEmailAddress?.emailAddress })

  return (
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="gradient" size="lg">
              <Plus className="w-5 h-5" />
              New Habit
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Today's Habits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                  Today's Habits
                </CardTitle>
                <Badge variant="secondary">
                  0 of {todayHabits.length} completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {todayHabits.length > 0 ? (
                <div className="space-y-3">
                  {todayHabits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-200 group"
                    >
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
                          habit.completed
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-600'
                        }`}
                      >
                        {habit.completed && <CheckCircle className="w-6 h-6 text-white" />}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-semibold ${habit.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {habit.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            {habit.xp} XP
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No habits yet. Start building your routine!
                  </p>
                  <Button variant="gradient" size="lg">
                    Create Your First Habit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div key={action.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="gradient" 
                      className={`w-full bg-gradient-to-r ${action.color}`}
                      size="lg"
                    >
                      <action.icon className="w-5 h-5" />
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 border-none">
              <CardContent className="pt-6 text-white">
                <h3 className="text-xl font-bold mb-2">🎯 Keep Going!</h3>
                <p className="text-white/90 text-sm mb-4">
                  You're doing great! Complete your habits to build your streak.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Start your journey today</span>
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
  )
}

export default Dashboard