/**
 * API Configuration
 * Centralized API URL management
 */

// Determine API URL based on environment
const getApiUrl = (): string => {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    // In development, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:9527';
    }
  }
  
  // Production API - use direct IP until DNS propagates
  // DuckDNS domain: api-rejuvena.duckdns.org -> 37.252.20.170
  return process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  exercises: {
    public: `${API_URL}/api/exercises/public`,
    byId: (id: string) => `${API_URL}/api/exercises/${id}`,
  },
  courses: {
    public: `${API_URL}/api/courses/public`,
    byId: (id: string) => `${API_URL}/api/courses/${id}`,
  },
};

// For backward compatibility
export const NEW_API_URL = API_URL;
