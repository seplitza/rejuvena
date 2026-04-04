// Types for Shop API
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  oldPrice?: number;
  sku: string;
  images: string[];
  category: Category | string;
  tags: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isBundle: boolean;
  bundleItems?: BundleItem[];
  articleWB?: string;
  skuOzon?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  // Marketplace data
  wildberries?: {
    nmId?: string;
    url?: string;
    price?: number;
  };
  ozon?: {
    sku?: string;
    fboSku?: string;
    fbsSku?: string;
    url?: string;
    price?: number;
    categoryId?: number;
  };
  yandexMarket?: {
    sku?: string;
    shopSku?: string;
    url?: string;
    price?: number;
    warranty?: string;
  };
  marketplacePrices?: {
    wildberries?: {
      price: number;
      fetchedAt: string;
    };
    ozon?: {
      price: number;
      fetchedAt: string;
    };
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface BundleItem {
  productId: string;
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
  order?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  user?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  totalAmount?: number;
  promoCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'sbp' | 'yandex';
  shippingMethod: 'cdek' | 'pickup' | 'courier';
  deliveryMethod?: 'cdek' | 'pickup' | 'courier';
  shippingAddress?: ShippingAddress;
  cdekOrderId?: string;
  cdekTrackingNumber?: string;
  statusHistory?: StatusHistoryItem[];
  notes?: string;
  contactMethod?: 'telegram' | 'whatsapp' | 'viber' | 'vk' | 'phone' | 'email';
  fortuneWheelGifts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: Date;
  comment?: string;
}

export interface PromoCode {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'freeShipping';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usageLimit?: number;
  usesCount: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  freeShipping?: boolean;
  createdAt: string;
}

export interface FortuneWheelPrize {
  _id: string;
  name: string;
  type: 'discount' | 'freeProduct' | 'freeShipping' | 'noWin';
  prizeType?: 'discount' | 'freeProduct' | 'freeShipping' | 'noWin';
  description?: string;
  discountPercent?: number;
  productId?: string;
  freeProductId?: string;
  probability: number;
  icon?: string;
  imageUrl?: string;
  color: string;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  timesWon?: number;
}

export interface WheelGift {
  _id: string;
  prizeId: string;
  description: string;
  prizeType: 'discount' | 'product' | 'freeShipping' | 'personalDiscount';
  expiry?: Date;
  expiryDate?: Date;
  used?: boolean;
  isUsed?: boolean;
  usedAt?: Date;
  orderId?: string;
  discountPercent?: number;
}

export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'superadmin' | 'admin' | 'customer';
  fortuneWheelSpins?: number;
  fortuneWheelGifts?: WheelGift[];
  shippingAddresses?: ShippingAddress[];
  orderCount?: number;
  totalSpent?: number;
  personalDiscount?: number;
  personalDiscountExpiry?: Date;
  preferredContactMethod?: 'telegram' | 'whatsapp' | 'viber' | 'vk' | 'sms' | 'email';
  createdAt: string;
}

export interface MarketplaceComparison {
  savings: number;
  savingsPercent: number;
  wildberries?: {
    price: number;
    url: string;
  };
  ozon?: {
    price: number;
    url: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}
