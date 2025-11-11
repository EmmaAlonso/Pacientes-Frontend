import { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

export type ApiError = AxiosError<ApiErrorResponse>;
