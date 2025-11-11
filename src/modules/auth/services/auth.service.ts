import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string; // <- este campo ya contiene el rol del usuario
  activo: boolean;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    // devolvemos el token + los datos del usuario (incluye su rol)
    return data;
  }

  static async logout(): Promise<void> {
    await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
  }

  static async refreshToken(): Promise<{ access_token: string }> {
    const { data } = await axiosInstance.post<{ access_token: string }>(
      ENDPOINTS.AUTH.REFRESH
    );
    return data;
  }
}
