import { api } from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (response.data) {
      api.setApiKey(response.data.apiKey);
    }
    return response.data!;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data) {
      api.setApiKey(response.data.apiKey);
    }
    return response.data!;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data!;
  },

  async rotateApiKey(): Promise<string> {
    const response = await api.post<{ apiKey: string }>('/auth/rotate');
    if (response.data) {
      api.setApiKey(response.data.apiKey);
    }
    return response.data!.apiKey;
  },

  logout() {
    api.clearApiKey();
  },

  isAuthenticated(): boolean {
    return !!api.getApiKey();
  },
};
