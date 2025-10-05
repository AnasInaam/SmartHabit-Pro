import { motion } from 'framer-motion'
import { Award, X } from 'lucide-react'
import { Badge } from '../ui/Badge'

function AchievementToast({ achievement, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className="fixed top-20 right-4 z-50 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg shadow-2xl p-6 max-w-sm border-2 border-yellow-400"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
          {achievement.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5" />
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
          </div>
          
          <h4 className="font-semibold text-white/90 mb-1">
            {achievement.title}
          </h4>
          
          <p className="text-sm text-white/80 mb-3">
            {achievement.description}
          </p>
          
          <Badge variant="secondary" className="bg-white/20">
            +{achievement.xpReward} XP
          </Badge>
        </div>
      </div>
      
      {/* Sparkle animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute -top-2 -right-2 text-2xl"
      >
        ✨
      </motion.div>
    </motion.div>
  )
}

export default AchievementToast
