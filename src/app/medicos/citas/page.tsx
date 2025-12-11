"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type TokenPayload = {
  sub?: number;
  medicoId?: number;
  rol?: string;
  [k: string]: any;
};

type Paciente = {
  id: number;
  nombre: string;
  edad?: number;
  telefono?: string;
  correo?: string;
};

type Cita = {
  id: number;
  fechaDeseada?: string | null;
  fechaCita?: string | null;
  patient: Paciente | { id: number; nombre?: string };
  medico: { id: number; nombre?: string };
  especialidad?: string;
  motivo?: string;
  consultorio?: string;
  telefono?: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export default function MedicosCitasPage() {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Paciente[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);

  const [form, setForm] = useState({
    patientId: 0,
    fechaDeseada: "",
    fechaCita: "",
    especialidad: "",
    motivo: "",
    consultorio: "",
    telefono: "",
  });

  // token + medicoId
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const payload: TokenPayload | null = token ? (() => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  })() : null;

  const medicoId = payload?.medicoId ?? payload?.sub ?? null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchPatients();
    fetchCitas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all citas and filter by medico
  const fetchCitas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/citas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error fetching citas:", res.status);
        setCitas([]);
        return;
      }
      const data: Cita[] = await res.json();

      // Filtrar por medico autenticado (si viene la relación medico.id)
      const filtered = Array.isArray(data)
        ? data.filter((c) => {
            const mid = c.medico?.id ?? (c as any).medicoId ?? null;
            return medicoId ? Number(mid) === Number(medicoId) : true;
          })
        : [];

      setCitas(filtered);
    } catch (err) {
      console.error("Error al cargar citas:", err);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients of the medico (for select)
  const fetchPatients = async () => {
    try {
      // Intentamos /api/patients/mine primero (si lo tienes)
      const res = await fetch(`${API}/api/patients/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // si devuelve un único paciente, convertir a array si es necesario
        if (Array.isArray(data)) setPatients(data);
        else if (data) setPatients([data] as Paciente[]);
        return;
      }

      // Fallback: obtener todos y filtrar por medicoId si es posible
      const res2 = await fetch(`${API}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res2.ok) {
        setPatients([]);
        return;
      }
      const all = await res2.json();
      if (Array.isArray(all)) {
        const ours = medicoId ? all.filter((p: any) => p.medicoId && Number(p.medicoId) === Number(medicoId)) : all;
        setPatients(ours);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
      setPatients([]);
    }
  };

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.patientId) {
      alert("Selecciona un paciente");
      return;
    }

    try {
      const body = {
        patientId: Number(form.patientId),
        medicoId: Number(medicoId),
        fechaDeseada: form.fechaDeseada || undefined,
        fechaCita: form.fechaCita || undefined,
        especialidad: form.especialidad || undefined,
        motivo: form.motivo || undefined,
        consultorio: form.consultorio || undefined,
        telefono: form.telefono || undefined,
      };

      const res = await fetch(`${API}/citas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setOpenCreate(false);
        setForm({
          patientId: 0,
          fechaDeseada: "",
          fechaCita: "",
          especialidad: "",
          motivo: "",
          consultorio: "",
          telefono: "",
        });
        await fetchCitas();
        alert("Cita creada correctamente");
      } else {
        // Mostrar mensaje de error más amigable
        const text = await res.text();
        console.error("Error crear cita:", res.status, text);
        if (res.status === 403) {
          alert("No autorizado para crear citas. (Backend: POST /citas no permite MEDICO). Revisa el controller.");
        } else {
          // intentar parsear json
          try {
            const json = JSON.parse(text);
            alert(`Error: ${json.message || text}`);
          } catch {
            alert(`Error al crear cita: ${res.status}`);
          }
        }
      }
    } catch (err) {
      console.error("Error al crear cita:", err);
      alert("Error de red al crear cita");
    }
  };

  // VIEW
  const handleView = (cita: Cita) => {
    setSelectedCita(cita);
    setOpenView(true);
  };

  // EDIT: abre modal y precarga
  const handleOpenEdit = (cita: Cita) => {
    setSelectedCita(cita);
    setForm({
      patientId: (cita.patient as any).id ?? 0,
      fechaDeseada: cita.fechaDeseada ? cita.fechaDeseada.split(".")[0] : "",
      fechaCita: cita.fechaCita ? cita.fechaCita.split(".")[0] : "",
      especialidad: cita.especialidad ?? "",
      motivo: cita.motivo ?? "",
      consultorio: cita.consultorio ?? "",
      telefono: cita.telefono ?? "",
    });
    setOpenEdit(true);
  };

  // SUBMIT EDIT
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCita) return;

    try {
      const body: any = {
        patientId: Number(form.patientId),
        fechaDeseada: form.fechaDeseada || undefined,
        fechaCita: form.fechaCita || undefined,
        especialidad: form.especialidad || undefined,
        motivo: form.motivo || undefined,
        consultorio: form.consultorio || undefined,
        telefono: form.telefono || undefined,
      };

      const res = await fetch(`${API}/citas/${selectedCita.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setOpenEdit(false);
        setSelectedCita(null);
        await fetchCitas();
        alert("Cita actualizada");
      } else {
        const text = await res.text();
        console.error("Error actualizar cita:", res.status, text);
        alert("Error al actualizar cita");
      }
    } catch (err) {
      console.error("Error al actualizar cita:", err);
      alert("Error de red al actualizar cita");
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    try {
      const res = await fetch(`${API}/citas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchCitas();
        alert("Cita eliminada");
      } else {
        const text = await res.text();
        console.error("Error eliminar cita:", res.status, text);
        if (res.status === 403) {
          alert("No autorizado para eliminar citas (solo ADMIN).");
        } else {
          alert("Error al eliminar cita");
        }
      }
    } catch (err) {
      console.error("Error al eliminar cita:", err);
      alert("Error de red al eliminar cita");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mis Citas</h1>
          <p className="text-sm text-slate-600">Gestsiona tus citas</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:opacity-90">Nueva Cita</Button>
            </DialogTrigger>
            <DialogContent className="w-[520px]">
              <DialogHeader>
                <DialogTitle>Crear nueva cita</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Paciente</Label>
                  <Select value={String(form.patientId || "")} onValueChange={(val) => setForm({ ...form, patientId: Number(val) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length === 0 && <SelectItem value="">No hay pacientes</SelectItem>}
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.nombre} {p.edad ? `· ${p.edad} años` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Fecha deseada</Label>
                    <Input type="datetime-local" value={form.fechaDeseada} onChange={(e) => setForm({ ...form, fechaDeseada: e.target.value })} />
                  </div>
                  <div>
                    <Label>Fecha oficial (si ya está programada)</Label>
                    <Input type="datetime-local" value={form.fechaCita} onChange={(e) => setForm({ ...form, fechaCita: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label>Motivo</Label>
                  <Textarea value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Especialidad</Label>
                    <Input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
                  </div>
                  <div>
                    <Label>Consultorio / Teléfono</Label>
                    <Input value={form.consultorio} onChange={(e) => setForm({ ...form, consultorio: e.target.value })} />
                    <Input className="mt-2" placeholder="Teléfono (opcional)" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
                  </div>
                </div>

                <DialogFooter>
                  <div className="flex gap-2 justify-end w-full">
                    <Button type="button" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                    <Button type="submit" className="bg-black text-white">Crear</Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <p>Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas programadas.</p>
      ) : (
        <div className="grid gap-4">
          {citas.map((c) => (
            <div key={c.id} className="p-4 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{(c.patient as any)?.nombre ?? `Paciente #${(c.patient as any)?.id ?? ""}`}</p>
                <p className="text-sm text-slate-600">{c.motivo ?? "Sin motivo"}</p>
                <p className="text-xs text-slate-500">
                  Deseada: {c.fechaDeseada ? new Date(c.fechaDeseada).toLocaleString() : "-"} · Programada: {c.fechaCita ? new Date(c.fechaCita).toLocaleString() : "-"}
                </p>
              </div>

              <div className="flex gap-2 mt-3 md:mt-0">
                <Button onClick={() => handleView(c)} className="bg-gray-100 text-slate-800">Ver</Button>
                <Button onClick={() => handleOpenEdit(c)} className="bg-black text-white">Editar</Button>
                <Button onClick={() => handleDelete(c.id)} className="bg-red-600 text-white">Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW Modal */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="w-[520px]">
          <DialogHeader>
            <DialogTitle>Detalle de la cita</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 p-2">
            {selectedCita ? (
              <>
                <p className="font-semibold">{(selectedCita.patient as any)?.nombre}</p>
                <p>Motivo: {selectedCita.motivo ?? "-"}</p>
                <p>Especialidad: {selectedCita.especialidad ?? "-"}</p>
                <p>Consultorio: {selectedCita.consultorio ?? "-"}</p>
                <p>Teléfono: {selectedCita.telefono ?? "-"}</p>
                <p>Fecha deseada: {selectedCita.fechaDeseada ? new Date(selectedCita.fechaDeseada).toLocaleString() : "-"}</p>
                <p>Fecha cita: {selectedCita.fechaCita ? new Date(selectedCita.fechaCita).toLocaleString() : "-"}</p>
                <p>Estado: {selectedCita.estado ?? "-"}</p>
              </>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
          <DialogFooter>
            <div className="flex justify-end">
              <Button onClick={() => setOpenView(false)}>Cerrar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="w-[520px]">
          <DialogHeader>
            <DialogTitle>Editar cita</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Paciente</Label>
              <Select value={String(form.patientId || "")} onValueChange={(val) => setForm({ ...form, patientId: Number(val) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fecha deseada</Label>
                <Input type="datetime-local" value={form.fechaDeseada} onChange={(e) => setForm({ ...form, fechaDeseada: e.target.value })} />
              </div>
              <div>
                <Label>Fecha cita</Label>
                <Input type="datetime-local" value={form.fechaCita} onChange={(e) => setForm({ ...form, fechaCita: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Motivo</Label>
              <Textarea value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
            </div>

            <DialogFooter>
              <div className="flex gap-2 justify-end w-full">
                <Button type="button" onClick={() => setOpenEdit(false)}>Cancelar</Button>
                <Button type="submit" className="bg-black text-white">Guardar</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
