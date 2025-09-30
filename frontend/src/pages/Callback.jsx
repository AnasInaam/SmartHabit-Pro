import { useEffect, useState } from 'react'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Callback() {
  const { isLoading, isAuthenticated, error } = useKindeAuth()
  const navigate = useNavigate()
  // No need for isProcessing, just use effect

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('User authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    } else if (!isLoading && !isAuthenticated) {
      console.log('Authentication failed or not ready, redirecting to home')
      navigate('/', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <LoadingSpinner />
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Completing sign in...
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Please wait while we log you in
        </p>
        {error && (
          <p className="mt-4 text-red-500 text-sm">
            Authentication error: {error.message}
          </p>
        )}
      </div>
    </div>
  )
}