'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from './api'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      const { token: newToken, name, email: userEmail } = response.data

      // Salvar no localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify({ name, email: userEmail }))

      // Atualizar estado
      setToken(newToken)
      setUser({ name, email: userEmail })

      // Redirecionar para home (dashboard)
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data || 'Erro ao fazer login'
      throw new Error(message)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await authApi.register({ name, email, password })
      // Após registro, redirecionar para login
      router.push('/login')
    } catch (error: any) {
      const message = error.response?.data || 'Erro ao criar conta'
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
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
