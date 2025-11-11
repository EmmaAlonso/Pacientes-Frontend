"use client";

import React, { useState, useEffect } from "react";
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
import { CareersApi } from "../services/careers.api";
import { CreateCareerDto } from "../types/career.types";
import { UniversitiesApi } from "@/modules/universities/services/universities.api";
import { University } from "@/modules/universities/types/university.types";

interface NewCareerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewCareerForm({ onSuccess, onCancel }: NewCareerFormProps) {
  const [formData, setFormData] = useState<CreateCareerDto>({
    nombre: "",
    universidadId: 0,
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await UniversitiesApi.getAll();
        setUniversities(data);
      } catch (err) {
        setError("Error al cargar las universidades");
        console.error("Error fetching universities:", err);
      }
    };

    fetchUniversities();
  }, []);

  const handleInputChange = (
    field: keyof CreateCareerDto,
    value: string | number
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
        setError("Por favor ingresa el nombre de la carrera");
        return;
      }

      if (!formData.universidadId) {
        setError("Por favor selecciona una universidad");
        return;
      }

      await CareersApi.create(formData);
      onSuccess();
    } catch (err) {
      setError("Error al crear la carrera");
      console.error("Error creating career:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Carrera *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ingresa el nombre de la carrera"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="universidad">Universidad *</Label>
        <Select
          value={formData.universidadId.toString()}
          onValueChange={(value) =>
            handleInputChange("universidadId", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una universidad" />
          </SelectTrigger>
          <SelectContent>
            {universities.map((university) => (
              <SelectItem key={university.id} value={university.id.toString()}>
                {university.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar Carrera"}
        </Button>
      </div>
    </form>
  );
}
