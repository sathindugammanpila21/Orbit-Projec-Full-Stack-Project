import { apiRequest } from ".";

const BASE_URL = "/api/users";

/**
 * User-related API functions
 * All return: { success: boolean, data?: any, message?: string }
 */

export const registerUser = async (payload) => 
  apiRequest("post", `${BASE_URL}/register`, payload);

export const loginUser = async (payload) => 
  apiRequest("post", `${BASE_URL}/login`, payload);

export const getLoggedInUser = async () => 
  apiRequest("get", `${BASE_URL}/get-logged-in-user`);
