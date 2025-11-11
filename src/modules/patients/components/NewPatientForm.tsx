"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientsApi } from "../services/patients.api";
import { CreatePatientDto } from "../types/patient.types";

interface NewPatientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  patient?: import("../types/patient.types").Patient;
}

export function NewPatientForm({ onSuccess, onCancel, patient }: NewPatientFormProps) {
  const [formData, setFormData] = useState<CreatePatientDto>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    direccion: "",
    email: "",
    edad: undefined,
    telefono: "",
    ocupacion: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreatePatientDto, value: string | number | undefined) => {
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

      // Ensure edad is a number if provided
      const payload: CreatePatientDto = {
        ...formData,
        edad: formData.edad ? Number(formData.edad) : undefined,
      };

      if (patient) {
        await PatientsApi.update(patient.id, payload);
      } else {
        await PatientsApi.create(payload);
      }
      onSuccess();
    } catch (err) {
      setError("Error al crear el paciente");
      console.error("Error creating patient:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patient) {
      setFormData({
        nombre: patient.nombre || "",
        apellidoPaterno: patient.apellidoPaterno || "",
        apellidoMaterno: patient.apellidoMaterno || "",
        direccion: patient.direccion || "",
        email: patient.email || "",
        edad: patient.edad,
        telefono: patient.telefono || "",
        ocupacion: patient.ocupacion || "",
      });
    }
  }, [patient]);

  const handleDelete = async () => {
    if (!patient) return;
    const ok = confirm("¿Estás seguro que deseas eliminar este paciente?");
    if (!ok) return;
    setIsLoading(true);
    try {
      await PatientsApi.delete(patient.id);
      onSuccess();
    } catch (err) {
      setError("Error al eliminar el paciente");
      console.error("Error deleting patient:", err);
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
          <Label htmlFor="edad">Edad</Label>
          <Input
            id="edad"
            type="number"
            value={formData.edad ?? ""}
            onChange={(e) => handleInputChange("edad", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Edad"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
            placeholder="Dirección"
          />
        </div>

        <div className="space-y-2">
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
          <Label htmlFor="ocupacion">Ocupación</Label>
          <Input
            id="ocupacion"
            value={formData.ocupacion}
            onChange={(e) => handleInputChange("ocupacion", e.target.value)}
            placeholder="Ocupación"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-between items-center pt-4">
        <div>
          {patient && (
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
            {isLoading ? "Guardando..." : patient ? "Guardar cambios" : "Guardar Paciente"}
          </Button>
        </div>
      </div>
    </form>
  );
}
