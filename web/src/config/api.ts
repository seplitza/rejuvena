/**
 * API Configuration - Unified Auth (Strangler Fig Pattern)
 * Centralized API URL management
 * 
 * UNIFIED AUTH CONFIGURATION:
 * - ALL requests go to NEW Backend
 * - Auth endpoint has fallback to Azure (transparent)
 * - Single JWT token for everything
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
  
  // Production: NEW backend with unified auth (using IP due to DNS issues)
  return process.env.NEXT_PUBLIC_API_URL || 'http://37.252.20.170:9527';
};

export const API_URL = getOldApiUrl(); // Unified backend for everything

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
