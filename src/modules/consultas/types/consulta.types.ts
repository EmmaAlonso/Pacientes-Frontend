import { BaseEntity } from "@/modules/medicos/types/medico.types";
import { Patient } from "@/modules/patients/types/patient.types";
import { Medico } from "@/modules/medicos/types/medico.types";
import { Cita } from "@/modules/citas/types/cita.types";

export interface Consulta extends BaseEntity {
  fecha: string;
  paciente: Patient;
  medico: Medico;
  cita?: Cita;
  motivo: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
}

export interface CreateConsultaDto {
  fecha: string;
  pacienteId: number;
  medicoId: number;
  citaId?: number;
  motivo: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'CANCELADA';
}