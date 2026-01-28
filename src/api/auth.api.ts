import api from "./axios";
import type { LoginPayload, RegisterPayload } from "../auth/auth.types";
import { unwrapData } from "./unwrap";

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post("/auth/login", payload);
  return unwrapData<{ access_token: string }>(data);
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return unwrapData<{ access_token: string }>(data);
};
