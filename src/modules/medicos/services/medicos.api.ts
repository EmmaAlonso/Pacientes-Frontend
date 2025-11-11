import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Medico, CreateMedicoDto } from "../types/medico.types";

export class MedicosApi {
  static async getAll(): Promise<Medico[]> {
    const { data } = await axiosInstance.get<Medico[]>(ENDPOINTS.MEDICOS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Medico> {
    const { data } = await axiosInstance.get<Medico>(`${ENDPOINTS.MEDICOS.BASE}/${id}`);
    return data;
  }

  static async create(medico: CreateMedicoDto): Promise<Medico> {
    const { data } = await axiosInstance.post<Medico>(ENDPOINTS.MEDICOS.BASE, medico);
    return data;
  }

  static async update(id: number, medico: Partial<CreateMedicoDto>): Promise<Medico> {
    const { data } = await axiosInstance.patch<Medico>(`${ENDPOINTS.MEDICOS.BASE}/${id}`, medico);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.MEDICOS.BASE}/${id}`);
  }
}
