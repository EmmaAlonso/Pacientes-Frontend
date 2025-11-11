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
import { StudentsApi } from "../services/students.api";
import { CreateStudentDto } from "../types/student.types";
import { UniversitiesApi } from "@/modules/universities/services/universities.api";
import { CareersApi } from "@/modules/careers/services/careers.api";
import { GenerationsApi } from "@/modules/generations/services/generations.api";
import { University } from "@/modules/universities/types/university.types";
import { Career } from "@/modules/careers/types/career.types";
import { Generation } from "@/modules/generations/types/generation.types";

interface NewStudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewStudentForm({ onSuccess, onCancel }: NewStudentFormProps) {
  const [formData, setFormData] = useState<CreateStudentDto>({
    nombre: "",
    email: "",
    telefono: "",
    usuarioId: 1, // Valor por defecto, deberías obtener el usuario actual
    universidadId: 0,
    carreraId: 0,
    generacionId: 0,
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universitiesData, careersData, generationsData] =
          await Promise.all([
            UniversitiesApi.getAll(),
            CareersApi.getAll(),
            GenerationsApi.getAll(),
          ]);
        setUniversities(universitiesData);
        setCareers(careersData);
        setGenerations(generationsData);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    field: keyof CreateStudentDto,
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
      if (
        !formData.nombre ||
        !formData.email ||
        !formData.universidadId ||
        !formData.carreraId ||
        !formData.generacionId
      ) {
        setError("Por favor completa todos los campos obligatorios");
        return;
      }

      await StudentsApi.create(formData);
      onSuccess();
    } catch (err) {
      setError("Error al crear el estudiante");
      console.error("Error creating student:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre completo *</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ingresa el nombre completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Ingresa el email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          value={formData.telefono}
          onChange={(e) => handleInputChange("telefono", e.target.value)}
          placeholder="Ingresa el teléfono (opcional)"
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

      <div className="space-y-2">
        <Label htmlFor="carrera">Carrera *</Label>
        <Select
          value={formData.carreraId.toString()}
          onValueChange={(value) =>
            handleInputChange("carreraId", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una carrera" />
          </SelectTrigger>
          <SelectContent>
            {careers.map((career) => (
              <SelectItem key={career.id} value={career.id.toString()}>
                {career.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="generacion">Generación *</Label>
        <Select
          value={formData.generacionId.toString()}
          onValueChange={(value) =>
            handleInputChange("generacionId", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una generación" />
          </SelectTrigger>
          <SelectContent>
            {generations.map((generation) => (
              <SelectItem key={generation.id} value={generation.id.toString()}>
                {generation.name}
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
          {isLoading ? "Guardando..." : "Guardar Estudiante"}
        </Button>
      </div>
    </form>
  );
}
