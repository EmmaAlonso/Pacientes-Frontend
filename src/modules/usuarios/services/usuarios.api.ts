// frontend/src/modules/usuarios/services/usuarios.api.ts
import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { CreateUsuarioDto } from "@/modules/usuarios/types/usuario.types"; // opcional, si tienes tipos

export class UsuariosApi {
  static async create(payload: CreateUsuarioDto) {
    // POST /usuarios (protegido, admin debe estar autenticado)
  const { data } = await axiosInstance.post(ENDPOINTS.USERS.BASE, payload);
    return data;
  }

  static async update(id: number, payload: Partial<CreateUsuarioDto>) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.USERS.BASE}/${id}`, payload);
    return data;
  }

  // opcionales si los necesitas
  static async getAll() {
  const { data } = await axiosInstance.get(ENDPOINTS.USERS.BASE);
    return data;
  }

  static async getById(id: number) {
  const { data } = await axiosInstance.get(`${ENDPOINTS.USERS.BASE}/${id}`);
    return data;
  }
}
