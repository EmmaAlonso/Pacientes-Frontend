"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function MedicosPacientesPage() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    ocupacion: "",
    direccion: "",
    telefono: "",
    correo: "",
    sexo: "",
  });

  // Token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const medicoId = payload?.sub ?? null;

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  // =============== Fetch pacientes del médico
  const fetchPacientes = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/patients/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // =============== Registrar paciente
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/patients/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        edad: Number(formData.edad),
      }),
    });

    if (res.ok) {
      alert("Paciente registrado");
      setOpen(false);
      fetchPacientes();
      setFormData({
        nombre: "",
        edad: "",
        ocupacion: "",
        direccion: "",
        telefono: "",
        correo: "",
        sexo: "",
      });
    } else {
      alert("Error al registrar paciente");
    }
  };

  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Pacientes</h1>

        {/* Botón Nuevo Paciente */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              Nuevo Paciente
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-neutral-900 text-white border-neutral-700">
            <DialogHeader>
              <DialogTitle className="text-xl">Registrar Paciente</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    className="bg-neutral-800 text-white"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Edad</Label>
                  <Input
                    type="number"
                    className="bg-neutral-800 text-white"
                    value={formData.edad}
                    onChange={(e) =>
                      setFormData({ ...formData, edad: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Ocupación</Label>
                <Input
                  className="bg-neutral-800 text-white"
                  value={formData.ocupacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ocupacion: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
                  className="bg-neutral-800 text-white"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    className="bg-neutral-800 text-white"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Correo</Label>
                  <Input
                    type="email"
                    className="bg-neutral-800 text-white"
                    value={formData.correo}
                    onChange={(e) =>
                      setFormData({ ...formData, correo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Sexo</Label>
                <Input
                  className="bg-neutral-800 text-white"
                  placeholder="Masculino, Femenino, Otro"
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Guardar Paciente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <div className="space-y-3">
          {pacientes.map((p: any) => (
            <div
              key={p.id}
              className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg"
            >
              <p className="text-lg font-semibold">{p.nombre}</p>
              <p className="text-sm">Edad: {p.edad}</p>
              <p className="text-sm">Teléfono: {p.telefono}</p>
              <p className="text-sm">Correo: {p.correo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
