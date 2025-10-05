import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { PieChart as PieChartIcon } from 'lucide-react'

function CategoryPieChart({ data }) {
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ]

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary-600" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No category data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary-600" />
          Habits by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Category list */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((category, index) => (
            <div key={category.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                {category.name}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white ml-auto">
                {category.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryPieChart
