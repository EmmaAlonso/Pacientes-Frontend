"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CitasApi } from "../services/citas.api";
import { CreateCitaDto } from "../types/cita.types";
import { showToast } from "@/components/ui/Toast";
import { ModalConfirm } from "@/components/ui/ModalConfirm";
import { Patient } from "@/modules/patients/types/patient.types";
import { Medico } from "@/modules/medicos/types/medico.types";

interface NewCitaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  cita?: import("../types/cita.types").Cita;
  isPaciente?: boolean;
}

export function NewCitaForm({
  onSuccess,
  onCancel,
  cita,
  isPaciente = false,
}: NewCitaFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null); // paciente logueado

  const [formData, setFormData] = useState<CreateCitaDto>({
    fechaDeseada: "",
    fechaCita: "",
    pacienteId: 0,
    medicoId: 0,
    especialidad: "",
    motivo: "",
    consultorio: "",
    telefono: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 🔹 Cargar médicos (y pacientes si aplica)
  useEffect(() => {
    (async () => {
      try {
        if (!isPaciente) {
          const p = await CitasApi.getPatients();
          setPatients(p);
        } else {
          const token = localStorage.getItem("token");
          if (token) {
            const user = await CitasApi.getCurrentUser();
            if (user) {
              setUserInfo(user);
              setFormData((prev) => ({ ...prev, pacienteId: user.id }));
            }
          }
        }

        const m = await CitasApi.getMedicos();
        setMedicos(m);
      } catch (err) {
        console.error("Error fetching data for cita form", err);
      }
    })();
  }, [isPaciente]);

  // 🔹 Si viene cita, rellenar datos
  useEffect(() => {
    if (cita) {
      setFormData({
        fechaDeseada: cita.fechaDeseada || "",
        fechaCita: cita.fechaCita || "",
        pacienteId: cita.paciente?.id || 0,
        medicoId: cita.medico?.id || 0,
        especialidad: cita.especialidad || "",
        motivo: cita.motivo || "",
        consultorio: cita.consultorio || "",
        telefono: cita.telefono || "",
      });
    }
  }, [cita]);

  const handleChange = (field: keyof CreateCitaDto, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.medicoId || (!formData.fechaDeseada && !formData.fechaCita)) {
        setError("Médico y fecha (fecha deseada o fecha/hora) son requeridos");
        setIsLoading(false);
        return;
      }

      if (cita) {
        await CitasApi.update(cita.id, formData);
        showToast("Cita actualizada", "success");
      } else {
        if (isPaciente) {
  await CitasApi.createMyAppointment(formData)
        } else {
          await CitasApi.create(formData);
        }
        showToast("Cita creada", "success");
      }

      onSuccess();
    } catch (err) {
      console.error("Error creating/updating cita", err);
      setError("Error al procesar la cita");
      showToast("Error al procesar la cita", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cita) return;
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!cita) return;
    setIsConfirmOpen(false);
    setIsLoading(true);
    try {
      await CitasApi.delete(cita.id);
      showToast("Cita eliminada", "success");
      onSuccess();
    } catch (err) {
      console.error("Error deleting cita", err);
      setError("Error al eliminar la cita");
      showToast("Error al eliminar la cita", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaDeseada">Fecha deseada *</Label>
          <Input
            id="fechaDeseada"
            type="date"
            value={formData.fechaDeseada.split("T")[0] || formData.fechaDeseada}
            onChange={(e) => handleChange("fechaDeseada", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaCita">Fecha y hora (horario)</Label>
          <Input
            id="fechaCita"
            type="datetime-local"
            value={formData.fechaCita ? formData.fechaCita.slice(0, 16) : ""}
            onChange={(e) => handleChange("fechaCita", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input
            id="especialidad"
            value={formData.especialidad}
            onChange={(e) => handleChange("especialidad", e.target.value)}
          />
        </div>

        {/* 🔹 Selector de pacientes si NO es paciente */}
        {!isPaciente && (
          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select onValueChange={(val) => handleChange("pacienteId", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre} {p.apellidoPaterno || ""} {p.apellidoMaterno || ""} - {p.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 🔹 Info de paciente logueado */}
        {isPaciente && (
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Input
              readOnly
              value={
                userInfo
                  ? `${userInfo.nombre} ${userInfo.apellidoPaterno || ""} (${userInfo.email})`
                  : "Cargando..."
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="medico">Médico *</Label>
          <Select onValueChange={(val) => handleChange("medicoId", Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un médico" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              {medicos.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nombre} {m.apellidoPaterno || ""} {m.apellidoMaterno || ""} - {m.especialidad || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="motivo">Motivo</Label>
          <Textarea
            id="motivo"
            value={formData.motivo || ""}
            onChange={(e) => handleChange("motivo", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consultorio">Consultorio</Label>
          <Input
            id="consultorio"
            value={formData.consultorio || ""}
            onChange={(e) => handleChange("consultorio", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleChange("telefono", e.target.value)}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-between items-center pt-4">
        <div>
          {cita && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Eliminar
            </Button>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : cita ? "Guardar cambios" : "Guardar Cita"}
          </Button>
        </div>
      </div>

      <ModalConfirm
        open={isConfirmOpen}
        title="Eliminar cita"
        description="¿Estás seguro que quieres eliminar esta cita?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </form>
  );
}
