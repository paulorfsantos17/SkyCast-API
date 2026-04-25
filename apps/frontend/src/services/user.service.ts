// src/services/user.service.ts
import { z } from 'zod';
import api from './api';

export const UserSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['admin', 'user']),

    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
});

// CORRIGIDO: < e > no lugar de < e >
export type User = z.infer<typeof UserSchema>;

export const CreateUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(1, "O nome é obrigatório"),
  role: z.enum(['admin', 'user']).default('user'),
});
// CORRIGIDO: < e > no lugar de < e >
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;

export const UpdateUserPayloadSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  name: z.string().min(1, "O nome é obrigatório").optional(),
  role: z.enum(['admin', 'user']).optional(),
});
// CORRIGIDO: < e > no lugar de < e >
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;

export const UpdateMyProfilePayloadSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  name: z.string().min(1, "O nome é obrigatório").optional(),
});
// CORRIGIDO: < e > no lugar de < e >
export type UpdateMyProfilePayload = z.infer<typeof UpdateMyProfilePayloadSchema>;


export const userService = {
  // CORRIGIDO: < e > no lugar de < e >
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users');
      return z.array(UserSchema).parse(response.data);
    } catch (error) {
      console.error("Erro em getAllUsers:", error);
      throw error;
    }
  },

  // CORRIGIDO: < e > no lugar de < e >
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return UserSchema.parse(response.data);
    } catch (error) {
      console.error(`Erro em getUserById (${id}):`, error);
      throw error;
    }
  },

  // CORRIGIDO: < e > no lugar de < e >
  async createUser(payload: CreateUserPayload): Promise<User> {
    try {
      const validatedPayload = CreateUserPayloadSchema.parse(payload);
      const response = await api.post<{user : User}>('/users', validatedPayload); // Aqui também
      return UserSchema.parse(response.data.user);
    } catch (error) {
      console.error("Erro em createUser:", error);
      throw error;
    }
  },

  // CORRIGIDO: < e > no lugar de < e >
  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    try {
      const validatedPayload = UpdateUserPayloadSchema.parse(payload);
      const response = await api.put<{user : User}>(`/users/${id}`,  validatedPayload); 
      return UserSchema.parse(response.data.user);
    } catch (error) {
      console.error(`Erro em updateUser (${id}):`, error);
      throw error;
    }
  },

  // Retorno Promise<void> está correto, não precisa de < >
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Erro em deleteUser (${id}):`, error);
      throw error;
    }
  },

  // CORRIGIDO: < e > no lugar de < e >
  async getMyProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/me');

      return UserSchema.parse(response.data);
    } catch (error) {
      console.error("Erro em getMyProfile:", error);
      throw error;
    }
  },

  async updateMyProfile(payload: UpdateMyProfilePayload): Promise<User> {
    try {
      const validatedPayload = UpdateMyProfilePayloadSchema.parse(payload);
      const response = await api.put<{user: User}>('users', validatedPayload); 
      return UserSchema.parse(response.data);
    } catch (error) {
      console.error("Erro em updateMyProfile:", error);
      throw error;
    }
  },
};