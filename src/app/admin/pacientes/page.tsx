"use client";

import { useEffect, useState } from "react";
import { PatientsApi } from "@/modules/patients/services/patients.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Eye, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminPacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Cargar todos los pacientes
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await PatientsApi.getAll();
      setPatients(data);
    } catch (error) {
      toast.error("Error al cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este paciente?")) return;
    try {
      setIsDeleting(id);
      await PatientsApi.delete(id);
      toast.success("Paciente eliminado correctamente");
      fetchPatients();
    } catch (error) {
      toast.error("Error al eliminar paciente");
    } finally {
      setIsDeleting(null);
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Pacientes</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Estadísticas */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle>Total de pacientes registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-blue-600">{patients.length}</p>
        </CardContent>
      </Card>

      {/* Tabla de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Edad</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Teléfono</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.nombre} {(p.apellidoPaterno || '') + (p.apellidoPaterno && p.apellidoMaterno ? ' ' : '') + (p.apellidoMaterno || '')}</td>
                    <td className="px-4 py-2">{p.edad}</td>
                    <td className="px-4 py-2">{p.email}</td>
                    <td className="px-4 py-2">{p.telefono}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/admin/pacientes/${p.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" /> Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting === p.id}
                      >
                        {isDeleting === p.id ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
