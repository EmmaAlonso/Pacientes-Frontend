"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Eye, Edit, Trash2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Cita } from "@/modules/citas/types/cita.types";
import { Patient } from "@/modules/patients/types/patient.types";
import { Medico } from "@/modules/medicos/types/medico.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewCitaForm } from "@/modules/citas/components/NewCitaForm";

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // create / edit / view dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<Cita | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      // debug: show full urls being requested
      // eslint-disable-next-line no-console
      console.debug("Requesting:", {
        citas: `${CitasApi ? "using CitasApi.getAll()" : ""}`,
        patients: `${"GET " + (typeof window !== "undefined" ? window.location.origin : "") + " -> patients endpoint"}`,
      });

      // fetch citas and patients so we can show patient names even if relation is missing
      const [data, p, m] = await Promise.all([CitasApi.getAll(), CitasApi.getPatients(), CitasApi.getMedicos()]);
      setCitas(data);
      setPatients(p || []);
      setMedicos(m || []);
    } catch (err: any) {
      // detailed logging for debug
      try {
        // eslint-disable-next-line no-console
        console.groupCollapsed("Citas fetch debug info");
        // eslint-disable-next-line no-console
        console.error("error.message:", err?.message);
        // eslint-disable-next-line no-console
        console.error("error.code:", err?.code);
        // eslint-disable-next-line no-console
        console.error("error.response:", err?.response);
        // eslint-disable-next-line no-console
        console.error("error.request:", err?.request);
        // eslint-disable-next-line no-console
        console.groupEnd();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error logging error details", e);
      }

      // perform a raw fetch to capture HTTP status/body (bypass axios)
      (async () => {
        try {
          const endpoints = await import("@/lib/endpoints");
          const base = endpoints.ENDPOINTS.BASE_URL;
          const url = `${base}${endpoints.ENDPOINTS.CITAS.BASE}`;
          // eslint-disable-next-line no-console
          console.debug("Diagnostic fetch to:", url);
          const r = await fetch(url, { method: "GET", credentials: "include", headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined } as any });
          // eslint-disable-next-line no-console
          const text = await r.text().catch(() => "<no body>");
          // eslint-disable-next-line no-console
          console.debug("Diagnostic fetch status:", r.status, text);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error("Diagnostic fetch failed:", e);
        }
      })();

      const msg = err?.response?.data?.message || err?.message || "Error al cargar las citas";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (c: Cita) => {
    const patientsMap = new Map(patients.map((p) => [p.id, p]));
    // try several possible id fields that backend might return
    const maybePid = (c as any).pacienteId ?? (c as any).patientId ?? c.paciente?.id ?? (c as any).paciente_id ?? (c as any).patient_id;
  let p: Patient | undefined = (c as any).paciente ?? (maybePid ? patientsMap.get(Number(maybePid)) : undefined);

    // also try if cita stores paciente as { usuario: { id } } or similar
    if (!p && (c as any).paciente && (c as any).paciente.usuario && (c as any).paciente.usuario.id) {
      p = patientsMap.get((c as any).paciente.usuario.id);
    }

    if (p) return `${p.nombre} ${p.apellidoPaterno || ''}${p.apellidoPaterno && p.apellidoMaterno ? ' ' : ''}${p.apellidoMaterno || ''}`;

    // try to display any available email or ids as debug-friendly fallback
    const maybeEmail = c.paciente?.email ?? (c as any).pacienteEmail ?? (c as any).paciente_email ?? (c as any).patientEmail ?? (c as any).patient_email;
    if (maybeEmail) return maybeEmail;

    const fallbackId = maybePid ?? c.paciente?.id ?? (c as any).id ?? (c as any).patientId;
    return fallbackId ? `Paciente id: ${fallbackId}` : "-";
  };

  const getMedicoName = (c: Cita) => {
    const medicosMap = new Map(medicos.map((m) => [m.id, m]));
    const maybeMid = (c as any).medicoId ?? (c as any).doctorId ?? c.medico?.id ?? (c as any).medico_id ?? (c as any).doctor_id;
    let m: Medico | undefined = (c as any).medico ?? (maybeMid ? medicosMap.get(Number(maybeMid)) : undefined);

    if (!m && (c as any).medico && (c as any).medico.usuario && (c as any).medico.usuario.id) {
      m = medicosMap.get((c as any).medico.usuario.id);
    }

    if (m) return `${m.nombre} ${m.apellidoPaterno || ''}${m.apellidoPaterno && m.apellidoMaterno ? ' ' : ''}${m.apellidoMaterno || ''}`;

    const maybeEmail = c.medico?.email ?? (c as any).medicoEmail ?? (c as any).medico_email;
    if (maybeEmail) return maybeEmail;

    const fallbackId = maybeMid ?? c.medico?.id ?? (c as any).id ?? (c as any).medicoId;
    return fallbackId ? `Médico id: ${fallbackId}` : "-";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      setIsDeleting(id);
      await CitasApi.delete(id);
      toast.success("Cita eliminada correctamente");
      fetchCitas();
    } catch {
      toast.error("Error al eliminar cita");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateOpen = () => {
    setSelected(null);
    setIsCreateOpen(true);
  };

  const handleEdit = (c: Cita) => { setSelected(c); setIsEditOpen(true); };

  const onSuccess = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setSelected(null);
    fetchCitas();
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
          <h1 className="text-2xl font-bold">Gestión de Citas</h1>

          {/* 🔹 Contador al lado del título */}
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl px-3 py-1">
            <CalendarDays className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-700 font-semibold">
              {citas.length}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {citas.length === 1 ? "cita" : "citas"}
            </span>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateOpen} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Nueva Cita</DialogTitle></DialogHeader>
            <NewCitaForm onSuccess={onSuccess} onCancel={() => setIsCreateOpen(false)} cita={selected ?? undefined} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de citas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          {citas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay citas registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Paciente</th>
        <th className="px-4 py-2 text-left">Médico</th>
        <th className="px-4 py-2 text-left">Motivo</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">
                        {getPatientName(c)}
                      </td>
                      <td className="px-4 py-2">{getMedicoName(c)}</td>
                      <td className="px-4 py-2">
                        {new Date(
                          c.fechaCita || c.fechaDeseada
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{c.motivo}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Link href={`/admin/citas/${c.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" /> Ver
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
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
      <Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setSelected(null); } }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Editar Cita</DialogTitle></DialogHeader>
          {selected && (
            <NewCitaForm
              cita={selected}
              onSuccess={onSuccess}
              onCancel={() => { setIsEditOpen(false); setSelected(null); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
