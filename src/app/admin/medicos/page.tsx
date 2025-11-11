"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MedicosApi } from "@/modules/medicos/services/medicos.api";
import { Medico } from "@/modules/medicos/types/medico.types";

export default function AdminMedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await MedicosApi.getAll();
      setMedicos(data);
    } catch (error) {
      toast.error("Error al cargar los médicos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este médico?")) return;
    try {
      setIsDeleting(id);
      await MedicosApi.delete(id);
      toast.success("Médico eliminado correctamente");
      fetchMedicos();
    } catch (error) {
      toast.error("Error al eliminar médico");
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
        <h1 className="text-2xl font-bold">Gestión de Médicos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Médico
        </Button>
      </div>

      {/* Estadísticas */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle>Total de médicos registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-green-600">{medicos.length}</p>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Médicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Especialidad</th>
                  <th className="px-4 py-2 text-left">Correo</th>
                  <th className="px-4 py-2 text-left">Teléfono</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {medicos.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{m.id}</td>
                    <td className="px-4 py-2">{m.nombre} {(m.apellidoPaterno || '') + (m.apellidoPaterno && m.apellidoMaterno ? ' ' : '') + (m.apellidoMaterno || '')}</td>
                    <td className="px-4 py-2">{m.especialidad}</td>
                    <td className="px-4 py-2">{m.email}</td>
                    <td className="px-4 py-2">{m.telefono}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/admin/medicos/${m.id}`}>
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
                        onClick={() => handleDelete(m.id)}
                        disabled={isDeleting === m.id}
                      >
                        {isDeleting === m.id ? (
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
