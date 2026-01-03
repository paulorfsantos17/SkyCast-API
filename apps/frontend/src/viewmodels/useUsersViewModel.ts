// src/viewmodels/useUsersViewModel.ts
import { useToast } from '@/hooks/use-toast'
import { CreateUserPayload, UpdateUserPayload, User, UserSchema, userService } from '@/services/user.service'
import { useCallback, useEffect, useState } from 'react'

export const useUsersViewModel = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const responseData = await userService.getAllUsers()
      console.log('Dados recebidos da API (antes da validação Zod):', responseData);
      if (!Array.isArray(responseData)) {
        throw new Error('A API não retornou uma lista de usuários válida. Resposta inesperada.')
      }
      const validatedUsers = responseData.map(user => UserSchema.parse(user))
      setUsers(validatedUsers)
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err)
      const errorMessage = err.message || 'Falha ao carregar usuários.'
      setError(errorMessage)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const createUser = useCallback(async (payload: CreateUserPayload) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const newUser = await userService.createUser(payload)
      const validatedNewUser = UserSchema.parse(newUser);
      setUsers((prevUsers) => [...prevUsers, validatedNewUser])
      toast({
        title: 'Sucesso!',
        description: 'Usuário criado com sucesso.',
      })
      return true
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      const errorMessage = err.message || 'Falha ao criar usuário.'
      setError(errorMessage)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [toast])

  const updateUser = useCallback(async (id: string, payload: UpdateUserPayload) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const updatedUser = await userService.updateUser(id, payload)
      const validatedUpdatedUser = UserSchema.parse(updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? validatedUpdatedUser : user))
      )
      toast({
        title: 'Sucesso!',
        description: 'Usuário atualizado com sucesso.',
      })
      return true
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err)
      const errorMessage = err.message || 'Falha ao atualizar usuário.'
      setError(errorMessage)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [toast])

  const deleteUser = useCallback(async (id: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await userService.deleteUser(id)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      toast({
        title: 'Sucesso!',
        description: 'Usuário excluído com sucesso.',
      })
      return true
    } catch (err: any) {
      console.error('Erro ao deletar usuário:', err)
      const errorMessage = err.message || 'Falha ao deletar usuário.'
      setError(errorMessage)
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    isSubmitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
