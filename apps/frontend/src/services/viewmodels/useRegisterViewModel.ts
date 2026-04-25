

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../register.service';

export const useRegisterViewModel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      setLoading(false);
      return;
    }

    try {

      createUser({ email, password, name, role: 'user' });
      navigate('/login')
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, name, setName, loading, error, handleRegister };
};