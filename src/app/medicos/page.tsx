"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, Activity, Stethoscope } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import { Medico } from "@/modules/medicos/types/medico.types";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { MedicosApi } from "@/modules/medicos/services/medicos.api";
import { Cita } from "@/modules/citas/types/cita.types";
import { Consulta } from "@/modules/consultas/types/consulta.types";
import { useAuth } from "@/contexts/AuthContext";


function MedicoDashboard() {
  const { user } = useAuth();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [proximasCitas, setProximasCitas] = useState<Cita[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [actividad, setActividad] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const medicoId = user?.id;
      if (!medicoId) throw new Error("No se encontró el ID del médico autenticado");

      const medicoLog = await MedicosApi.getById(medicoId);

      // 2️⃣ Cargar próximas citas del médico
      const todasCitas = await CitasApi.getAll();
      const citasMedico = todasCitas.filter((c: Cita) => c.medico?.id === medicoLog.id);
      const futuras = citasMedico
        .filter((c: Cita) => new Date(c.fechaCita || c.fechaDeseada) >= new Date())
        .sort((a: Cita, b: Cita) => new Date((a.fechaCita || a.fechaDeseada)).getTime() - new Date((b.fechaCita || b.fechaDeseada)).getTime())
        .slice(0, 5);
      setProximasCitas(futuras);

      // 3️⃣ Cargar últimas consultas del médico
      const todasConsultas = await ConsultasApi.getAll();
      const consultasMedico = todasConsultas.filter((c: Consulta) => c.medico?.id === medicoLog.id);
      const ultimas = consultasMedico
        .sort((a: Consulta, b: Consulta) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);
      setConsultas(ultimas);

      // 4️⃣ Simular actividad reciente
      const log: string[] = [
        "🩺 Nueva consulta registrada con el paciente Ana López",
        "📅 Se agendó una cita para el 28/10/2025",
        "👤 Se registró un nuevo paciente: Carlos Méndez",
        "📋 Actualizaste el diagnóstico de María Pérez",
      ];
      setActividad(log);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar el panel del médico");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!medico) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-600">
          No se pudo cargar la información del médico.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* PERFIL MÉDICO */}
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-100 border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-cyan-500">
                <AvatarImage src="/images/medico-avatar.png" alt={medico.nombre} />
                <AvatarFallback>{medico.nombre.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Dr. {medico.nombre} {medico.apellidoPaterno}
                </CardTitle>
                <p className="text-sm text-gray-700">{medico.especialidad || "Sin especialidad"}</p>
                <p className="text-xs text-gray-500">Consultorio {medico.consultorio || "-"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Correo:</p>
              <p className="text-sm text-gray-800">{medico.email}</p>
              <p className="text-sm text-gray-800">{medico.telefono || ""}</p>
            </div>
          </CardHeader>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Pacientes atendidos" value="32" icon={<Users className="text-blue-500" />} />
          <KpiCard title="Próximas citas" value={proximasCitas.length} icon={<Calendar className="text-green-500" />} />
          <KpiCard title="Consultas realizadas" value={consultas.length} icon={<Stethoscope className="text-rose-500" />} />
          <KpiCard title="Actividad reciente" value={actividad.length} icon={<Activity className="text-purple-500" />} />
        </div>

        {/* PRÓXIMAS CITAS */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Próximas citas</CardTitle>
          </CardHeader>
          <CardContent>
            {proximasCitas.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay citas próximas.</p>
            ) : (
              <ul className="space-y-2">
                {proximasCitas.map((c) => (
                  <li
                    key={c.id}
                    className="flex justify-between p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{c.paciente.nombre} {c.paciente.apellidoPaterno ?? ""} {c.paciente.apellidoMaterno ?? ""}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(c.fechaCita || c.fechaDeseada).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                      Confirmada
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ÚLTIMAS CONSULTAS */}
        <Card>
          <CardHeader>
            <CardTitle>🩺 Últimas consultas realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            {consultas.length === 0 ? (
              <p className="text-gray-500 text-sm">Aún no hay consultas registradas.</p>
            ) : (
              <ul className="space-y-2">
                {consultas.map((c) => (
                  <li key={c.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <p className="font-medium">
                      {c.paciente.nombre} {c.paciente.apellidoPaterno ?? ""} {c.paciente.apellidoMaterno ?? ""}
                    </p>
                    <p className="text-sm text-gray-600">{c.diagnostico}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.fecha).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* ACTIVIDAD RECIENTE */}
        <Card>
          <CardHeader>
            <CardTitle>🕒 Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {actividad.length === 0 ? (
              <p className="text-gray-500 text-sm">Sin actividad reciente.</p>
            ) : (
              <ul className="space-y-2">
                {actividad.map((a, i) => (
                  <li key={i} className="text-sm p-2 border rounded-md bg-gray-50">
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Tarjeta de KPI
function KpiCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default withRoleProtection(MedicoDashboard, ["MEDICO"]);
