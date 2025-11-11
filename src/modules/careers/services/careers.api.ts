import { ENDPOINTS } from "@/lib/endpoints";
import { Career, CreateCareerDto } from "../types/career.types";
import { axiosInstance } from "@/lib/axios/config";

export class CareersApi {
  static async getAll(): Promise<Career[]> {
    const { data } = await axiosInstance.get(ENDPOINTS.CAREERS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Career> {
    const { data } = await axiosInstance.get(`${ENDPOINTS.CAREERS.BASE}/${id}`);
    return data;
  }

  static async create(career: CreateCareerDto): Promise<Career> {
    const { data } = await axiosInstance.post(ENDPOINTS.CAREERS.BASE, career);
    return data;
  }

  static async update(
    id: number,
    career: Partial<CreateCareerDto>
  ): Promise<Career> {
    const { data } = await axiosInstance.patch(
      `${ENDPOINTS.CAREERS.BASE}/${id}`,
      career
    );
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.CAREERS.BASE}/${id}`);
  }
}
