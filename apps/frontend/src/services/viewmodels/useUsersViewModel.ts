// src/services/viewmodels/useProfileViewModel.ts
import { useAuth } from "@/contexts/AuthContext"; // Agora com refreshUser
import { useToast } from '@/hooks/use-toast';
import { UpdateMyProfilePayload, User, userService } from "@/services/user.service";
import { useCallback, useEffect, useState } from "react";

export const useProfileViewModel = () => {
  const { user, isAuthenticated, refreshUser } = useAuth(); // Pega o usuário logado e a função refreshUser
  const { toast } = useToast();

  const [profile, setProfile] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await userService.getMyProfile();
      setProfile(data);
      setName(data.user.name);
      setEmail(data.user.email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar perfil.";
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user?.id) {
      const errorMessage = "Usuário não autenticado.";
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }

    try {
      const payload: UpdateMyProfilePayload = {
        name,
        email,
      };
      if (password) {
        payload.password = password;
      }

      const updated = await userService.updateMyProfile(payload);
      setProfile(updated);
      setPassword("");
      setSuccessMessage("Perfil atualizado com sucesso!");
      toast({
        title: 'Sucesso!',
        description: 'Perfil atualizado com sucesso.',
      });
      refreshUser(); // Chama a função refreshUser do AuthContext
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar perfil.";
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    saving,
    error,
    successMessage,
    handleSubmit,
    reload: loadProfile,
  };
};