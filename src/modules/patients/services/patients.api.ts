import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Patient, CreatePatientDto } from "../types/patient.types";

export class PatientsApi {
  static async getAll(): Promise<Patient[]> {
    const { data } = await axiosInstance.get<Patient[]>(ENDPOINTS.PATIENTS.BASE);
    return data;
  }

  static async getById(id: number): Promise<Patient> {
    const { data } = await axiosInstance.get<Patient>(`${ENDPOINTS.PATIENTS.BASE}/${id}`);
    return data;
  }

  static async create(patient: CreatePatientDto): Promise<Patient> {
    const { data } = await axiosInstance.post<Patient>(ENDPOINTS.PATIENTS.BASE, patient);
    return data;
  }

  static async update(id: number, patient: Partial<CreatePatientDto>): Promise<Patient> {
    const { data } = await axiosInstance.patch<Patient>(`${ENDPOINTS.PATIENTS.BASE}/${id}`, patient);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.PATIENTS.BASE}/${id}`);
  }

  static async getMyData(): Promise<Patient> {
    const { data } = await axiosInstance.get<Patient>(`${ENDPOINTS.PATIENTS.BASE}/me`);
    return data;
  }
}
