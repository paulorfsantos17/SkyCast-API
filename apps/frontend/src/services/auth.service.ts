import { User } from '@/models/User'
import api from './api'

interface LoginResponse {
  access_token: string
  user: User
}

interface RegisterData {
  email: string
  password: string
  name: string
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', data)
    return response.data
  },
}
