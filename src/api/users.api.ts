import api from "./axios";
import type { PaginatedResponse } from "../types/property.types";
import type { User } from "../types/user.types";
import { unwrapData } from "./unwrap";

export const getUsers = async (params: { page: number; limit: number }) => {
  const { data } = await api.get("/users", { params });
  const payload = unwrapData<any>(data);
  if (payload && Array.isArray(payload.items) && payload.meta) {
    return { data: payload.items, meta: payload.meta } as PaginatedResponse<User>;
  }
  return payload as PaginatedResponse<User>;
};

export const getUserById = async (id: number) => {
  const { data } = await api.get(`/users/${id}`);
  return unwrapData<User>(data);
};

export const updateUser = async (id: number, payload: Partial<User>) => {
  const { data } = await api.patch(`/users/${id}`, payload);
  return unwrapData<User>(data);
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return unwrapData(data);
};
