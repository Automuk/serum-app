export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Product {
  _id: string;
  name: string;
  serum_type: string;
  key_ingredients: string[];
  size: string;
  price: number;
  badge?: string | null;
  description?: string | null;
  image_url?: string | null;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItemInput {
  product_id: string;
  quantity: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderPayload {
  email: string;
  items: OrderItemInput[];
  shipping_address: ShippingAddress;
}

export interface Order {
  _id: string;
  email: string;
  items: {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  shipping_address: ShippingAddress;
  total: number;
  status: string;
  created_at: string;
}

interface ListParams {
  serum_type?: string;
  badge?: string;
  search?: string;
  sort?: string;
}

export interface ProductInput {
  name: string;
  serum_type: string;
  key_ingredients: string[];
  size: string;
  price: number;
  badge?: string | null;
  description?: string | null;
  image_url?: string | null;
  stock: number;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getProducts(params: ListParams = {}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params.serum_type) query.set("serum_type", params.serum_type);
  if (params.badge) query.set("badge", params.badge);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });
  return handle<Product[]>(res);
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  return handle<Product>(res);
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Order>(res);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

// --- Admin API (cookie-authenticated) ---

export async function adminLogin(username: string, password: string): Promise<{ username: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handle(res);
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
}

export async function adminMe(): Promise<{ username: string }> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: "include", cache: "no-store" });
  return handle(res);
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Product>(res);
}

export async function updateProduct(id: string, payload: Partial<ProductInput>): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Product>(res);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handle<void>(res);
}

export async function getAllOrders(status?: string): Promise<Order[]> {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  const res = await fetch(`${API_URL}/orders/admin/all?${query.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<Order[]>(res);
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handle<Order>(res);
}
