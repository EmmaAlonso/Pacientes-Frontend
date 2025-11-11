import { ApiClient } from "../api/client";
import { API_ENDPOINTS } from "../api/config";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
  }

  static async logout(): Promise<void> {
    return ApiClient.post(API_ENDPOINTS.auth.logout, {});
  }

  static async refreshToken(): Promise<{ token: string }> {
    return ApiClient.post(API_ENDPOINTS.auth.refresh, {});
  }
}
