import { createContext, useCallback, useState } from 'react'

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string, senha: string) => boolean
  logout: () => void
  user: string | null
}

export const AuthContext = createContext<AuthContext | null>(null)

const key = 'que-chique.auth.user'

function getStoredUser() {
  return sessionStorage.getItem(key)
}

function setStoredUser(user?: string, senha?: string) {
  if (user === 'admin' && senha === 'quechique@2024') {
    sessionStorage.setItem(key, user)
    return true
  }
  sessionStorage.removeItem(key)
  return false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = useCallback(() => {
    setStoredUser()
    setUser(null)
  }, [])

  const login = useCallback((username: string, senha: string) => {
    if (setStoredUser(username, senha)) {
      setUser(username)
      return true
    }
    return false
  }, [])

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}
