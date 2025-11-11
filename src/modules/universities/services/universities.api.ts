import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { University, CreateUniversityDto } from "../types/university.types";

export class UniversitiesApi {
  static async getAll(): Promise<University[]> {
    const { data } = await axiosInstance.get<University[]>(
      ENDPOINTS.UNIVERSITIES.BASE
    );
    return data;
  }

  static async getById(id: number): Promise<University> {
    const { data } = await axiosInstance.get<University>(
      `${ENDPOINTS.UNIVERSITIES.BASE}/${id}`
    );
    return data;
  }

  static async create(
    university: CreateUniversityDto | CreateUniversityDto[]
  ): Promise<University | University[]> {
    const { data } = await axiosInstance.post<University | University[]>(
      ENDPOINTS.UNIVERSITIES.BASE,
      university
    );
    return data;
  }

  static async update(
    id: number,
    university: Partial<CreateUniversityDto>
  ): Promise<University> {
    const { data } = await axiosInstance.patch<University>(
      `${ENDPOINTS.UNIVERSITIES.BASE}/${id}`,
      university
    );
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.UNIVERSITIES.BASE}/${id}`);
  }
}
