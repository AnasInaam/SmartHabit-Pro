import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { 
  Target, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Award,
  Calendar,
  BarChart,
  Shield
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

function Home() {
  const features = [
    {
      icon: Target,
      title: "Smart Habit Tracking",
      description: "Create and track habits with intelligent reminders and progress insights."
    },
    {
      icon: Zap,
      title: "Gamification",
      description: "Earn XP, level up, and unlock achievements as you build lasting habits."
    },
    {
      icon: Users,
      title: "Social Challenges",
      description: "Join friends in habit challenges and stay motivated together."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Visualize your progress with detailed charts and statistics."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling that adapts to your lifestyle and preferences."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your personal information."
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "1M+", label: "Habits Tracked" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9", label: "App Rating" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge variant="outline" className="inline-flex items-center gap-2 mb-6">
                <Award className="w-4 h-4" />
                #1 Habit Tracking App of 2025
              </Badge>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Life with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mt-2">
                Smart Habits
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Build lasting habits, track your progress, and achieve your goals with our AI-powered habit tracking platform. Join thousands of users who have transformed their lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto mb-12">
              <SignUpButton mode="modal" redirectUrl="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </SignUpButton>
              
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </motion.div>
              </SignInButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="hidden lg:block absolute top-20 left-10 animate-bounce-gentle">
          <div className="glass-card rounded-full p-4">
            <Target className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="hidden lg:block absolute top-32 right-16 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="glass-card rounded-full p-4">
            <Award className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build and maintain lasting habits
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your transformation?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Join over 50,000 users who have already transformed their lives with SmartHabit
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal" redirectUrl="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 font-bold w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </motion.div>
              </SignUpButton>
              
              <SignInButton mode="modal" redirectUrl="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 w-full sm:w-auto">
                    Sign In
                  </Button>
                </motion.div>
              </SignInButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home