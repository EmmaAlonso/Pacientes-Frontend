"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PatientsApi } from "@/modules/patients/services/patients.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AuthService } from "@/modules/auth/services/auth.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function PacienteDetallePage() {
  const params = useParams();
  const id = Number(params?.id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingAccess, setCreatingAccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (id) {
      PatientsApi.getById(id)
        .then((data) => setPatient(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!patient) {
    return <p className="text-center mt-10 text-gray-600">Paciente no encontrado.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Link href="/admin/pacientes">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Regresar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nombre:</strong> {patient.nombre} {(patient.apellidoPaterno || '') + (patient.apellidoPaterno && patient.apellidoMaterno ? ' ' : '') + (patient.apellidoMaterno || '')}</p>
          <p><strong>Edad:</strong> {patient.edad}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Teléfono:</strong> {patient.telefono}</p>
          <p><strong>Dirección:</strong> {patient.direccion}</p>
          {patient.usuario ? (
            <p><strong>Cuenta de usuario:</strong> ID {patient.usuario.id}</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Este paciente no tiene acceso al sistema. Puedes crear una contraseña para permitirle iniciar sesión.</p>
              <div className="flex gap-2 items-center">
                <Input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Button onClick={async () => {
                  if (!newPassword) { toast.error('Ingresa una contraseña'); return; }
                  setCreatingAccess(true);
                  try {
                    const signup = await AuthService.signup({ nombre: patient.nombre, email: patient.email, password: newPassword, rol: 'PACIENTE' });
                    await PatientsApi.update(patient.id, { usuario: { id: signup.user.id } } as any);
                    toast.success('Acceso creado y vinculado');
                    // refresh
                    const updated = await PatientsApi.getById(patient.id);
                    setPatient(updated);
                    setNewPassword('');
                  } catch (err: any) {
                    console.error('Error creando acceso:', err);
                    toast.error(err?.response?.data?.message || 'Error al crear acceso');
                  } finally {
                    setCreatingAccess(false);
                  }
                }} disabled={creatingAccess}>{creatingAccess ? 'Creando...' : 'Crear acceso'}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aquí se conectará con las otras tablas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 italic">
            (Próximamente: citas, consultas y médicos asociados.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
