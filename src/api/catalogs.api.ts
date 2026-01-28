// Catalogs API - Enhanced with detailed logging
import api from "./axios";
import { unwrapData } from "./unwrap";

export const getCategories = async () => {
  console.log('API Request - getCategories:', {
    url: `${api.defaults.baseURL}/categories`,
    method: 'GET',
    headers: api.defaults.headers
  });
  
  const response = await api.get("/categories");
  console.log('API Response - getCategories:', {
    status: response.status,
    data: response.data
  });
  
  const payload = unwrapData<any>(response.data);
  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }
  return payload;
};

export const getLocations = async () => {
  console.log('API Request - getLocations:', {
    url: `${api.defaults.baseURL}/locations`,
    method: 'GET',
    headers: api.defaults.headers
  });
  
  const response = await api.get("/locations");
  console.log('API Response - getLocations:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const getPropertyFeatures = async () => {
  console.log('API Request - getPropertyFeatures:', {
    url: `${api.defaults.baseURL}/property-features`,
    method: 'GET',
    headers: api.defaults.headers
  });
  
  const response = await api.get("/property-features");
  console.log('API Response - getPropertyFeatures:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const createCategory = async (categoryData: { name: string }) => {
  // El backend solo acepta el campo name
  const normalizedData = {
    name: categoryData.name
  };
  
  // NOTA: imageId REMOVIDO porque el backend responde con 'property imageId should not exist'
  
  console.log('API Request - createCategory:', {
    url: `${api.defaults.baseURL}/categories`,
    method: 'POST',
    headers: api.defaults.headers,
    data: normalizedData
  });
  
  const response = await api.post("/categories", normalizedData);
  console.log('API Response - createCategory:', {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const createLocation = async (locationData: { name: string; description?: string; imageId?: string }) => {
  console.log('API Request - createLocation:', {
    url: `${api.defaults.baseURL}/locations`,
    method: 'POST',
    headers: api.defaults.headers,
    data: locationData
  });
  
  const response = await api.post("/locations", locationData);
  console.log('API Response - createLocation:', {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const createPropertyFeature = async (featureData: { name: string; description?: string; imageId?: string }) => {
  console.log('API Request - createPropertyFeature:', {
    url: `${api.defaults.baseURL}/property-features`,
    method: 'POST',
    headers: api.defaults.headers,
    data: featureData
  });
  
  const response = await api.post("/property-features", featureData);
  console.log('API Response - createPropertyFeature:', {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data
  });
  
  return unwrapData(response.data);
};

// Update functions
export const updateCategory = async (id: string, categoryData: { name: string }) => {
  const normalizedData = {
    name: categoryData.name
  };
  
  console.log('API Request - updateCategory:', {
    url: `${api.defaults.baseURL}/categories/${id}`,
    method: 'PATCH',
    headers: api.defaults.headers,
    data: normalizedData
  });
  
  const response = await api.patch(`/categories/${id}`, normalizedData);
  console.log('API Response - updateCategory:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const updateLocation = async (id: string, locationData: { name: string }) => {
  const normalizedData = {
    name: locationData.name
  };
  
  console.log('API Request - updateLocation:', {
    url: `${api.defaults.baseURL}/locations/${id}`,
    method: 'PATCH',
    headers: api.defaults.headers,
    data: normalizedData
  });
  
  const response = await api.patch(`/locations/${id}`, normalizedData);
  console.log('API Response - updateLocation:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const updatePropertyFeature = async (id: string, featureData: { name: string }) => {
  const normalizedData = {
    name: featureData.name
  };
  
  console.log('API Request - updatePropertyFeature:', {
    url: `${api.defaults.baseURL}/property-features/${id}`,
    method: 'PATCH',
    headers: api.defaults.headers,
    data: normalizedData
  });
  
  const response = await api.patch(`/property-features/${id}`, normalizedData);
  console.log('API Response - updatePropertyFeature:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

// Delete functions
export const deleteCategory = async (id: string) => {
  console.log('API Request - deleteCategory:', {
    url: `${api.defaults.baseURL}/categories/${id}`,
    method: 'DELETE',
    headers: api.defaults.headers
  });
  
  const response = await api.delete(`/categories/${id}`);
  console.log('API Response - deleteCategory:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const deleteLocation = async (id: string) => {
  console.log('API Request - deleteLocation:', {
    url: `${api.defaults.baseURL}/locations/${id}`,
    method: 'DELETE',
    headers: api.defaults.headers
  });
  
  const response = await api.delete(`/locations/${id}`);
  console.log('API Response - deleteLocation:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};

export const deletePropertyFeature = async (id: string) => {
  console.log('API Request - deletePropertyFeature:', {
    url: `${api.defaults.baseURL}/property-features/${id}`,
    method: 'DELETE',
    headers: api.defaults.headers
  });
  
  const response = await api.delete(`/property-features/${id}`);
  console.log('API Response - deletePropertyFeature:', {
    status: response.status,
    data: response.data
  });
  
  return unwrapData(response.data);
};
