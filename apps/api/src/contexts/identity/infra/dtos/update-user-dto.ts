import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  role: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
