// Centralized API client for all Hono Worker endpoints

const BASE = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as any;
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ───────────────────────────────────────
export const api = {
  auth: {
    me: () => request<{ user: AuthUser | null }>('/auth/me'),
    logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),
    googleUrl: () => `/api/auth/google`,
  },

  // ─── Products ────────────────────────────────
  products: {
    list: (params?: { category?: string; sort?: string; limit?: number }) => {
      const qs = new URLSearchParams(params as any).toString();
      return request<{ products: Product[] }>(`/products${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => request<{ product: Product }>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      request<{ product: Product }>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Product>) =>
      request<{ success: boolean }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
  },

  // ─── Cart ────────────────────────────────────
  cart: {
    get: () => request<{ items: CartItem[] }>('/cart'),
    add: (item: { productId: string; name: string; price: number; imageUrl: string; quantity: number }) =>
      request<{ items: CartItem[] }>('/cart', {
        method: 'POST',
        body: JSON.stringify(item),
      }),
    update: (id: string, quantity: number) =>
      request<{ items: CartItem[] }>(`/cart/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    remove: (id: string) =>
      request<{ success: boolean }>(`/cart/${id}`, { method: 'DELETE' }),
    clear: () =>
      request<{ success: boolean }>('/cart', { method: 'DELETE' }),
  },

  // ─── Orders ──────────────────────────────────
  orders: {
    list: () => request<{ orders: Order[] }>('/orders'),
    checkout: (data: CheckoutData) =>
      request<{ success: boolean; orderId: string }>('/checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: Order['status']) =>
      request<{ success: boolean }>(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // ─── Journal ─────────────────────────────────
  journal: {
    list: (limit?: number) =>
      request<{ posts: JournalPost[] }>(`/journal${limit ? `?limit=${limit}` : ''}`),
    get: (id: string) => request<{ post: JournalPost }>(`/journal/${id}`),
    create: (data: Partial<JournalPost>) =>
      request<{ post: JournalPost }>('/journal', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/journal/${id}`, { method: 'DELETE' }),
  },

  // ─── Media ───────────────────────────────────
  media: {
    upload: async (file: File): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json() as Promise<{ url: string }>;
    },
  },

  // ─── Custom Order ────────────────────────────
  customOrder: {
    submit: (data: CustomOrderData) =>
      request<{ success: boolean }>('/custom-order', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ─── Admin ───────────────────────────────────
  admin: {
    users: () => request<{ users: AdminUser[] }>('/users'),
    updateUserRole: (id: string, role: string) =>
      request<{ success: boolean }>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    customOrders: () => request<{ orders: CustomOrderData[] }>('/custom-orders'),
  },
};

// ─── Types ───────────────────────────────────────
export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  video_url?: string;
  stock: number;
  weight?: number;
  shape?: string;
  color?: string;
  treatment?: string;
  height?: number;
  width?: number;
  depth?: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  added_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shipping_address: string;
  shipping_name?: string;
  shipping_email?: string;
  shipping_phone?: string;
  notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export interface JournalPost {
  id: string;
  title: string;
  author: string;
  hero_image_url: string;
  introduction: string;
  sections: { title: string; content: string; imageUrl?: string }[];
  conclusion?: string;
  cta_text?: string;
  cta_link?: string;
  created_at: string;
}

export interface CheckoutData {
  name: string;
  email: string;
  phone?: string;
  shippingAddress: string;
  notes?: string;
}

export interface CustomOrderData {
  name: string;
  email: string;
  phone?: string;
  gemType?: string;
  shape?: string;
  color?: string;
  weightMin?: number;
  weightMax?: number;
  budget?: string;
  notes?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  role: string;
  created_at: string;
}
