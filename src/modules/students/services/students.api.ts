import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Student, CreateStudentDto } from "../types/student.types";

export class StudentsApi {
  static async getAll(): Promise<Student[]> {
    const { data } = await axiosInstance.get<Student[]>(
      ENDPOINTS.STUDENTS.BASE
    );
    return data;
  }

  static async getById(id: number): Promise<Student> {
    const { data } = await axiosInstance.get<Student>(
      `${ENDPOINTS.STUDENTS.BASE}/${id}`
    );
    return data;
  }

  static async create(student: CreateStudentDto): Promise<Student> {
    const { data } = await axiosInstance.post<Student>(
      ENDPOINTS.STUDENTS.BASE,
      student
    );
    return data;
  }

  static async update(
    id: number,
    student: Partial<CreateStudentDto>
  ): Promise<Student> {
    const { data } = await axiosInstance.patch<Student>(
      `${ENDPOINTS.STUDENTS.BASE}/${id}`,
      student
    );
    return data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${ENDPOINTS.STUDENTS.BASE}/${id}`);
  }
}
