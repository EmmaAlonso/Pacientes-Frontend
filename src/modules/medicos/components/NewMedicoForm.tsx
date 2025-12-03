// frontend/src/modules/medicos/components/NewMedicoForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MedicosApi } from "../services/medicos.api";
import { UsuariosApi } from "@/modules/usuarios/services/usuarios.api";
import { CreateMedicoDto } from "../types/medico.types";
import { toast } from "sonner";

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
    telefono: "",
    consultorio: "",
    usuarioId: undefined,
  });

  // Email ahora es independiente (porque pertenece al usuario, no al médico)
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre || "",
        apellidoPaterno: medico.apellidoPaterno || "",
        apellidoMaterno: medico.apellidoMaterno || "",
        especialidad: medico.especialidad || "",
        telefono: medico.telefono || "",
        consultorio: medico.consultorio || "",
        usuarioId: medico.usuario?.id,
      });

      // El email viene del usuario, no del médico
      setEmail(medico.usuario?.email || "");
      setPassword("");
    }
  }, [medico]);

  const handleInputChange = (field: keyof CreateMedicoDto, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.nombre || !email) {
        setError("Nombre y correo son obligatorios");
        setIsLoading(false);
        return;
      }

      // === EDITAR MÉDICO ===
      if (medico) {
        if (medico.usuario?.id) {
          const needUpdateUser = email !== medico.usuario.email || password.trim() !== "";
          if (needUpdateUser) {
            const updatePayload: any = {};
            if (email !== medico.usuario.email) updatePayload.email = email;
            if (password.trim()) updatePayload.password = password.trim();

            try {
              await UsuariosApi.update(medico.usuario.id, updatePayload);
            } catch (err) {
              console.error("Error update usuario:", err);
              setError("Error al actualizar credenciales del usuario");
              setIsLoading(false);
              return;
            }
          }
        }

        await MedicosApi.update(medico.id, formData);
        toast.success("Médico actualizado");
        onSuccess();
        return;
      }

      // === CREAR NUEVO MÉDICO ===
      const userPayload = {
        nombre: formData.nombre,
        email: email,
        password: password || Math.random().toString(36).slice(2, 10),
        rol: "MEDICO",
      };

      const createdUser = await UsuariosApi.create(userPayload);

      const medicoPayload: CreateMedicoDto = {
        ...formData,
        usuarioId: createdUser.id,
      };

      await MedicosApi.create(medicoPayload);
      toast.success("Médico creado correctamente");
      onSuccess();
    } catch (err) {
      console.error("Error procesando médico:", err);
      setError("Error al procesar el médico");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!medico) return;
    if (!confirm("¿Estás seguro que deseas eliminar este médico?")) return;

    setIsLoading(true);
    try {
      await MedicosApi.delete(medico.id);
      toast.success("Médico eliminado");
      onSuccess();
    } catch (err) {
      console.error("Error eliminando médico:", err);
      setError("Error al eliminar el médico");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input id="nombre" value={formData.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidoPaterno">Apellido Paterno</Label>
          <Input id="apellidoPaterno" value={formData.apellidoPaterno} onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidoMaterno">Apellido Materno</Label>
          <Input id="apellidoMaterno" value={formData.apellidoMaterno} onChange={(e) => handleInputChange("apellidoMaterno", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input id="especialidad" value={formData.especialidad} onChange={(e) => handleInputChange("especialidad", e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" value={formData.telefono} onChange={(e) => handleInputChange("telefono", e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="consultorio">Consultorio</Label>
          <Input id="consultorio" value={formData.consultorio} onChange={(e) => handleInputChange("consultorio", e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="password">{medico ? "Cambiar contraseña (opcional)" : "Contraseña *"}</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={medico ? "Dejar en blanco para no cambiar" : "Contraseña del médico"} required={!medico} />
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
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Procesando..." : medico ? "Guardar cambios" : "Crear médico"}
          </Button>
        </div>
      </div>
    </form>
  );
}
