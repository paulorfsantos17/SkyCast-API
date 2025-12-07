import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  useEffect(() => {
    const storedAccessToken = Cookies.get('accessToken')
    const storedRefreshToken = Cookies.get('refreshToken')
    const storedUser = Cookies.get('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (newAccessToken: string, newRefreshToken: string, newUser: User) => {
    Cookies.set('accessToken', newAccessToken, { expires: 1 / 96 }) // 15 minutos
    Cookies.set('refreshToken', newRefreshToken, { expires: 7 }) // 7 dias
    Cookies.set('user', JSON.stringify(newUser), { expires: 7 })

    setAccessToken(newAccessToken)
    setRefreshToken(newRefreshToken)
    setUser(newUser)
  }

  const logout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')

    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        isAuthenticated: !!accessToken,
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
