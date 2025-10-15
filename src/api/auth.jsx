import axios from "axios";
import { logoutUser } from "../context/AuthContext";

// Create API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add access token to every request
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
          console.log("Access token expired, trying to refresh...");
          
          // Try to refresh the access token - matches your API spec: POST /token/refresh/
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}token/refresh/`,
            { refresh: refreshToken }
          );

          if (refreshResponse.data.access) {
            const newAccessToken = refreshResponse.data.access;
            
            // Save new access token
            localStorage.setItem("accessToken", newAccessToken);
            
            // Update the failed request with new token and retry
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            console.log("Token refreshed successfully, retrying request...");
            return API(originalRequest);
          }
        } catch (refreshError) {
          console.log("Refresh token expired or invalid, logging out...");
          logoutUser();
          return Promise.reject(refreshError);
        }
      } else {
        console.log("No refresh token available, logging out...");
        logoutUser();
      }
    }
    
    return Promise.reject(error);
  }
);

// Login  POST /token/
export const loginUser = (credentials) => {
  console.log("Making login request to api/token/");
  // { email, password }
  return API.post("api/token/", {
    email: credentials.email,
    password: credentials.password
  });
};

// Register API call
export const registerUser = (userData) => {
  return API.post("api/auth/register", userData);
};


// Manual token refresh function (if needed)
export const refreshTokens = (refreshToken) => {
  console.log("refreshing tokens...");
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}token/refresh/`, {
    refresh: refreshToken
  });
};

// Function to validate and refresh tokens if needed
export const validateAndRefreshTokens = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  
  console.log("Validating tokens...");
  
  if (!accessToken || !refreshToken) {
    console.log("Missing tokens, user needs to login");
    return { isValid: false, needsLogin: true };
  }
  
  try {
    // Try to decode and check if access token is expired
    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (tokenPayload.exp > currentTime) {
      console.log("Access token is still valid");
      return { isValid: true, needsLogin: false };
    }
    
    console.log("Access token expired, attempting refresh...");
    
    // Access token expired, try to refresh
    const refreshResponse = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}api/token/refresh/`,
      { refresh: refreshToken }
    );
    
    if (refreshResponse.data.access) {
      const newAccessToken = refreshResponse.data.access;
      localStorage.setItem("accessToken", newAccessToken);
      console.log("Token refreshed successfully");
      return { isValid: true, needsLogin: false, refreshed: true };
    }
    
  } catch (error) {
    console.log("Token validation/refresh failed:", error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Refresh token expired, user needs to login", error.response?.data);
      return { isValid: false, needsLogin: true };
    }
  }
  
  return { isValid: false, needsLogin: true };
};