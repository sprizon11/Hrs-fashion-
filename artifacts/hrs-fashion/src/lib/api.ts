const BASE = "/api";

async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" })) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: (password: string) => apiFetch("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => apiFetch("/admin/logout", { method: "POST" }),
  me: () => apiFetch<{ authenticated: boolean }>("/admin/me"),

  getProducts: () => apiFetch<ApiProduct[]>("/products?admin=true"),
  createProduct: (data: Partial<ApiProduct>) => apiFetch<ApiProduct>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<ApiProduct>) => apiFetch<ApiProduct>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => apiFetch(`/products/${id}`, { method: "DELETE" }),

  getOrders: () => apiFetch<ApiOrder[]>("/orders"),
  updateOrderStatus: (id: string, status: string) => apiFetch<ApiOrder>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  getSummary: () => apiFetch<AnalyticsSummary>("/analytics/summary"),
  getRevenue: () => apiFetch<RevenueRow[]>("/analytics/revenue"),
  getTopProducts: () => apiFetch<TopProduct[]>("/analytics/top-products"),
  getOrdersByStatus: () => apiFetch<{ status: string; count: number }[]>("/analytics/orders-by-status"),
};

export const storeApi = {
  getProducts: () => apiFetch<ApiProduct[]>("/products"),
  getProduct: (id: string) => apiFetch<ApiProduct>(`/products/${id}`),
  createOrder: (data: CreateOrderPayload) => apiFetch<ApiOrder>("/orders", { method: "POST", body: JSON.stringify(data) }),
};

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  image: string;
  images?: string[];
  isNew?: boolean;
  isActive?: boolean;
  description: string;
  details: string[];
  sizes: string[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ApiOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  address?: string | null;
  city?: string | null;
  status: string;
  total: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: ApiOrderItem[];
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  monthRevenue: number;
  pendingOrders: number;
}

export interface RevenueRow {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImage: string;
  totalSold: number;
  totalRevenue: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    size: string;
    quantity: number;
    price: number;
  }[];
}
