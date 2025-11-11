import { BaseEntity } from "@/modules/medicos/types/medico.types";
import { Patient } from "@/modules/patients/types/patient.types";
import { Medico } from "@/modules/medicos/types/medico.types";

export interface Cita extends BaseEntity {
  fechaDeseada: string; // fecha solicitada por el paciente
  fechaCita: string; // fecha final con horario (ISO)
  paciente: Patient;
  medico: Medico;
  especialidad?: string;
  motivo?: string;
  consultorio?: string;
  telefono?: string;
}

export interface CreateCitaDto {
  fechaDeseada: string;
  fechaCita?: string;
  pacienteId: number;
  medicoId: number;
  especialidad?: string;
  motivo?: string;
  consultorio?: string;
  telefono?: string;
}
