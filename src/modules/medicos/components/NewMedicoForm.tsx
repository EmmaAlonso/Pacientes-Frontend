"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MedicosApi } from "../services/medicos.api";
import { CreateMedicoDto } from "../types/medico.types";

interface NewMedicoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  medico?: import("../types/medico.types").Medico;
}

export function NewMedicoForm({ onSuccess, onCancel, medico }: NewMedicoFormProps) {
  const [formData, setFormData] = useState<CreateMedicoDto>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    especialidad: "",
    email: "",
    telefono: "",
    consultorio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreateMedicoDto, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.nombre || !formData.email) {
        setError("Por favor completa los campos requeridos (nombre y email)");
        setIsLoading(false);
        return;
      }

      const payload: CreateMedicoDto = {
        ...formData,
      };

      if (medico) {
        await MedicosApi.update(medico.id, payload);
      } else {
        await MedicosApi.create(payload);
      }

      onSuccess();
    } catch (err) {
      setError("Error al procesar el médico");
      console.error("Error processing medico:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre || "",
        apellidoPaterno: medico.apellidoPaterno || "",
        apellidoMaterno: medico.apellidoMaterno || "",
        especialidad: medico.especialidad || "",
        email: medico.email || "",
        telefono: medico.telefono || "",
        consultorio: medico.consultorio || "",
      });
    }
  }, [medico]);

  const handleDelete = async () => {
    if (!medico) return;
    const ok = confirm("¿Estás seguro que deseas eliminar este médico?");
    if (!ok) return;
    setIsLoading(true);
    try {
      await MedicosApi.delete(medico.id);
      onSuccess();
    } catch (err) {
      setError("Error al eliminar el médico");
      console.error("Error deleting medico:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            placeholder="Nombre"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
          <Input
            id="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)}
            placeholder="Apellido Paterno"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
          <Input
            id="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={(e) => handleInputChange("apellidoMaterno", e.target.value)}
            placeholder="Apellido Materno"
          />

        </div>

        <div className="space-y-2">
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input
            id="especialidad"
            value={formData.especialidad}
            onChange={(e) => handleInputChange("especialidad", e.target.value)}
            placeholder="Especialidad"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Correo electrónico"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            placeholder="Teléfono"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="consultorio">Consultorio</Label>
          <Input
            id="consultorio"
            value={formData.consultorio}
            onChange={(e) => handleInputChange("consultorio", e.target.value)}
            placeholder="Consultorio"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-between items-center pt-4">
        <div>
          {medico && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Eliminar
            </Button>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : medico ? "Guardar cambios" : "Guardar Médico"}
          </Button>
        </div>
      </div>
    </form>
  );
}
