import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Cita, CreateCitaDto } from "../types/cita.types";

export class CitasApi {
  static async getAll(): Promise<Cita[]> {
    const { data } = await axiosInstance.get<Cita[]>(ENDPOINTS.CITAS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Cita> {
    const { data } = await axiosInstance.get<Cita>(`${ENDPOINTS.CITAS.BASE}/${id}`);
    return data;
  }

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

  // Aux: fetch patients and medicos lists (used by form)
  static async getPatients() {
    const { data } = await axiosInstance.get(ENDPOINTS.PATIENTS.BASE);
    return data;
  }

  static async getMedicos() {
    const { data } = await axiosInstance.get(ENDPOINTS.MEDICOS.BASE);
    return data;
  }
}
