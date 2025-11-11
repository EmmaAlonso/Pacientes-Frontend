"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Cita } from "@/modules/citas/types/cita.types";

export default function AdminCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const data = await CitasApi.getAll();
      setCitas(data);
    } catch {
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold">Gestión de Citas</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Cita
        </Button>
      </div>

      {/* Total */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle>Total de citas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-blue-600">{citas.length}</p>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Paciente</th>
                  <th className="px-4 py-2 text-left">Médico</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Motivo</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.paciente?.nombre} {(c.paciente?.apellidoPaterno || '') + (c.paciente?.apellidoPaterno && c.paciente?.apellidoMaterno ? ' ' : '') + (c.paciente?.apellidoMaterno || '')}</td>
                    <td className="px-4 py-2">{c.medico?.nombre} {(c.medico?.apellidoPaterno || '') + (c.medico?.apellidoPaterno && c.medico?.apellidoMaterno ? ' ' : '') + (c.medico?.apellidoMaterno || '')}</td>
                    <td className="px-4 py-2">{new Date(c.fechaCita || c.fechaDeseada).toLocaleString()}</td>
                    <td className="px-4 py-2">{c.motivo}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/admin/citas/${c.id}`}>
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
        </CardContent>
      </Card>
    </div>
  );
}
