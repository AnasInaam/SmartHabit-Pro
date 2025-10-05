import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Calendar,
  Layout,
  Database,
  Download,
  Trash2,
  Shield,
  Mail,
  AlertTriangle,
  Check
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useUserStats, useUserHabits } from '../hooks/useConvex'
import toast from 'react-hot-toast'

function Settings() {
  const { user, isLoaded } = useUser()
  const userStats = useUserStats()
  const habits = useUserHabits()
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    weekStartsOn: 'Sunday',
    defaultView: 'grid',
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '09:00'
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    toast.success('Preference updated')
  }

  const handleExportData = () => {
    const data = {
      user: userStats,
      habits: habits,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smarthabit-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }

  const handleClearData = () => {
    toast.error('This would delete all your data. Feature in development.')
    setShowDeleteConfirm(false)
  }

  if (!isLoaded || !userStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  const totalCompletions = userStats.totalHabitsCompleted || 0
  const dataSize = Math.round((JSON.stringify({ userStats, habits }).length) / 1024)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          ⚙️ Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account, preferences, and data
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Display Name</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast('Edit via Profile page', { icon: '👤' })}>
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <Badge variant="success">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary-600" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Language</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">English (US)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              {/* Date Format */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Date Format</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{preferences.dateFormat}</p>
                  </div>
                </div>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* Week Starts On */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Week Starts On</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{preferences.weekStartsOn}</p>
                </div>
                <select
                  value={preferences.weekStartsOn}
                  onChange={(e) => handlePreferenceChange('weekStartsOn', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                </select>
              </div>

              {/* Default View */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Default Habit View</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{preferences.defaultView}</p>
                  </div>
                </div>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary-600" />
                Data & Storage
              </CardTitle>
              <CardDescription>
                Manage your data and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{habits?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Habits</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{totalCompletions}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completions</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{dataSize} KB</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Usage</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">Live</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sync Status</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportData}
                >
                  <Download className="w-5 h-5 mr-3" />
                  Export All Data
                </Button>

                {!showDeleteConfirm ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-5 h-5 mr-3" />
                    Clear All Data
                  </Button>
                ) : (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <p className="font-semibold">Are you sure?</p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      This will permanently delete all your habits, completions, and achievements. This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearData}
                      >
                        Yes, Delete Everything
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
              >
                <Shield className="w-5 h-5 mr-3" />
                Manage Security Settings
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => toast.error('Account deletion must be done through Clerk dashboard')}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings