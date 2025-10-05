import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Calendar } from 'lucide-react'

function StreakCalendar({ completionData }) {
  // Generate last 12 weeks of dates
  const generateCalendarData = () => {
    const weeks = []
    const today = new Date()
    
    for (let week = 11; week >= 0; week--) {
      const days = []
      for (let day = 6; day >= 0; day--) {
        const date = new Date(today)
        date.setDate(today.getDate() - (week * 7 + day))
        const dateString = date.toISOString().split('T')[0]
        
        // Find completion count for this date
        const dayData = completionData?.find(d => d.date === dateString)
        days.unshift({
          date: dateString,
          count: dayData?.count || 0,
          displayDate: date.getDate()
        })
      }
      weeks.unshift(days)
    }
    
    return weeks
  }

  const weeks = generateCalendarData()
  
  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count <= 2) return 'bg-green-200 dark:bg-green-900'
    if (count <= 4) return 'bg-green-400 dark:bg-green-700'
    if (count <= 6) return 'bg-green-600 dark:bg-green-500'
    return 'bg-green-800 dark:bg-green-400'
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Day labels */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {dayLabels.map(day => (
                <div key={day} className="w-4 h-4 text-[10px] text-gray-500 dark:text-gray-400 mx-0.5">
                  {day[0]}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex items-center mb-1">
                <div className="w-12 text-xs text-gray-500 dark:text-gray-400">
                  {weekIndex === 0 && 'This week'}
                  {weekIndex === 4 && '1 month ago'}
                  {weekIndex === 8 && '2 months ago'}
                </div>
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    whileHover={{ scale: 1.2 }}
                    className={`w-4 h-4 rounded-sm mx-0.5 ${getIntensityColor(day.count)} cursor-pointer group relative`}
                    title={`${day.date}: ${day.count} habit${day.count !== 1 ? 's' : ''} completed`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.date}: {day.count} habit{day.count !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level}
                    className={`w-4 h-4 rounded-sm ${getIntensityColor(level * 2)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StreakCalendar
