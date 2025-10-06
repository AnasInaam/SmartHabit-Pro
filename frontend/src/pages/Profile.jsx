import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Flame,
  Target,
  Award,
  Edit2,
  Save,
  X,
  Camera,
  Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AchievementsModal from '../components/achievements/AchievementsModal'
import { useUserStats, useUserAchievements } from '../hooks/useConvex'
import toast from 'react-hot-toast'

function Profile() {
  const { user, isLoaded } = useUser()
  const userStats = useUserStats()
  const achievements = useUserAchievements()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)

  useEffect(() => {
    if (user) {
      setDisplayName(`${user.firstName || ''} ${user.lastName || ''}`.trim())
    }
  }, [user])

  const handleSave = async () => {
    try {
      // Update user profile via Clerk
      await user.update({
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' '),
      })
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    }
  }

  if (!isLoaded || !userStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  const memberSince = new Date(userStats.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const topAchievements = achievements?.slice(0, 6) || []

  const profileStats = [
    {
      icon: Trophy,
      label: 'Level',
      value: userStats.level,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      icon: Sparkles,
      label: 'Total XP',
      value: userStats.xp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: Flame,
      label: 'Longest Streak',
      value: `${userStats.longestStreak} days`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      icon: Target,
      label: 'Total Completed',
      value: userStats.totalHabitsCompleted,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={user?.imageUrl}
                  alt={displayName}
                  className="w-32 h-32 rounded-full border-4 border-primary-600 shadow-lg"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => toast('Avatar upload via Clerk dashboard', { icon: '📸' })}
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
                
                {/* Level badge */}
                <Badge
                  variant="gradient"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 text-sm font-bold"
                >
                  Level {userStats.level}
                </Badge>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Display Name"
                    />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Bio (optional)"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button variant="gradient" size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {displayName}
                      </h1>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Mail className="w-4 h-4" />
                        <span>{user?.primaryEmailAddress?.emailAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {memberSince}</span>
                      </div>
                      {bio && (
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                          {bio}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Level Progress */}
              <div className="w-full md:w-64">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Level {userStats.level} Progress
                </div>
                <Progress value={userStats.levelProgress} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{userStats.xp} XP</span>
                  <span>{userStats.xpForNextLevel} XP</span>
                </div>
                <div className="text-center mt-2 text-sm font-semibold text-primary-600">
                  {userStats.xpForNextLevel - userStats.xp} XP to Level {userStats.level + 1}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {profileStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Achievements Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary-600" />
                Achievements
              </CardTitle>
              {achievements && achievements.length > 6 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAchievementsModal(true)}
                >
                  View All ({achievements.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {topAchievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-primary-200 dark:border-primary-800 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                    <h4 className="font-semibold text-center text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <Badge variant="success" className="w-full justify-center">
                      +{achievement.xpReward} XP
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No achievements yet</p>
                <p className="text-sm">Complete habits to unlock achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
      />
    </div>
  )
}

export default Profile
