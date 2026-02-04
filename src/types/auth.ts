export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  apiKey: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}
