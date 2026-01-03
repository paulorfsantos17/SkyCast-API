// src/services/user.service.ts
import { z } from 'zod'
import api from './api'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user']),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type User = z.infer<typeof UserSchema>

export const CreateUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(1, "O nome é obrigatório"),
  role: z.enum(['admin', 'user']).optional(),
})
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>

export const UpdateUserPayloadSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  name: z.string().min(1, "O nome é obrigatório").optional(),
  role: z.enum(['admin', 'user']).optional(),
})
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<{ users: User[] }>('/users')
    return response.data.users
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<{user : User}>('/users', payload)
    return response.data.user
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.put<{user : User}>(`/users/${id}`, payload)
    return response.data.user 
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
