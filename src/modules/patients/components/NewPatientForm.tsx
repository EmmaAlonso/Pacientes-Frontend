"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientsApi } from "../services/patients.api";
import { CreatePatientDto } from "../types/patient.types";
import { AuthService } from "@/modules/auth/services/auth.service";
import { toast } from "sonner";

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

  const [password, setPassword] = useState(""); // 🔥 necesario para crear usuario
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createAccessPassword, setCreateAccessPassword] = useState("");
  const [isCreatingAccess, setIsCreatingAccess] = useState(false);

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

      if (!patient && !password) {
        setError("La contraseña es obligatoria para crear el acceso del paciente.");
        setIsLoading(false);
        return;
      }

      let usuarioId: string | undefined;

      // 🔥 si NO estamos editando, se crea primero el usuario
      if (!patient) {
        const signup = await AuthService.signup({
          nombre: formData.nombre,
          email: formData.email,
          password,
          rol: "PACIENTE",
        });

        usuarioId = signup.user.id;
      }

      const payload: CreatePatientDto = {
        ...formData,
        edad: formData.edad ? Number(formData.edad) : undefined,
        ...(usuarioId ? { usuario: { id: usuarioId } } : {}),
      };

      if (patient) {
        await PatientsApi.update(patient.id, payload);
        toast.success("Paciente actualizado");
      } else {
        await PatientsApi.create(payload);
        toast.success("Paciente creado y usuario generado");
      }

      onSuccess();
    } catch (err) {
      setError("Error al guardar el paciente");
      console.error("Error creating patient:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear acceso para paciente ya existente (usado por admin)
  const handleCreateAccess = async () => {
    if (!patient) return;
    if (!createAccessPassword) {
      setError("La contraseña es obligatoria para crear el acceso");
      return;
    }

    setIsCreatingAccess(true);
    setError(null);
    try {
      const signup = await AuthService.signup({
        nombre: formData.nombre || patient.nombre,
        email: formData.email || patient.email,
        password: createAccessPassword,
        rol: "PACIENTE",
      });

      // Vincular usuario al paciente
      await PatientsApi.update(patient.id, { usuario: { id: signup.user.id } } as any);

      toast.success("Acceso creado y vinculado al paciente");
      onSuccess();
    } catch (err: any) {
      console.error("Error creando acceso:", err);
      setError(err?.response?.data?.message || "Error al crear el acceso");
    } finally {
      setIsCreatingAccess(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        <div className="space-y-2">
          <Label>Nombre *</Label>
          <Input
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Apellido Paterno</Label>
          <Input
            value={formData.apellidoPaterno}
            onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Apellido Materno</Label>
          <Input
            value={formData.apellidoMaterno}
            onChange={(e) => handleInputChange("apellidoMaterno", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Edad</Label>
          <Input
            type="number"
            value={formData.edad ?? ""}
            onChange={(e) =>
              handleInputChange("edad", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Dirección</Label>
          <Input
            value={formData.direccion}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Teléfono</Label>
          <Input
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Ocupación</Label>
          <Input
            value={formData.ocupacion}
            onChange={(e) => handleInputChange("ocupacion", e.target.value)}
          />
        </div>
      </div>

      {/* 🔥 Campo SOLO para creación */}
      {!patient && (
        <div className="space-y-2">
          <Label>Contraseña del acceso *</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}

      {/* 🔥 Crear acceso para paciente existente (admin) */}
      {patient && !patient.usuario && (
        <div className="space-y-2">
          <Label>Crear acceso para este paciente</Label>
          <Input
            type="password"
            placeholder="Nueva contraseña para el paciente"
            value={createAccessPassword}
            onChange={(e) => setCreateAccessPassword(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="button" onClick={handleCreateAccess} disabled={isCreatingAccess}>
              {isCreatingAccess ? "Creando..." : "Crear acceso"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setCreateAccessPassword(""); setError(null); }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : patient ? "Guardar Cambios" : "Crear Paciente"}
        </Button>
      </div>
    </form>
  );
}
