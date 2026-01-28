import axios from "axios";

const rawBaseUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api";
const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

api.interceptors.request.use((config) => {
  // 1. Definir rutas que NO necesitan token (rutas públicas)
  const publicRoutes = ['/api/auth/login', '/api/auth/register'];
  const fullUrl = (config.baseURL || '') + (config.url || '');
  const isPublicRoute = publicRoutes.some(route => fullUrl.includes(route));

  // Si es una ruta pública, no buscar token, solo dejar pasar la petición
  if (isPublicRoute) {
    return config;
  }

  // 2. Buscar el token solo para rutas privadas
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Solo loguear advertencia para rutas privadas sin token
    console.warn('⚠️ Petición privada sin token:', fullUrl);
  }

  return config;
});

export default api;
