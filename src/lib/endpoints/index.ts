export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
  },
  
  PATIENTS: {
    BASE: "/patients",
    MINE: "/patients/mine",
    REGISTER: "/patients/register",
    SELECT: "/patients/select",
    ME: "/patients/me",
  },

  MEDICOS: {
    BASE: "/medicos",
    PUBLIC: "/medicos/public",
     ME: "/medicos/me",
  },
  CITAS: {
    BASE: "/citas",
  },
  
  NOTIFICATIONS: {
    BASE: "/notifications",
  },
  
  WORKSHOP: {
    BASE: "/workshop",
  },
  ATTACHMENTS: {
    BASE: "/attachments",
  },
  LOGS: {
    BASE: "/logs",
  },
  CONSULTAS: {
    BASE: "/consultas",
  },
} as const;
