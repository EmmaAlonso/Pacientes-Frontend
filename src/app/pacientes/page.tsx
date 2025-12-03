"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowUpDown, Edit, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientsApi } from "@/modules/patients/services/patients.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Consulta } from "@/modules/consultas/types/consulta.types";
import { Cita } from "@/modules/citas/types/cita.types";
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function PacientesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos del paciente autenticado (si aplica)
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});

  // Datos clínicos
  const [citas, setCitas] = useState<Cita[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        if (user?.rol === "PACIENTE") {
          let me;
          try {
            me = await PatientsApi.getMyData();
          } catch (err: any) {
            // Si el backend no expone /patients/me, intentar fallback a GET /patients/:id usando el sub del JWT
            if (err?.response?.status === 404 && user?.sub) {
              console.warn("PatientsApi.getMyData returned 404 — falling back to PatientsApi.getById(user.sub)");
              me = await PatientsApi.getById(user.sub as number);
            } else {
              throw err;
            }
          }
          setPatient(me);
          setFormData(me);

          // Cargar citas y consultas y filtrar por paciente
          const allCitas = await CitasApi.getAll();
          setCitas(allCitas.filter((c) => c.paciente?.id === me.id));

          const allConsultas = await ConsultasApi.getAll();
          setConsultas(allConsultas.filter((c) => c.paciente?.id === me.id));
        }
      } catch (err) {
        console.error("Error al cargar datos del paciente:", err);
        setError("No se pudieron cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleInputChange = (field: keyof Patient, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!patient) return;
    try {
      await PatientsApi.update(patient.id, formData as any);
      const updated = await PatientsApi.getById(patient.id);
      setPatient(updated);
      setIsEditing(false);
      toast.success("Perfil actualizado");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los cambios");
    }
  };

  if (user?.rol === "PACIENTE") {
    return (
      <main className="container mx-auto px-4 py-6">
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.nombre}`} />
              <AvatarFallback>{(patient?.nombre?.charAt(0) || "P").toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{patient?.nombre} {patient?.apellidoPaterno}</h1>
              <p className="text-sm text-muted-foreground">{patient?.email}</p>
              <p className="text-sm text-muted-foreground">{patient?.telefono || "Sin teléfono"}</p>
            </div>
            <div className="ml-auto">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white">
                  <Edit className="w-4 h-4 mr-2" /> Editar perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-green-600 text-white">
                    <Save className="w-4 h-4 mr-2" /> Guardar
                  </Button>
                  <Button onClick={() => { setIsEditing(false); setFormData(patient || {}); }} variant="ghost">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Input value={formData.nombre || ""} onChange={(e) => handleInputChange("nombre", e.target.value)} />
                  <Input value={formData.apellidoPaterno || ""} onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)} />
                  <Input value={formData.telefono || ""} onChange={(e) => handleInputChange("telefono", e.target.value)} />
                  <Input value={formData.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} />
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {patient?.nombre} {patient?.apellidoPaterno}</p>
                  <p><strong>Email:</strong> {patient?.email}</p>
                  <p><strong>Teléfono:</strong> {patient?.telefono || "-"}</p>
                  <p><strong>Edad:</strong> {patient?.edad ?? "-"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mis Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent>
              {citas.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay citas programadas.</p>
              ) : (
                <ul className="space-y-2">
                  {citas.slice(0,5).map((c) => (
                    <li key={c.id} className="p-2 border rounded-md">
                      <div className="font-medium">{new Date(c.fechaCita || c.fechaDeseada).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{c.medico?.nombre}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mis Consultas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {consultas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay consultas.</p>
              ) : (
                <ul className="space-y-2">
                  {consultas.slice(0,5).map((c) => (
                    <li key={c.id} className="p-2 border rounded-md">
                      <div className="font-medium">{new Date(c.fecha).toLocaleDateString()}</div>
                      <div className="text-sm">{c.diagnostico || c.motivo}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial Médico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Aquí aparecerá tu historial médico (diagnósticos, tratamientos, alergias, etc.).</p>
              <div className="mt-4">
                <Button onClick={() => toast("Funcionalidad próximamente disponible")}>Agregar registro</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial Clínico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Registros clínicos y notas de consultas.</p>
              <div className="mt-4">
                <Button onClick={() => toast("Funcionalidad próximamente disponible")}>Agregar nota clínica</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // Si no es paciente, mostramos el listado (admin/medico)
  return (
    <div className="space-y-6 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>

          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">La vista de listado está disponible para administradores.</p>
      </div>
    );
}

export default withRoleProtection(PacientesPage, ["ADMIN", "PACIENTE"]);
