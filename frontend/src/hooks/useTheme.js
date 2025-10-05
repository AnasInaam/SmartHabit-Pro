import { useState, useCallback } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  const initializeTheme = useCallback(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
  }, [setTheme])

  return {
    theme,
    setTheme,
    toggleTheme,
    initializeTheme,
    isDark: theme === 'dark'
  }
}