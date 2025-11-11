import { ENDPOINTS } from "@/lib/endpoints";
import { Generation, CreateGenerationDto } from "../types/generation.types";
import { axiosInstance } from "@/lib/axios/config";

export class GenerationsApi {
  static async getAll(): Promise<Generation[]> {
    const { data } = await axiosInstance.get(ENDPOINTS.GENERATIONS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Generation> {
    const { data } = await axiosInstance.get(
      `${ENDPOINTS.GENERATIONS.BASE}/${id}`
    );
    return data;
  }

  static async create(generation: CreateGenerationDto): Promise<Generation> {
    const { data } = await axiosInstance.post(
      ENDPOINTS.GENERATIONS.BASE,
      generation
    );
    return data;
  }

  static async update(
    id: number,
    generation: Partial<CreateGenerationDto>
  ): Promise<Generation> {
    const { data } = await axiosInstance.patch(
      `${ENDPOINTS.GENERATIONS.BASE}/${id}`,
      generation
    );
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.GENERATIONS.BASE}/${id}`);
  }
}
