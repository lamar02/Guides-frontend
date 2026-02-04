const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://guide-backend-tau.vercel.app/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiKey', key);
    }
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('apiKey');
    }
    return null;
  }

  clearApiKey() {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('apiKey');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const apiKey = this.getApiKey();
    if (apiKey) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'Une erreur est survenue', response.status);
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const apiKey = this.getApiKey();
    const headers: HeadersInit = {};

    if (apiKey) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'Une erreur est survenue', response.status);
    }

    return data;
  }
}

export const api = new ApiClient();
