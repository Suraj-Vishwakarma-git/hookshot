const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const TOKEN_KEY = "hookshot_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
export const apiRequest = async (path, options = {}) => {
  const headers = { ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}), ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...(options.headers || {}) };
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers, body: options.body !== undefined && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body });
  } catch {
    throw new Error(`Cannot reach the API at ${API_BASE}. Start the backend and check VITE_API_BASE_URL.`);
  }
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed (${response.status})`);
    error.status = response.status; error.payload = payload;
    if (response.status === 401) setToken(null);
    throw error;
  }
  return payload;
};
export const authApi = {
  signup: (body) => apiRequest("/api/auth/signup", { method: "POST", body }),
  login: (body) => apiRequest("/api/auth/login", { method: "POST", body }),
  me: () => apiRequest("/api/auth/me"),
};
export const endpointApi = {
  list: () => apiRequest("/api/endpoints"),
  create: (url) => apiRequest("/api/endpoints", { method: "POST", body: { url } }),
  update: (id, patch) => apiRequest(`/api/endpoints/${id}`, { method: "PATCH", body: patch }),
  remove: (id) => apiRequest(`/api/endpoints/${id}`, { method: "DELETE" }),
};
export const eventApi = {
  list: () => apiRequest("/api/events"),
  get: (id) => apiRequest(`/api/events/${id}`),
  create: (body, idempotencyKey) => apiRequest("/api/events", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body }),
};
export const systemApi = { cache: () => apiRequest("/debug/cache") };
