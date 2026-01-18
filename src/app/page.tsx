'use client'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import LoginScreen from '@/components/LoginScreen'
import Dashboard from '@/components/Dashboard'

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <Dashboard />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
