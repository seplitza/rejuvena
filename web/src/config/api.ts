/**
 * API Configuration - Unified Auth (Strangler Fig Pattern)
 * Centralized API URL management
 * 
 * UNIFIED AUTH CONFIGURATION:
 * - ALL requests go to NEW Backend
 * - Auth endpoint has fallback to Azure (transparent)
 * - Single JWT token for everything
 */

// Production API URL (default for GitHub Pages deployment)
const PRODUCTION_API_URL = 'https://api-rejuvena.duckdns.org';
const LOCAL_API_URL = 'http://localhost:9527';

// OLD Backend - for auth and courses (legacy Azure)
const getOldApiUrl = (): string => {
  // For local development, use localhost if env not set
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL;
  }
  
  // For production (GitHub Pages) - always use production API
  return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
};

export const API_URL = getOldApiUrl(); // Unified backend for everything
export const API_BASE_URL = API_URL; // Alias for consistency

export const API_ENDPOINTS = {
  exercises: {
    public: `${API_URL}/api/exercises/public`,
    byId: (id: string) => `${API_URL}/api/exercises/${id}`,
  },
  courses: {
    public: `${API_URL}/api/courses/public`,
    byId: (id: string) => `${API_URL}/api/courses/${id}`,
  },
  payment: {
    create: `${API_URL}/api/payment/create`,
    status: (orderId: string) => `${API_URL}/api/payment/status/${orderId}`,
  },
};
