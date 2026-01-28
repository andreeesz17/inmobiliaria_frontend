/**
 * Utility functions for authentication handling
 */

import { authStorage } from "./auth.storage";

/**
 * Verifies if a JWT token is valid and not expired
 * @param token - JWT token string
 * @returns boolean indicating if token is valid
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < exp;
  } catch (error) {
    return false;
  }
};

/**
 * Gets the current user role from token
 * @returns string | null
 */
export const getUserRole = (): string | null => {
  const token = authStorage.getToken();
  if (!token || !isTokenValid(token)) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? payload.roles?.[0] ?? null;
  } catch (error) {
    console.warn('Error getting user role:', error);
    return null;
  }
};

/**
 * Forces token refresh or redirects to login if invalid
 * @returns boolean indicating if user should be redirected
 */
export const validateAuthStatus = (): boolean => {
  const token = authStorage.getToken();
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return true;
  }
  
  if (!isTokenValid(token)) {
    console.log('Token expired, clearing and redirecting to login');
    authStorage.clearToken();
    return true;
  }
  
  return false;
};

// Debug function removed for production - was only needed during development

/**
 * Refresh token if needed (placeholder for future implementation)
 * @returns Promise<boolean> indicating if refresh was successful
 */
export const refreshToken = async (): Promise<boolean> => {
  // This would call your refresh token endpoint
  // For now, we'll just validate existing token
  const token = authStorage.getToken();
  return isTokenValid(token);
};