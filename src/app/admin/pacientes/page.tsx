"use client";

import React, { useEffect, useState } from "react";
import { PatientsApi } from "@/modules/patients/services/patients.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { NewPatientForm } from "@/modules/patients/components/NewPatientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // 🔥 cargar pacientes
  const loadPatients = async () => {
    try {
      const data = await PatientsApi.getAll();
      setPatients(data);
    } catch (error) {
      toast.error("No se pudo cargar la lista de pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleCreate = () => {
    setEditingPatient(null);
    setOpenModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este paciente?")) return;

    try {
      await PatientsApi.delete(id);
      toast.success("Paciente eliminado");
      loadPatients();
    } catch (error) {
      toast.error("Error al eliminar el paciente");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} /> Nuevo Paciente
        </Button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p className="text-center py-4">Cargando...</p>
        ) : patients.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No hay pacientes registrados.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Nombre</th>
                <th className="p-2">Email</th>
                <th className="p-2">Edad</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                  </td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.edad ?? "-"}</td>
                  <td className="p-2">{p.telefono}</td>

                  <td className="p-2 flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(p)}>
                      <Pencil size={16} />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPatient ? "Editar Paciente" : "Nuevo Paciente"}
            </DialogTitle>
          </DialogHeader>

          <NewPatientForm
            patient={editingPatient || undefined}
            onCancel={() => setOpenModal(false)}
            onSuccess={() => {
              setOpenModal(false);
              loadPatients();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
