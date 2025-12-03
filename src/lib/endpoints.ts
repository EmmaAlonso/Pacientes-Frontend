export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3005",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    BASE: "/usuarios",
  },
  PATIENTS: {
    BASE: "/patients",
    ME: "/patients/me",
  },
  MEDICOS: {
    BASE: "/medicos",
    ME: "/medicos/me",
  },
  CITAS: {
    BASE: "/citas",
  },
  CONSULTAS: {
    BASE: "/consultas",
  },
  UNIVERSITIES: {
    BASE: "/universities",
  },
  CAREERS: {
    BASE: "/careers",
  },
  STUDENTS: {
    BASE: "/students",
  },
  GENERATIONS: {
    BASE: "/generations",
  },
  PACKAGES: {
    BASE: "/packages",
  },
};
