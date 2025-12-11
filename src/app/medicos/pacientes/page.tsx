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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ===== Interface =====
interface Paciente {
  id: number;
  nombre: string;
  edad: number;
  ocupacion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sexo?: string;
  medicoId?: number;
}

export default function MedicosPacientesPage() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selected, setSelected] = useState<Paciente | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    ocupacion: "",
    direccion: "",
    telefono: "",
    email: "",
    sexo: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  // ===== Cargar pacientes =====
  const fetchPacientes = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/patients/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data)) setPacientes(data);
      else setPacientes([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // ===== Registrar =====
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3005/patients/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, edad: Number(formData.edad) }),
    });

    if (res.ok) {
      alert("Paciente registrado.");
      setOpenCreate(false);
      fetchPacientes();
      setFormData({
        nombre: "",
        edad: "",
        ocupacion: "",
        direccion: "",
        telefono: "",
          email: "",
        sexo: "",
      });
    } else {
      alert("Error al registrar paciente");
    }
  };

  // ===== Actualizar paciente =====
  const handleEditSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3005/patients/${selected?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...selected, edad: Number(selected?.edad), email: selected?.email }),
      }
    );

    if (res.ok) {
      alert("Paciente actualizado");
      setOpenEdit(false);
      fetchPacientes();
    } else {
      alert("Error al actualizar");
    }
  };

  // ===== Eliminar =====
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar paciente?")) return;

    const res = await fetch(`http://localhost:3005/patients/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("Paciente eliminado");
      fetchPacientes();
    } else {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Mis Pacientes</h1>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:opacity-90">
              Nuevo Paciente
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Paciente</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
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
                  value={formData.ocupacion}
                  onChange={(e) =>
                    setFormData({ ...formData, ocupacion: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Sexo</Label>
                <Input
                  placeholder="Masculino, Femenino, Otro"
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({ ...formData, sexo: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 text-white">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ===== Lista ===== */}
            {/* ===== Lista ===== */}
      {loading ? (
        <p>Cargando...</p>
      ) : pacientes.length === 0 ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white-600 text-black">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Edad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Teléfono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Correo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pacientes.map((p, index) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">
                    {p.nombre}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.edad}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.telefono || "No registrado"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {p.email || "No registrado"}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelected(p);
                        setOpenView(true);
                      }}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelected(p);
                        setOpenEdit(true);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* ===== Modal Ver Detalles ===== */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Paciente</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {selected.nombre}</p>
              <p><strong>Edad:</strong> {selected.edad}</p>
              <p><strong>Ocupación:</strong> {selected.ocupacion}</p>
              <p><strong>Dirección:</strong> {selected.direccion}</p>
              <p><strong>Teléfono:</strong> {selected.telefono}</p>
              <p><strong>Correo:</strong> {selected.email}</p>
              <p><strong>Sexo:</strong> {selected.sexo}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Modal Editar ===== */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>

          {selected && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Label>Nombre</Label>
              <Input
                value={selected.nombre}
                onChange={(e) =>
                  setSelected({ ...selected, nombre: e.target.value })
                }
              />

              <Label>Edad</Label>
              <Input
                type="number"
                value={selected.edad}
                onChange={(e) =>
                  setSelected({ ...selected, edad: Number(e.target.value) })
                }
              />

              <Label>Ocupación</Label>
              <Input
                value={selected.ocupacion}
                onChange={(e) =>
                  setSelected({ ...selected, ocupacion: e.target.value })
                }
              />

              <Label>Dirección</Label>
              <Input
                value={selected.direccion}
                onChange={(e) =>
                  setSelected({ ...selected, direccion: e.target.value })
                }
              />

              <Label>Teléfono</Label>
              <Input
                value={selected.telefono}
                onChange={(e) =>
                  setSelected({ ...selected, telefono: e.target.value })
                }
              />

              <Label>Correo</Label>
              <Input
                type="email"
                value={selected.email}
                onChange={(e) =>
                  setSelected({ ...selected, email: e.target.value })
                }
              />

              <Label>Sexo</Label>
              <Input
                value={selected.sexo}
                onChange={(e) =>
                  setSelected({ ...selected, sexo: e.target.value })
                }
              />

              <Button className="w-full bg-green-600 text-white" type="submit">
                Guardar Cambios
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
