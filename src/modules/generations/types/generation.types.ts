export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface GenerationEvent {
  id: number;
  name: string;
  date: string;
  status: "completed" | "pending" | "upcoming";
}

export interface Generation extends BaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  totalStudents: number;
  completedStudents: number;
  status: "active" | "completed" | "upcoming";
  events: GenerationEvent[];
}

export interface CreateGenerationDto {
  name: string;
  startDate: string;
  endDate: string;
}

export type UpdateGenerationDto = Partial<CreateGenerationDto>;
