import { User } from '@/models/User'
import Cookies from 'js-cookie'
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = Cookies.get(TOKEN_KEY)
    const savedUser = Cookies.get(USER_KEY)

    if (savedToken) {
      setToken(savedToken)
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao parsear usuário:', error)
        Cookies.remove(USER_KEY)
      }
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    const isProduction = import.meta.env.MODE === 'production'

    Cookies.set(TOKEN_KEY, newToken, {
      expires: 7,
      secure: isProduction,
      sameSite: 'strict',
    })

    Cookies.set(USER_KEY, JSON.stringify(newUser), {
      expires: 7,
      secure: isProduction,
      sameSite: 'strict',
    })

    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    Cookies.remove(TOKEN_KEY)
    Cookies.remove(USER_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
