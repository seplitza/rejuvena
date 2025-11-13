/**
 * API Request Configuration
 * Axios instance with interceptors for web
 */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.faceliftnaturally.me';

// Token management for web
class AuthTokenManager {
  private static TOKEN_KEY = 'auth_token';

  static get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static set(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static remove(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

// Create axios instance
const request = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = AuthTokenManager.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set user language (you can make this dynamic later)
    config.headers.UserLanguage = 'en';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    // Log API calls in development
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log(`API ${response.config.url}`, response.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(handleApiError(error));
  }
);

// Error handler
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as any;
    return {
      message: data?.message || 'An error occurred',
      status: error.response.status,
      code: data?.code,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}

export { request, AuthTokenManager };
export type { ApiError };
