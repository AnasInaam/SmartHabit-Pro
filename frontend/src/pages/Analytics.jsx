import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Zap,
  Filter
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { Button } from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import CompletionRateChart from '../components/analytics/CompletionRateChart'
import StreakCalendar from '../components/analytics/StreakCalendar'
import CategoryPieChart from '../components/analytics/CategoryPieChart'
import XPProgressChart from '../components/analytics/XPProgressChart'
import {
  useCompletionStats,
  useCompletionRateByCategory,
  useStreakAnalysis,
  useTimeOfDayAnalysis,
  useWeeklyProgress,
  useBestPerformingHabits
} from '../hooks/useConvex'

function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
  
  const completionStats = useCompletionStats(days)
  const categoryRates = useCompletionRateByCategory()
  const streakAnalysis = useStreakAnalysis()
  const timeAnalysis = useTimeOfDayAnalysis()
  const weeklyProgress = useWeeklyProgress()
  const bestHabits = useBestPerformingHabits(5)

  // Loading state
  if (completionStats === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const quickStats = [
    { 
      icon: Activity, 
      label: 'Total Completions', 
      value: streakAnalysis?.totalCompletions || 0, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-100 dark:bg-blue-900/20' 
    },
    { 
      icon: Target, 
      label: 'Completion Rate', 
      value: `${Math.round((streakAnalysis?.completionRate || 0) * 100)}%`, 
      color: 'text-green-500', 
      bgColor: 'bg-green-100 dark:bg-green-900/20' 
    },
    { 
      icon: Award, 
      label: 'Best Streak', 
      value: `${streakAnalysis?.longestStreak || 0} days`, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-100 dark:bg-purple-900/20' 
    },
    { 
      icon: Calendar, 
      label: 'Active Days', 
      value: streakAnalysis?.totalActiveDays || 0, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/20' 
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📊 Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and insights over time
            </p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === '7d' ? 'Week' : range === '30d' ? 'Month' : '3 Months'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {quickStats.map((stat, index) => (
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

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary-600" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyProgress && weeklyProgress.length > 0 ? (
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {day.dayName}
                        </span>
                        <Badge variant={day.completed > 0 ? "success" : "secondary"}>
                          {day.completed}/{day.scheduled}
                        </Badge>
                      </div>
                      <Progress 
                        value={day.scheduled > 0 ? (day.completed / day.scheduled) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No weekly data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-6 h-6 text-primary-600" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryRates && categoryRates.length > 0 ? (
                <div className="space-y-4">
                  {categoryRates.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {category.category}
                        </span>
                        <span className="text-sm font-bold text-primary-600">
                          {Math.round(category.completionRate * 100)}%
                        </span>
                      </div>
                      <Progress value={category.completionRate * 100} className="h-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {category.completed} of {category.total} completed
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No category data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Time of Day Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary-600" />
                Best Time of Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeAnalysis && timeAnalysis.length > 0 ? (
                <div className="space-y-4">
                  {timeAnalysis.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {time.timeOfDay}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {time.totalHabits} habits tracked
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {Math.round(time.completionRate * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          completion rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No time-based data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Performing Habits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                Top Performing Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bestHabits && bestHabits.length > 0 ? (
                <div className="space-y-3">
                  {bestHabits.map((habit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="success" className="text-xs">
                            {Math.round(habit.completionRate * 100)}%
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {habit.currentStreak} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No habits tracked yet</p>
                  <p className="text-xs mt-2">Start completing habits to see your top performers!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 space-y-8"
      >
        {/* Completion Rate Line Chart */}
        <CompletionRateChart 
          data={completionStats?.map(stat => ({
            date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completionRate: Math.round((stat.completions / Math.max(stat.scheduled || 1, 1)) * 100)
          }))}
          timeRange={timeRange}
        />

        {/* Two Column Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Pie Chart */}
          <CategoryPieChart 
            data={categoryRates?.map(cat => ({
              name: cat.category,
              value: cat.total
            }))}
          />

          {/* XP Progress Area Chart */}
          <XPProgressChart 
            data={completionStats?.map((stat, index) => ({
              date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              xp: completionStats.slice(0, index + 1).reduce((sum, s) => sum + (s.completions * 10), 0)
            }))}
          />
        </div>

        {/* Streak Calendar Heatmap */}
        <StreakCalendar 
          completionData={completionStats?.map(stat => ({
            date: stat.date,
            count: stat.completions
          }))}
        />
      </motion.div>
    </div>
  )
}

export default Analytics
