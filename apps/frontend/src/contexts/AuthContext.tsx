import { userService } from '@/services/user.service'; // Importe userService para buscar o perfil
import Cookies from 'js-cookie';
import { createContext, useCallback, useContext, useEffect, useState } from 'react'; // Importe useCallback

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
  isLoading: boolean
  refreshUser: () => Promise<void>; // <--- ADICIONE ESTA LINHA
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Função para carregar o usuário dos cookies ou da API
  const loadUserFromStorage = useCallback(async () => {
    const storedAccessToken = Cookies.get('accessToken')
    const storedRefreshToken = Cookies.get('refreshToken')
    const storedUserString = Cookies.get('user')

    if (storedAccessToken && storedRefreshToken && storedUserString) {
      try {
        const storedUser: User = JSON.parse(storedUserString);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(storedUser);

        // Opcional: Se quiser garantir que os dados do usuário estão sempre atualizados com o backend
        // você pode chamar userService.getMyProfile() aqui e atualizar o user state.
        // const fetchedUser = await userService.getMyProfile();
        // setUser(fetchedUser);

      } catch (error) {
        console.error("Erro ao parsear usuário do cookie:", error);
        // Limpa cookies inválidos
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

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

  // Implementação da função refreshUser
  const refreshUser = useCallback(async () => {
    // Esta função pode recarregar o usuário diretamente do backend
    // ou simplesmente re-parsear do cookie se você preferir.
    // Para garantir que os dados estejam atualizados com o backend, é melhor buscar:
    try {
      const fetchedUser = await userService.getMyProfile();
      setUser(fetchedUser);
      // Atualiza o cookie 'user' também para consistência
      Cookies.set('user', JSON.stringify(fetchedUser), { expires: 7 });
    } catch (error) {
      console.error("Erro ao recarregar perfil do usuário:", error);
      // Se houver erro ao recarregar, pode significar que o token expirou ou é inválido
      // Neste caso, você pode querer deslogar o usuário
      logout();
    }
  }, [logout]); // Depende de logout para deslogar em caso de erro

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        isAuthenticated: !!accessToken,
        isLoading,
        refreshUser, // <--- ADICIONE ESTA PROPRIEDADE AO VALUE
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