import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Consulta, CreateConsultaDto } from "../types/consulta.types";

export class ConsultasApi {
  static async getAll(): Promise<Consulta[]> {
    const { data } = await axiosInstance.get<Consulta[]>(ENDPOINTS.CONSULTAS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Consulta> {
    const { data } = await axiosInstance.get<Consulta>(`${ENDPOINTS.CONSULTAS.BASE}/${id}`);
    return data;
  }

  static async create(consulta: CreateConsultaDto): Promise<Consulta> {
    const { data } = await axiosInstance.post<Consulta>(ENDPOINTS.CONSULTAS.BASE, consulta);
    return data;
  }

  static async update(id: number, consulta: Partial<CreateConsultaDto>): Promise<Consulta> {
    const { data } = await axiosInstance.patch<Consulta>(`${ENDPOINTS.CONSULTAS.BASE}/${id}`, consulta);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.CONSULTAS.BASE}/${id}`);
  }
}