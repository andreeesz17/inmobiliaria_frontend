import api from "./axios";
import type { PaginatedResponse, Property } from "../types/property.types";
import { unwrapData } from "./unwrap";

const toPaginated = <T>(
  payload: any,
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  if (payload && Array.isArray(payload.items) && payload.meta) {
    return { data: payload.items, meta: payload.meta };
  }

  if (payload && Array.isArray(payload.data) && payload.meta) {
    return payload as PaginatedResponse<T>;
  }

  if (Array.isArray(payload)) {
    const start = Math.max(0, (page - 1) * limit);
    const end = start + limit;
    const data = payload.slice(start, end);
    const totalItems = payload.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  return {
    data: [],
    meta: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: limit,
      totalPages: 1,
      currentPage: page,
    },
  };
};

export const getProperties = async (params: { page: number; limit: number }) => {
  const { data } = await api.get("/properties", { params });
  const payload = unwrapData<any>(data);
  return toPaginated<Property>(payload, params.page, params.limit);
};

export const getPropertyById = async (id: number) => {
  const { data } = await api.get(`/properties/${id}`);
  return unwrapData<Property>(data);
};

export const createProperty = async (payload: Omit<Property, "id">) => {
  const { data } = await api.post("/properties", payload);
  return unwrapData<Property>(data);
};

export const updateProperty = async (id: number, payload: Partial<Omit<Property, "id">>) => {
  const { data } = await api.put(`/properties/${id}`, payload);
  return unwrapData<Property>(data);
};

export const deleteProperty = async (id: number) => {
  const { data } = await api.delete(`/properties/${id}`);
  return unwrapData(data);
};
