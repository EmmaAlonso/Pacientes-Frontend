export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface Career extends BaseEntity {
  nombre: string;
  universidad: {
    id: number;
    nombre: string;
  };
  estudiantes: {
    id: number;
    nombre: string;
  }[];
  generaciones: {
    id: number;
    nombre: string;
  }[];
}

export interface CreateCareerDto {
  nombre: string;
  universidadId: number;
}
