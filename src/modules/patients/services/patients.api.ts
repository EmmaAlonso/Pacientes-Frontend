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

  // 🔵 MÉTODO CORRECTO PARA OBTENER LOS DATOS DEL PACIENTE LOGEADO
  static async getMyData(): Promise<Patient> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      throw new Error("No token found");
    }

    // Obtener payload del JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // El ID REAL del usuario SIEMPRE VIENE EN "sub"
    const id = payload.sub;

    if (!id) {
      throw new Error("Token inválido: no contiene sub");
    }

    // 🟢 Traer datos del paciente con su ID
    const { data } = await axiosInstance.get<Patient>("/patients/me");

    return data;
  }
}
