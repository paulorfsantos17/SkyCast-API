import { userService } from '@/services/user.service';
import Cookies from 'js-cookie';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserFromStorage = useCallback(async () => {
    const storedAccessToken = Cookies.get('accessToken');
    const storedRefreshToken = Cookies.get('refreshToken');
    const storedUserString = Cookies.get('user');

    if (storedAccessToken && storedRefreshToken && storedUserString) {
      try {
        const storedUser: User = JSON.parse(storedUserString);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(storedUser);
      } catch (error) {
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
    Cookies.set('accessToken', newAccessToken, { expires: 1 / 96 });
    Cookies.set('refreshToken', newRefreshToken, { expires: 7 });
    Cookies.set('user', JSON.stringify(newUser), { expires: 7 });

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await userService.getMyProfile();
      setUser(response.user);
      Cookies.set('user', JSON.stringify(response.user), { expires: 7 });
    } catch (error) {
      console.error("Erro ao recarregar perfil do usuário:", error);
      logout();
    }
  }, [logout]);

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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};