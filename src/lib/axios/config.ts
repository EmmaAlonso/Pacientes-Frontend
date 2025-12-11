import axios from "axios";

import { ENDPOINTS } from "../endpoints";

import { TokenService } from "../services/token.service";

export const axiosInstance = axios.create({
  baseURL: ENDPOINTS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      TokenService.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
