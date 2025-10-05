import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Flame,
  CheckCircle,
  Calendar,
  Zap
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Progress } from '../ui/Progress'
import { Button } from '../ui/Button'
import { useSummaryReport } from '../../hooks/useConvex'
import LoadingSpinner from '../ui/LoadingSpinner'

function SummaryReport({ period = 'week' }) {
  const report = useSummaryReport(period)

  if (report === undefined) {
    return (
      <Card>
        <CardContent className="pt-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            {period === 'week' ? 'Weekly' : 'Monthly'} Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No data available for this period
          </p>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      icon: CheckCircle,
      label: 'Total Completions',
      value: report.totalCompletions,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Zap,
      label: 'XP Earned',
      value: report.totalXP,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: Target,
      label: 'Habits Completed',
      value: `${report.uniqueHabitsCompleted}/${report.totalHabits}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Daily Average',
      value: report.averageCompletionsPerDay,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            {period === 'week' ? 'Weekly' : 'Monthly'} Summary
          </CardTitle>
          <Badge variant={report.streakMaintained ? "success" : "secondary"}>
            {report.streakMaintained ? '🔥 Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Completion Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completion Rate
            </span>
            <span className="text-sm font-bold text-primary-600">
              {report.completionRate}%
            </span>
          </div>
          <Progress value={report.completionRate} className="h-3" />
        </div>

        {/* Best Habit */}
        {report.bestHabit && (
          <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Top Performing Habit
              </h4>
            </div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
              {report.bestHabit.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed {report.bestHabit.completions} times this {period}
            </p>
          </div>
        )}

        {/* Current Streak */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {report.currentStreak} days
                </p>
              </div>
            </div>
            {!report.streakMaintained && (
              <Badge variant="warning">⚠️ At Risk</Badge>
            )}
          </div>
        </div>

        {/* Period Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryReport
