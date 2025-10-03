import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useTheme } from './hooks/useTheme'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Analytics from './pages/Analytics'
import Social from './pages/Social'
import Settings from './pages/Settings'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Auth wrapper for protected routes
function AuthWrapper({ children }) {
  const { isSignedIn, isLoaded } = useUser()

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

// Public layout wrapper
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const { theme, initializeTheme } = useTheme()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return (
    <div className={theme}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        } />
        <Route path="/about" element={
          <PublicLayout>
            <About />
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AuthWrapper>
            <Dashboard />
          </AuthWrapper>
        } />
        <Route path="/habits" element={
          <AuthWrapper>
            <Habits />
          </AuthWrapper>
        } />
        <Route path="/analytics" element={
          <AuthWrapper>
            <Analytics />
          </AuthWrapper>
        } />
        <Route path="/social" element={
          <AuthWrapper>
            <Social />
          </AuthWrapper>
        } />
        <Route path="/settings" element={
          <AuthWrapper>
            <Settings />
          </AuthWrapper>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App