/**
 * API Configuration
 * Centralized API URL management
 * 
 * TRANSITIONAL CONFIGURATION:
 * - OLD Backend (Azure): auth, courses
 * - NEW Backend (DuckDNS): exercises only
 */

// OLD Backend - for auth and courses (legacy Azure)
const getOldApiUrl = (): string => {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    // In development, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:9527';
    }
  }
  
  // Production: OLD Azure backend
  return process.env.NEXT_PUBLIC_API_URL || 'https://new-facelift-service-b8cta5hpgcgqf8c7.eastus-01.azurewebsites.net';
};

// NEW Backend - for exercises only
const getNewApiUrl = (): string => {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    // In development, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:9527';
    }
  }
  
  // Production: NEW DuckDNS backend
  return process.env.NEXT_PUBLIC_NEW_API_URL || 'https://api-rejuvena.duckdns.org';
};

export const API_URL = getOldApiUrl(); // For auth and courses
export const NEW_API_URL = getNewApiUrl(); // For exercises

export const API_ENDPOINTS = {
  exercises: {
    public: `${NEW_API_URL}/api/exercises/public`,
    byId: (id: string) => `${NEW_API_URL}/api/exercises/${id}`,
  },
  courses: {
    public: `${API_URL}/api/courses/public`,
    byId: (id: string) => `${API_URL}/api/courses/${id}`,
  },
};
