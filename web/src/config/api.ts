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
  // ALWAYS use production backend (local frontend + prod backend for UI testing)
  return process.env.NEXT_PUBLIC_API_URL || 'https://api-rejuvena.duckdns.org';
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
