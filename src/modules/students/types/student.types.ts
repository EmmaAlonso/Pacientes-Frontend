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

export interface Career {
  id: number;
  nombre: string;
}

export interface Generation {
  id: number;
  nombre: string;
}

export interface Student extends BaseEntity {
  nombre: string;
  email: string;
  telefono?: string;
  usuario: User;
  universidad: University;
  carrera: Career;
  generacion: Generation;
}

export interface CreateStudentDto {
  nombre: string;
  email: string;
  telefono?: string;
  usuarioId: number;
  universidadId: number;
  carreraId: number;
  generacionId: number;
}
