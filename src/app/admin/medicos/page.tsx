"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MedicosApi } from "@/modules/medicos/services/medicos.api";
import { Medico } from "@/modules/medicos/types/medico.types";
import { NewMedicoForm } from "@/modules/medicos/components/NewMedicoForm";

export default function AdminMedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState<Medico | undefined>(
    undefined
  );
  const [openView, setOpenView] = useState(false);
  const [viewMedico, setViewMedico] = useState<Medico | null>(null);

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    try {
      setLoading(true);
      const data = await MedicosApi.getAll();
      setMedicos(data);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      toast.error("Error al eliminar médico");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchMedicos();
  };

  const handleEdit = (medico: Medico) => {
    setSelectedMedico(medico);
    setIsFormOpen(true);
  };

  const openNewMedicoForm = () => {
    setSelectedMedico(undefined);
    setIsFormOpen(true);
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
      {/* Encabezado con contador */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Gestión de Médicos</h1>
          {!loading && (
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
              {medicos.length} {medicos.length === 1 ? "registrado" : "registrados"}
            </span>
          )}
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={openNewMedicoForm}>
              <Plus className="w-4 h-4" />
              Nuevo Médico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMedico ? "Editar Médico" : "Nuevo Médico"}
              </DialogTitle>
            </DialogHeader>
            <NewMedicoForm
              onSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
              medico={selectedMedico}
            />
          </DialogContent>
        </Dialog>
      </div>

     
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
                    <td className="px-4 py-2">
                      {m.nombre}{" "}
                      {(m.apellidoPaterno || "") +
                        (m.apellidoPaterno && m.apellidoMaterno ? " " : "") +
                        (m.apellidoMaterno || "")}
                    </td>
                    <td className="px-4 py-2">{m.especialidad}</td>
                    <td className="px-4 py-2">{m.email || m.usuario?.email || "-"}</td>
                    <td className="px-4 py-2">{m.telefono}</td>
                    <td className="px-4 py-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setViewMedico(m); setOpenView(true); }}>
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(m)}
                      >
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
      {/* View Medico Modal */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Médico</DialogTitle>
          </DialogHeader>

              {viewMedico && (
            <div className="space-y-3 p-2">
              <p><strong>Nombre:</strong> {viewMedico.nombre} {(viewMedico.apellidoPaterno || '') + (viewMedico.apellidoPaterno && viewMedico.apellidoMaterno ? ' ' : '') + (viewMedico.apellidoMaterno || '')}</p>
              <p><strong>Especialidad:</strong> {viewMedico.especialidad || '-'}</p>
              <p><strong>Email:</strong> {viewMedico.email || viewMedico.usuario?.email || '-'}</p>
              <p><strong>Teléfono:</strong> {viewMedico.telefono || '-'}</p>
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setOpenView(false)}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
