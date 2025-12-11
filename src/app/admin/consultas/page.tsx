"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, Edit, Trash2, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { Medico } from "@/modules/medicos/types/medico.types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { Consulta } from "@/modules/consultas/types/consulta.types";

export default function AdminConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<Consulta | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      // debug: show which endpoints will be called
      console.debug("Requesting consultas and lookup lists via:", {
        consultas: "ConsultasApi.getAll()",
        patients: "CitasApi.getPatients()",
        medicos: "CitasApi.getMedicos()",
      });
      const [data, p, m] = await Promise.all([
        ConsultasApi.getAll(),
        CitasApi.getPatients(),
        CitasApi.getMedicos(),
      ]);
      setConsultas(data);
      setPatients(p || []);
      setMedicos(m || []);
    } catch (err: unknown) {
      // detailed error - try to extract axios-like fields and perform a quick fetch diagnostic
      // safer typing for error shape
      type AxiosLikeError = {
        message?: string;
        code?: string;
        response?: { data?: { message?: string } };
        request?: unknown;
      };
      const e = err as AxiosLikeError;
      console.error("Error fetching consultas:", e || "unknown");
      try {
        console.groupCollapsed("Consultas fetch debug info");
        console.error("error.message:", e?.message);
        console.error("error.code:", e?.code);
        console.error("error.response:", e?.response);
        console.error("error.request:", e?.request);
        console.groupEnd();
      } catch (loge) {
        console.error("Error logging error details", loge);
      }

      // perform a low-level fetch to see raw network result (bypasses axios interceptors)
      (async () => {
        try {
          const base = (await import("@/lib/endpoints")).ENDPOINTS.BASE_URL;
          const url = `${base}${
            (await import("@/lib/endpoints")).ENDPOINTS.CONSULTAS.BASE
          }`;
          console.debug("Diagnostic fetch to:", url);
          const token = (
            await import("@/lib/services/token.service")
          ).TokenService.getToken();
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };
          if (token) headers.Authorization = `Bearer ${token}`;
          const r = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers,
          });
          console.debug(
            "Diagnostic fetch status:",
            r.status,
            await r.text().catch(() => "<no body>")
          );
        } catch (diagErr) {
          console.error("Diagnostic fetch failed:", diagErr);
        }
      })();

      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al cargar las consultas";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (c: Consulta) => {
    const patientsMap = new Map(patients.map((p) => [p.id, p]));
    const raw = c as unknown as Record<string, unknown>;
    const maybePidRaw =
      raw["pacienteId"] ??
      raw["patientId"] ??
      c.paciente?.id ??
      raw["paciente_id"] ??
      raw["patient_id"];
    const maybePid =
      typeof maybePidRaw === "number"
        ? maybePidRaw
        : typeof maybePidRaw === "string"
        ? maybePidRaw.trim() === ""
          ? undefined
          : Number(maybePidRaw)
        : undefined;
    const p =
      c.paciente ??
      (maybePid !== undefined && !Number.isNaN(maybePid)
        ? patientsMap.get(Number(maybePid))
        : undefined);
    if (p)
      return `${p.nombre} ${p.apellidoPaterno || ""}${
        p.apellidoPaterno && p.apellidoMaterno ? " " : ""
      }${p.apellidoMaterno || ""}`;
    const maybeEmail =
      c.paciente?.email ?? raw["pacienteEmail"] ?? raw["paciente_email"];
    if (maybeEmail) return String(maybeEmail);
    const fallbackId = maybePid ?? c.paciente?.id ?? raw["id"];
    return fallbackId ? `Paciente id: ${fallbackId}` : "-";
  };

  const getMedicoName = (c: Consulta) => {
    const medicosMap = new Map(medicos.map((m) => [m.id, m]));
    const raw = c as unknown as Record<string, unknown>;
    const maybeMidRaw =
      raw["medicoId"] ??
      raw["doctorId"] ??
      c.medico?.id ??
      raw["medico_id"] ??
      raw["doctor_id"];
    const maybeMid =
      typeof maybeMidRaw === "number"
        ? maybeMidRaw
        : typeof maybeMidRaw === "string"
        ? maybeMidRaw.trim() === ""
          ? undefined
          : Number(maybeMidRaw)
        : undefined;
    const m =
      c.medico ??
      (maybeMid !== undefined && !Number.isNaN(maybeMid)
        ? medicosMap.get(Number(maybeMid))
        : undefined);
    if (m)
      return `${m.nombre} ${m.apellidoPaterno || ""}${
        m.apellidoPaterno && m.apellidoMaterno ? " " : ""
      }${m.apellidoMaterno || ""}`;
    const maybeEmail =
      c.medico?.email ?? raw["medicoEmail"] ?? raw["medico_email"];
    if (maybeEmail) return String(maybeEmail);
    const fallbackId = maybeMid ?? c.medico?.id ?? raw["id"];
    return fallbackId ? `Médico id: ${fallbackId}` : "-";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta consulta?")) return;
    try {
      setIsDeleting(id);
      await ConsultasApi.delete(id);
      toast.success("Consulta eliminada correctamente");
      fetchConsultas();
    } catch {
      toast.error("Error al eliminar consulta");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleView = (c: Consulta) => {
    setSelected(c);
    setIsViewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Gestión de Consultas</h1>

          {/* 🔹 Contador de consultas */}
          <div className="flex items-center bg-green-50 border border-green-200 rounded-xl px-3 py-1">
            <Stethoscope className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-green-700 font-semibold">
              {consultas.length}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {consultas.length === 1 ? "consulta" : "consultas"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {consultas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay consultas registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Paciente</th>
                    <th className="px-4 py-2 text-left">Médico</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Motivo</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">{getPatientName(c)}</td>
                      <td className="px-4 py-2">{getMedicoName(c)}</td>
                      <td className="px-4 py-2">
                        {new Date(c.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{c.motivo}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            c.estado === "COMPLETADA"
                              ? "bg-green-100 text-green-800"
                              : c.estado === "EN_PROCESO"
                              ? "bg-blue-100 text-blue-800"
                              : c.estado === "PENDIENTE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(c)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                          disabled={isDeleting === c.id}
                        >
                          {isDeleting === c.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsViewOpen(false);
            setSelected(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalle de Consulta</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Paciente</h3>
                  <div className="text-sm mt-2">
                    <div>
                      <strong>Nombre:</strong> {selected.paciente?.nombre}{" "}
                      {selected.paciente?.apellidoPaterno}{" "}
                      {selected.paciente?.apellidoMaterno}
                    </div>
                    <div>
                      <strong>Email:</strong> {selected.paciente?.email || "-"}
                    </div>
                    <div>
                      <strong>Teléfono:</strong>{" "}
                      {selected.paciente?.telefono || "-"}
                    </div>
                    <div>
                      <strong>Edad:</strong> {selected.paciente?.edad ?? "-"}
                    </div>
                    <div>
                      <strong>Dirección:</strong>{" "}
                      {selected.paciente?.direccion || "-"}
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Consulta</h3>
                  <div className="text-sm mt-2">
                    <div>
                      <strong>Fecha:</strong>{" "}
                      {new Date(selected.fecha).toLocaleString()}
                    </div>
                    <div>
                      <strong>Motivo:</strong>{" "}
                      <div className="whitespace-pre-wrap">
                        {selected.motivo || "-"}
                      </div>
                    </div>
                    <div>
                      <strong>Diagnóstico:</strong>{" "}
                      <div className="whitespace-pre-wrap">
                        {selected.diagnostico || "-"}
                      </div>
                    </div>
                    <div>
                      <strong>Tratamiento:</strong>{" "}
                      <div className="whitespace-pre-wrap">
                        {selected.tratamiento || "-"}
                      </div>
                    </div>
                    <div>
                      <strong>Observaciones:</strong>{" "}
                      <div className="whitespace-pre-wrap">
                        {selected.observaciones || "-"}
                      </div>
                    </div>
                    <div>
                      <strong>Estado:</strong> {selected.estado}
                    </div>
                    {selected.cita && (
                      <div>
                        <strong>Cita asociada:</strong> {selected.cita.id}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewOpen(false);
                    setSelected(null);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
