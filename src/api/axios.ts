import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_URL || "https://inmocoregroup.online";

const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

api.interceptors.request.use((config) => {
  const publicRoutes = ["/api/auth/login", "/api/auth/register"];

  const fullUrl = (config.baseURL || "") + (config.url || "");
  const isPublicRoute = publicRoutes.some((route) =>
    fullUrl.includes(route)
  );

  if (isPublicRoute) return config;

  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Petición privada sin token:", fullUrl);
  }

  return config;
});

export default api;
