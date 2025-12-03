export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
  },

  MEDICOS: {
    BASE: "/medicos",
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
