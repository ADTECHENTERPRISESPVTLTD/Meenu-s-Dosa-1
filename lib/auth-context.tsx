'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authApi, setAuthToken, clearAuthToken, getStoredAdmin } from '@/lib/api'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  lastLoginAt?: string
}

interface AuthContextType {
  admin: AdminUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const stored = getStoredAdmin()
    if (stored?.token) {
      try {
        const response = await authApi.me()
        if (response.success && response.data) {
          setAdmin(response.data)
          setToken(stored.token)
        } else {
          clearAuthToken()
          setAdmin(null)
          setToken(null)
        }
      } catch {
        clearAuthToken()
        setAdmin(null)
        setToken(null)
      }
    } else {
      setAdmin(null)
      setToken(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    if (response.success && response.data) {
      setAuthToken(response.data.token, response.data.admin)
      setAdmin(response.data.admin)
      setToken(response.data.token)
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const logout = () => {
    clearAuthToken()
    setAdmin(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}