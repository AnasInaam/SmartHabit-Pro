import { useEffect } from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function Dashboard() {
  const { user, isLoading } = useKindeAuth()
  const createUser = useMutation(api.users.createUser)

  useEffect(() => {
    // Sync user data with Convex when user is authenticated
    if (user) {
      console.log('User authenticated:', user)
      
      // Create or update user in Convex database
      createUser({
        kindeId: user.id,
        email: user.email,
        name: user.given_name || user.family_name || user.email,
        avatar: user.picture || null,
      }).then((result) => {
        console.log('User synced with Convex:', result)
      }).catch((error) => {
        console.log('User already exists or sync complete:', error)
      })
    }
  }, [user, createUser])

  // Show loading during authentication process
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  console.log('Dashboard render:', { user: user?.email })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Your Dashboard
        </h1>
        {user && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Hello, {user.given_name || user.email}! 👋
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
          <p className="text-gray-600 dark:text-gray-400">Your habit tracking dashboard will appear here.</p>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">✅ Authentication working!</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">🗄️ Convex database connected!</p>
            {user && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-2 space-y-1">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.given_name || user.family_name || 'Not provided'}</p>
                <p className="text-purple-600 dark:text-purple-400">
                  <strong>Status:</strong> Data syncing with Convex database
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">Progress charts and statistics will be displayed here.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <p className="text-gray-600 dark:text-gray-400">Quick habit actions and shortcuts will be available here.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard