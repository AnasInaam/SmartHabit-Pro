import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Lock, Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card, CardContent } from '../ui/Card'

export default function AchievementsModal({ isOpen, onClose, achievements }) {
  if (!isOpen) return null

  const achievementCategories = [
    {
      name: 'Streak Achievements',
      achievements: achievements?.filter(a => a.type?.includes('streak')) || []
    },
    {
      name: 'Completion Achievements',
      achievements: achievements?.filter(a => a.type?.includes('completion')) || []
    },
    {
      name: 'Level Achievements',
      achievements: achievements?.filter(a => a.type?.includes('level')) || []
    },
    {
      name: 'Special Achievements',
      achievements: achievements?.filter(a => !['streak', 'completion', 'level'].some(t => a.type?.includes(t))) || []
    }
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                All Achievements
              </h2>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {achievements?.length || 0} Unlocked
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-8">
            {achievements && achievements.length > 0 ? (
              <>
                {achievementCategories.map((category, catIndex) => (
                  category.achievements.length > 0 && (
                    <div key={catIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full" />
                        {category.name}
                        <Badge variant="outline" className="ml-2">
                          {category.achievements.length}
                        </Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="h-full hover:shadow-lg transition-all border-2 border-primary-200 dark:border-primary-800">
                              <CardContent className="pt-6">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center text-4xl">
                                  {achievement.icon}
                                </div>

                                {/* Title */}
                                <h4 className="font-bold text-center text-gray-900 dark:text-white mb-2">
                                  {achievement.title}
                                </h4>

                                {/* Description */}
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
                                  {achievement.description}
                                </p>

                                {/* XP Badge */}
                                <Badge variant="success" className="w-full justify-center">
                                  +{achievement.xpReward} XP
                                </Badge>

                                {/* Unlock Date */}
                                <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                ))}

                {/* Locked Achievements (Sample) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-400 rounded-full" />
                    Locked Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: '🎯', title: '100 Day Warrior', desc: 'Maintain a 100 day streak', xp: 200 },
                      { icon: '⚡', title: 'Lightning Fast', desc: 'Complete 50 habits in one day', xp: 150 },
                      { icon: '🌟', title: 'Star Performer', desc: 'Reach Level 10', xp: 300 },
                    ].map((locked, index) => (
                      <Card key={index} className="opacity-60 h-full">
                        <CardContent className="pt-6">
                          <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl grayscale">
                              {locked.icon}
                            </div>
                            <Lock className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 text-gray-500" />
                          </div>
                          <h4 className="font-bold text-center text-gray-600 dark:text-gray-400 mb-2">
                            {locked.title}
                          </h4>
                          <p className="text-sm text-center text-gray-500 dark:text-gray-500 mb-4">
                            {locked.desc}
                          </p>
                          <Badge variant="outline" className="w-full justify-center opacity-60">
                            +{locked.xp} XP
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Award className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start completing habits to unlock your first achievement!
                </p>
                <Button variant="gradient" onClick={onClose}>
                  Start Your Journey
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-between items-center border-t dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Keep completing habits to unlock more achievements!
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
