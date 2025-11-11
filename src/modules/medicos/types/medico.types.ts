export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface Medico extends BaseEntity {
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  especialidad?: string;
  email: string;
  telefono?: string;
  consultorio?: string;
  usuario?: { id: number; email: string };
}

export interface CreateMedicoDto {
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  especialidad?: string;
  email: string;
  telefono?: string;
  consultorio?: string;
  usuarioId?: number;
}
