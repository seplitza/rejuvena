import apiClient from './client';
import type {
  Product,
  ProductsResponse,
  Category,
  PromoCode,
  Order,
  FortuneWheelPrize,
  WheelGift,
  MarketplaceComparison,
  ApiResponse
} from '@/types/shop';

// Products
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<ProductsResponse> => {
  const response = await apiClient.get('/api/shop/products', { params });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get(`/api/shop/products/${id}`);
  return response.data;
};

export const compareProductPrice = async (id: string): Promise<MarketplaceComparison> => {
  const response = await apiClient.get(`/api/shop/products/${id}/compare-price`);
  return response.data;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/api/shop/categories');
  return response.data;
};

// Promo Codes
export const validatePromoCode = async (data: {
  code: string;
  cartTotal: number;
  productIds: string[];
}): Promise<{
  valid: boolean;
  discount?: number;
  freeShipping?: boolean;
  message?: string;
}> => {
  const response = await apiClient.post('/api/shop/validate-promo', data);
  return response.data;
};

// Orders
export const createOrder = async (data: {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  shippingMethod: 'cdek' | 'pickup' | 'courier';
  paymentMethod: 'card' | 'sbp' | 'yandex';
  promoCode?: string;
  contactMethod?: 'telegram' | 'whatsapp' | 'viber' | 'vk' | 'phone' | 'email';
  fortuneWheelGiftIds?: string[];
  notes?: string;
}): Promise<Order> => {
  const response = await apiClient.post('/api/shop/checkout', data);
  return response.data;
};

export const getUserOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const response = await apiClient.get('/api/shop/orders', { params });
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await apiClient.get(`/api/shop/orders/${id}`);
  return response.data;
};

// Fortune Wheel
export const getFortuneWheelPrizes = async (): Promise<FortuneWheelPrize[]> => {
  const response = await apiClient.get('/api/fortune-wheel/prizes');
  return response.data;
};

export const getAvailableSpins = async (): Promise<{ availableSpins: number }> => {
  const response = await apiClient.get('/api/fortune-wheel/available-spins');
  return response.data;
};

export const spinWheel = async (): Promise<{
  prize: FortuneWheelPrize;
  remainingSpins: number;
  gift: WheelGift;
}> => {
  const response = await apiClient.post('/api/fortune-wheel/spin');
  return response.data;
};

export const getMyGifts = async (): Promise<WheelGift[]> => {
  const response = await apiClient.get('/api/fortune-wheel/my-gifts');
  return response.data;
};

export const getWheelHistory = async (): Promise<Array<{
  _id: string;
  userId: string;
  prizeId: FortuneWheelPrize;
  wonAt: string;
}>> => {
  const response = await apiClient.get('/api/fortune-wheel/my-history');
  return response.data;
};

// CDEK Offices
export const searchCdekOffices = async (city: string, limit = 10): Promise<Array<{
  code: string;
  name: string;
  location: {
    address: string;
    city: string;
  };
  workTime: string;
  phones: Array<{ number: string }>;
}>> => {
  const response = await apiClient.get('/api/shop/cdek/offices', {
    params: { city, limit }
  });
  return response.data;
};

// CDEK Delivery Calculation
export const calculateDelivery = async (data: {
  cityFrom: string;
  cityTo: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}): Promise<{
  cost: number;
  deliveryDays: number;
}> => {
  const response = await apiClient.post('/api/shop/cdek/calculate', data);
  return response.data;
};
