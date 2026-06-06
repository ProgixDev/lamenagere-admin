/**
 * Typed API client for the La Ménagère Paris backend (NestJS).
 *
 * Additive scaffold for wiring the admin panel to the real backend. Pages still
 * use mock data today; migrate them resource-by-resource to these helpers.
 *
 * Auth: stores the Supabase access token in localStorage under `admin_token`
 * (set it after a Supabase email/password sign-in). Every request sends it as
 * `Authorization: Bearer <token>`.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export interface ApiError {
  message: string;
  status?: number;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const err: ApiError = {
      message: data?.message ?? "Une erreur s'est produite",
      status: res.status,
    };
    throw err;
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  /** Multipart upload to /admin/media; returns the public URL. */
  async upload(file: File, folder = "products"): Promise<{ url: string; path: string }> {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(
      `${API_BASE_URL}/admin/media?folder=${encodeURIComponent(folder)}`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      },
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw { message: data?.message ?? "Upload échoué", status: res.status } as ApiError;
    }
    return res.json();
  },
};

/** Resource helpers mapping to backend routes (extend as pages migrate). */
export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  stats: () => api.get("/admin/stats"),

  products: {
    list: (qs = "") => api.get(`/admin/products${qs}`),
    get: (id: string) => api.get(`/admin/products/${id}`),
    create: (body: unknown) => api.post("/admin/products", body),
    update: (id: string, body: unknown) => api.put(`/admin/products/${id}`, body),
    remove: (id: string) => api.delete(`/admin/products/${id}`),
    publish: (id: string) => api.post(`/admin/products/${id}/publish`),
    archive: (id: string) => api.post(`/admin/products/${id}/archive`),
    bulk: (body: unknown) => api.post("/admin/products/bulk", body),
  },
  categories: {
    list: () => api.get("/admin/categories"),
    create: (body: unknown) => api.post("/admin/categories", body),
    update: (id: string, body: unknown) => api.put(`/admin/categories/${id}`, body),
    remove: (id: string) => api.delete(`/admin/categories/${id}`),
    reorder: (ids: string[]) => api.post("/admin/categories/reorder", { ids }),
  },
  orders: {
    list: (qs = "") => api.get(`/admin/orders${qs}`),
    detail: (id: string) => api.get(`/admin/orders/${id}`),
    update: (id: string, body: unknown) => api.put(`/admin/orders/${id}`, body),
    setStatus: (id: string, body: unknown) => api.put(`/admin/orders/${id}/status`, body),
    ship: (id: string, body: unknown) => api.post(`/admin/orders/${id}/ship`, body),
    refund: (id: string) => api.post(`/admin/orders/${id}/refund`),
    note: (id: string, body: unknown) => api.post(`/admin/orders/${id}/note`, body),
  },
  quotes: {
    list: (status = "") => api.get(`/admin/quotes${status ? `?status=${status}` : ""}`),
    detail: (id: string) => api.get(`/admin/quotes/${id}`),
    update: (id: string, body: unknown) => api.put(`/admin/quotes/${id}`, body),
    setStatus: (id: string, status: string) =>
      api.put(`/admin/quotes/${id}/status`, { status }),
    send: (id: string) => api.post(`/admin/quotes/${id}/send`),
    reject: (id: string) => api.post(`/admin/quotes/${id}/reject`),
  },
  customers: {
    list: (qs = "") => api.get(`/admin/customers${qs}`),
    detail: (id: string) => api.get(`/admin/customers/${id}`),
  },
  conversations: {
    list: () => api.get("/admin/conversations"),
    messages: (id: string) => api.get(`/admin/conversations/${id}/messages`),
    reply: (id: string, body: unknown) => api.post(`/admin/conversations/${id}/messages`, body),
    markRead: (id: string) => api.post(`/admin/conversations/${id}/read`),
  },
  featured: {
    products: () => api.get("/admin/featured/products"),
    addProduct: (productId: string) =>
      api.post("/admin/featured/products", { productId }),
    removeProduct: (productId: string) =>
      api.delete(`/admin/featured/products/${productId}`),
    reorderProducts: (ids: string[]) =>
      api.post("/admin/featured/products/reorder", { ids }),
    carousel: () => api.get("/admin/featured/carousel"),
    createSlide: (body: unknown) => api.post("/admin/featured/carousel", body),
    updateSlide: (id: string, body: unknown) =>
      api.put(`/admin/featured/carousel/${id}`, body),
    deleteSlide: (id: string) => api.delete(`/admin/featured/carousel/${id}`),
    banners: () => api.get("/admin/featured/banners"),
    createBanner: (body: unknown) => api.post("/admin/featured/banners", body),
    updateBanner: (id: string, body: unknown) =>
      api.put(`/admin/featured/banners/${id}`, body),
    deleteBanner: (id: string) => api.delete(`/admin/featured/banners/${id}`),
  },
  settings: {
    get: () => api.get("/admin/settings"),
    update: (body: unknown) => api.put("/admin/settings", body),
  },
  campaigns: {
    list: (status = "") => api.get(`/admin/campaigns${status ? `?status=${status}` : ""}`),
    create: (body: unknown) => api.post("/admin/campaigns", body),
    send: (id: string) => api.post(`/admin/campaigns/${id}/send`),
  },
};
