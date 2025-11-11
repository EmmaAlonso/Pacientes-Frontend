export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
}

export interface University {
  id: number;
  nombre: string;
}

export interface Student {
  id: number;
  nombre: string;
}

export interface Package extends BaseEntity {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_meses: number;
  activo: boolean;
  usuario: User;
  universidad: University;
  student: Student;
}

export interface CreatePackageDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_meses: number;
  activo?: boolean;
  usuarioId: number;
  universidadId: number;
  studentId: number;
}

export type UpdatePackageDto = Partial<CreatePackageDto>;
