import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Cita, CreateCitaDto } from "../types/cita.types";

export class CitasApi {
  static async getAll(): Promise<Cita[]> {
    const { data } = await axiosInstance.get<Cita[]>(ENDPOINTS.CITAS.BASE);
    return data;
  }

  static async getMine(): Promise<Cita[]> {
    const { data } = await axiosInstance.get<Cita[]>(`${ENDPOINTS.CITAS.BASE}/mine`);
    return data;
  }

  static async getById(id: number): Promise<Cita> {
    const { data } = await axiosInstance.get<Cita>(`${ENDPOINTS.CITAS.BASE}/${id}`);
    return data;
  }

  // PACIENTE crea cita
  static async createMyAppointment(payload: CreateCitaDto): Promise<Cita> {
    const { data } = await axiosInstance.post<Cita>(
      `${ENDPOINTS.CITAS.BASE}/create`,
      payload
    );
    return data;
  }

  // ADMIN o MEDICO crea cita
  static async create(payload: CreateCitaDto): Promise<Cita> {
    const { data } = await axiosInstance.post<Cita>(ENDPOINTS.CITAS.BASE, payload);
    return data;
  }

  static async update(id: number, payload: Partial<CreateCitaDto>): Promise<Cita> {
    const { data } = await axiosInstance.patch<Cita>(`${ENDPOINTS.CITAS.BASE}/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.CITAS.BASE}/${id}`);
  }

  // Pacientes (solo admin o medico)
  static async getPatients() {
    const { data } = await axiosInstance.get(ENDPOINTS.PATIENTS.SELECT);
    return data;
  }

  // Lista de médicos (el backend valida permisos)
  static async getMedicos() {
    const { data } = await axiosInstance.get(ENDPOINTS.MEDICOS.PUBLIC);
    return data;
  }

  // Usuario actual (el backend determina si es paciente o médico)
  static async getCurrentUser(): Promise<any> {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  }
}
