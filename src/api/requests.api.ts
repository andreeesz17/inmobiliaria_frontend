import api from "./axios";
import { unwrapData } from "./unwrap";
import type { CreateRequestPayload } from "../types/request.types";

export const getRequests = async () => {
  const { data } = await api.get("/requests");
  return unwrapData(data);
};

export const createRequest = async (payload: CreateRequestPayload) => {
  try {
    console.log('Creating request with payload:', JSON.stringify(payload, null, 2));
    const { data } = await api.post("/requests", payload);
    console.log('Request created successfully:', data);
    return unwrapData(data);
  } catch (error: any) {
    console.error('API Error creating request:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    throw error;
  }
};

export const updateRequestStatus = async (requestId: string, status: 'approved' | 'declined') => {
  try {
    console.log('Updating request status:', { requestId, status });
    
    // Use the confirmed working endpoint
    const response = await api.patch(`/requests/${requestId}/status`, { status });
    console.log('✅ Request status updated successfully');
    
    return unwrapData(response.data);
  } catch (error: any) {
    console.error('Failed to update request status:', error.response?.data || error.message);
    throw error;
  }
};

export const getRequestById = async (id: string) => {
  const { data } = await api.get(`/requests/${id}`);
  return unwrapData(data);
};
