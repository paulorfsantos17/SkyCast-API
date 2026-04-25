import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast'; // Verifique o caminho novamente!
import { authService } from '@/services/auth.service';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLoginViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    // 1. SEMPRE CHAME preventDefault PRIMEIRO
    e.preventDefault();

    // 2. Limpe erros e ative loading
    setError(null);
    setLoading(true);

    try {
      // 3. Tente fazer o login
      const response = await authService.login(email, password);
      login(response.accessToken, response.refreshToken, response.user);
      navigate('/dashboard');

      // 4. Toast de sucesso (opcional)
      toast({
        title: 'Login bem-sucedido!',
        description: 'Você foi logado com sucesso.',
        // variant: 'success', // Se seu toast suporta variantes
      });
    } catch (err: any) {
      // 5. O catch DEVE ser acionado se authService.login rejeitar a Promise
      console.log("🚀 ~ handleLogin ~ err:", err); // Verifique o que é logado aqui!

      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      // Verifique se o erro é do Axios e tem uma resposta
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Login ou senha incorretos.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err instanceof Error) {
        // Para outros tipos de erro (ex: "No refresh token" do interceptor)
        errorMessage = err.message;
      }

      setError(errorMessage); // Para exibir no formulário

      // 6. Chame o toast de erro
      toast({
        title: 'Erro no Login',
        description: errorMessage,
        variant: 'destructive', // Use a variante de erro
      });
    } finally {
      // 7. Desative o loading
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
};