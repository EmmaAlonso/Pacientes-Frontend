import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupPayload {
  nombre: string;
  email: string;
  password: string;
  rol?: string; // por defecto "PACIENTE"
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
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
    return data;
  }

  // 🔥 NECESARIO PARA CREAR PACIENTES QUE TENGAN SU PROPIO USUARIO
  static async signup(payload: SignupPayload): Promise<AuthResponse> {
    // Try several possible signup endpoints to be compatible with different backends
    const candidates = [ENDPOINTS?.AUTH?.REGISTER, "/auth/signup", "/auth/register"] as string[];

    let lastError: any = null;
    for (const ep of candidates) {
      if (!ep) continue;
      try {
        const { data } = await axiosInstance.post<AuthResponse>(ep, payload);
        return data;
      } catch (err: any) {
        lastError = err;
        // If 404 try next candidate, otherwise rethrow
        if (err?.response?.status && err.response.status !== 404) {
          throw err;
        }
      }
    }

    // If we reach here, all candidates returned 404 or failed silently — throw last error
    throw lastError ?? new Error("Signup failed: no endpoint available");
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
