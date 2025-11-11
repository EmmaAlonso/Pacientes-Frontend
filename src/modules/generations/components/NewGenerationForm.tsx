"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenerationsApi } from "../services/generations.api";
import { CreateGenerationDto } from "../types/generation.types";

interface NewGenerationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewGenerationForm({
  onSuccess,
  onCancel,
}: NewGenerationFormProps) {
  const [formData, setFormData] = useState<CreateGenerationDto>({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof CreateGenerationDto,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        setError("Por favor ingresa el nombre de la generación");
        return;
      }

      if (!formData.startDate) {
        setError("Por favor selecciona la fecha de inicio");
        return;
      }

      if (!formData.endDate) {
        setError("Por favor selecciona la fecha de fin");
        return;
      }

      // Validar que la fecha de fin sea posterior a la de inicio
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError("La fecha de fin debe ser posterior a la fecha de inicio");
        return;
      }

      await GenerationsApi.create(formData);
      onSuccess();
    } catch (err) {
      setError("Error al crear la generación");
      console.error("Error creating generation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Generación *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Ingresa el nombre de la generación"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Fecha de Inicio *</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Fecha de Fin *</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange("endDate", e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Generación"}
        </Button>
      </div>
    </form>
  );
}
