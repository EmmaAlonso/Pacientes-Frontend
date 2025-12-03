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
    // Intenta /api/patients/me, luego /patients/me, luego fallback a /patients/:id
    try {
      const { data } = await axiosInstance.get<Patient>(`/api/patients/me`);
      return data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        try {
          const { data } = await axiosInstance.get<Patient>(`/patients/me`);
          return data;
        } catch (err2: any) {
          if (err2?.response?.status === 404) {
            // Fallback: usar JWT id si está disponible
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const id = payload.sub || payload.id;
                if (id) {
                  const { data } = await axiosInstance.get<Patient>(`/patients/${id}`);
                  return data;
                }
              } catch {}
            }
          }
          throw err2;
        }
      }
      throw err;
    }
  }
}
