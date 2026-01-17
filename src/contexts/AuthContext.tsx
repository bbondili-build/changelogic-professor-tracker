'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isAdminMode: boolean
  login: (password: string) => boolean
  logout: () => void
  toggleAdminMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CORRECT_PASSWORD = 'ambidexterity'
const AUTH_KEY = 'changelogic_auth'
const ADMIN_KEY = 'changelogic_admin'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY)
    const admin = localStorage.getItem(ADMIN_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    if (admin === 'true') {
      setIsAdminMode(true)
    }
    setIsLoading(false)
  }, [])

  const login = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem(AUTH_KEY, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdminMode(false)
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(ADMIN_KEY)
  }

  const toggleAdminMode = () => {
    const newValue = !isAdminMode
    setIsAdminMode(newValue)
    localStorage.setItem(ADMIN_KEY, newValue.toString())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdminMode, login, logout, toggleAdminMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
