/**
 * API Request Configuration
 * Axios instance with interceptors for web
 */

import axios from 'axios';

// Unified backend API (Jan 15, 2026)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';

// New API for exercises only
export const NEW_API_URL = 'https://api-rejuvena.duckdns.org';

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
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = AuthTokenManager.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set user language (you can make this dynamic later)
    if (config.headers) {
      config.headers.UserLanguage = 'en';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response: any) => {
    // Log API calls
    console.log(`✅ API ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response.data;
  },
  (error: any) => {
    const apiError = handleApiError(error);
    console.error(`❌ API Error:`, apiError);
    return Promise.reject(apiError);
  }
);

// Error handler
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

function handleApiError(error: any): ApiError {
  console.log('Full error object:', error);
  
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as any;
    console.log('Error response data:', data);
    return {
      message: data?.message || data?.error || `Server error (${error.response.status})`,
      status: error.response.status,
      code: data?.code || data?.error_description,
    };
  } else if (error.request) {
    // Request made but no response - likely CORS or network issue
    console.log('No response received:', error.request);
    return {
      message: 'Cannot connect to server. This might be a CORS issue. Please check the API settings.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something else happened
    console.log('Error:', error.message);
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
}

export { request, AuthTokenManager };
export type { ApiError };
