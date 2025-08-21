import { apiRequest } from ".";

const BASE_URL = "/api/projects";

/**
 * Project-related API functions
 * All return: { success: boolean, data?: any, message?: string }
 */

export const createProject = async (project) => 
  apiRequest("post", `${BASE_URL}/create-project`, project);

export const getAllProjects = async (filters) => 
  apiRequest("post", `${BASE_URL}/get-all-projects`, filters);

export const getProjectById = async (id) => 
  apiRequest("post", `${BASE_URL}/get-project-by-id`, { _id: id });

export const editProject = async (project) => 
  apiRequest("post", `${BASE_URL}/edit-project`, project);

export const deleteProject = async (id) => 
  apiRequest("post", `${BASE_URL}/delete-project`, { _id: id });

export const getProjectsByRole = async (userId) => 
  apiRequest("post", `${BASE_URL}/get-projects-by-role`, { userId });

export const addMemberToProject = async (data) => 
  apiRequest("post", `${BASE_URL}/add-member`, data);

export const removeMemberFromProject = async (data) => 
  apiRequest("post", `${BASE_URL}/remove-member`, data);
