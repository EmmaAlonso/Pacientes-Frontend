export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface Patient extends BaseEntity {
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  direccion?: string;
  email: string;
  edad?: number;
  telefono?: string;
  ocupacion?: string;
}

export interface CreatePatientDto {
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  direccion?: string;
  email: string;
  edad?: number;
  telefono?: string;
  ocupacion?: string;
}
