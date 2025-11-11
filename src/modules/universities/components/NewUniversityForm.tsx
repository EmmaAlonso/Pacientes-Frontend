"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversitiesApi } from "../services/universities.api";
import { CreateUniversityDto } from "../types/university.types";

interface NewUniversityFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewUniversityForm({
  onSuccess,
  onCancel,
}: NewUniversityFormProps) {
  const [formData, setFormData] = useState<CreateUniversityDto>({
    nombre: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof CreateUniversityDto,
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
      if (!formData.nombre.trim()) {
        setError("Por favor ingresa el nombre de la universidad");
        return;
      }

      await UniversitiesApi.create(formData);
      onSuccess();
    } catch (err) {
      setError("Error al crear la universidad");
      console.error("Error creating university:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Universidad *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ingresa el nombre de la universidad"
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Universidad"}
        </Button>
      </div>
    </form>
  );
}
