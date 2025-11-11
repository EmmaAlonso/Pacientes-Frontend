export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface Career {
  id: number;
  nombre: string;
}

export interface Generation {
  id: number;
  nombre: string;
}

export interface Student {
  id: number;
  nombre: string;
}

export interface Package {
  id: number;
  nombre: string;
}

export interface University extends BaseEntity {
  nombre: string;
  careers?: Career[];
  generations?: Generation[];
  students?: Student[];
  packages?: Package[];
}

export interface CreateUniversityDto {
  nombre: string;
}

export interface UniversityStats {
  totalUniversities: number;
  totalCareers: number;
  totalGenerations: number;
  totalStudents: number;
  totalPackages: number;
}
