
import api from "./api"

export type UserRole = "admin" | "user"

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role?: UserRole // opcional no payload, vamos setar default no service
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const body = {
    ...payload,
    role: payload.role ?? "user",
  }

  const response = await api.post<User>("/users", body)
  return response.data
}