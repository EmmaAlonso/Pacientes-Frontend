"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { Consulta } from "@/modules/consultas/types/consulta.types";

export default function AdminConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const data = await ConsultasApi.getAll();
      setConsultas(data);
    } catch {
      toast.error("Error al cargar las consultas");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl font-bold">Gestión de Consultas</h1>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle>Total de consultas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-green-600">{consultas.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Consultas</CardTitle>
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
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.paciente?.nombre} {c.paciente?.apellidoPaterno} {c.paciente?.apellidoMaterno}</td>
                    <td className="px-4 py-2">{c.medico?.nombre} {c.medico?.apellidoPaterno} {c.medico?.apellidoMaterno}</td>
                    <td className="px-4 py-2">{new Date(c.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{c.motivo}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        c.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                        c.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
                        c.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/admin/consultas/${c.id}`}>
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
