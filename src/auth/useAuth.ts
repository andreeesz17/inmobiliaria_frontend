import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginApi } from "../api/auth.api";
import { authStorage } from "./auth.storage";
import type { JwtPayload, LoginPayload } from "./auth.types";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // ✅ para que al recargar la página NO pierdas el role
  useEffect(() => {
    const token = authStorage.getToken();
    
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const detectedRole = decoded.role ?? decoded.roles?.[0] ?? null;
      setRole(detectedRole);
      setUsername(decoded.username ?? null);
    } catch (error) {
      // token dañado o inválido
      authStorage.clearToken();
      setRole(null);
      setUsername(null);
    }
  }, []);

  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const res = await loginApi(data);
      const token: string = res.access_token;

      if (!token) {
        throw new Error("No token returned");
      }

      authStorage.setToken(token);

      const decoded = jwtDecode<JwtPayload>(token);
      const detectedRole = decoded.role ?? decoded.roles?.[0] ?? null;
      setRole(detectedRole);
      setUsername(decoded.username ?? null);

      return true;
    } catch (e: any) {
      authStorage.clearToken();
      setRole(null);
      setUsername(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authStorage.clearToken();
    setRole(null);
    setUsername(null);
    window.location.href = "/login";
  };

  const token = authStorage.getToken();
  const roleLower = role?.toLowerCase() ?? null;

  return {
    login,
    logout,
    loading,
    role,
    username,
    isAdmin: roleLower === "admin",
    isAgent: roleLower === "agent",
    isUser: roleLower === "user",
    isAuthenticated: !!token,
  };
};
