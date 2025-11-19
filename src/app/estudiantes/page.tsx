"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { PatientsApi } from "@/modules/patients/services/patients.api";
import { Patient } from "@/modules/patients/types/patient.types";
import { NewPatientForm } from "@/modules/patients/components/NewPatientForm";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SortField = "nombre" | "email" | "direccion" | "telefono" | "edad" | "ocupacion";
type SortOrder = "asc" | "desc";

export default function EstudiantesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [students, setStudents] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const studentsPerPage = 10;

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await PatientsApi.getAll();
      setStudents(data);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentCreated = () => {
    setIsModalOpen(false);
    setIsEditOpen(false);
    fetchStudents(); // Recargar la lista de estudiantes
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };

  const handleDelete = async (patient: Patient) => {
    const ok = confirm(`¿Eliminar al paciente ${patient.nombre}?`);
    if (!ok) return;
    try {
      await PatientsApi.delete(patient.id);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Error al eliminar el paciente");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredStudents = students
    .filter((student) => {
      const term = searchTerm.toLowerCase();
      return (
        student.nombre.toLowerCase().includes(term) ||
        (student.apellidoPaterno || "").toLowerCase().includes(term) ||
        (student.apellidoMaterno || "").toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        (student.direccion || "").toLowerCase().includes(term) ||
        (student.telefono || "").toLowerCase().includes(term) ||
        (student.ocupacion || "").toLowerCase().includes(term) ||
        (student.edad ? String(student.edad) : "").includes(term)
      );
    })
    .sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortField) {
        case "nombre":
          aValue = a.nombre;
          bValue = b.nombre;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "direccion":
          aValue = a.direccion || "";
          bValue = b.direccion || "";
          break;
        case "telefono":
          aValue = a.telefono || "";
          bValue = b.telefono || "";
          break;
        case "edad":
          aValue = a.edad ?? 0;
          bValue = b.edad ?? 0;
          break;
        case "ocupacion":
          aValue = a.ocupacion || "";
          bValue = b.ocupacion || "";
          break;
        default:
          aValue = a.nombre;
          bValue = b.nombre;
      }

      if (typeof aValue === "number" || typeof bValue === "number") {
        return sortOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      if (sortOrder === "asc") {
        return String(aValue) > String(bValue) ? 1 : -1;
      } else {
        return String(aValue) < String(bValue) ? 1 : -1;
      }
    });
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="text-muted-foreground">
              
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
              </DialogHeader>
              <NewPatientForm
                onSuccess={handleStudentCreated}
                onCancel={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("nombre")}
                >
                  <div className="flex items-center">
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("direccion")}
                >
                  <div className="flex items-center">
                    Dirección
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("edad")}
                >
                  <div className="flex items-center">
                    Edad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("telefono")}
                >
                  <div className="flex items-center">
                    Teléfono
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("ocupacion")}
                >
                  <div className="flex items-center">
                    Ocupación
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.nombre}
                  </TableCell>
                  <TableCell>
                    {(student.apellidoPaterno || "") +
                      (student.apellidoPaterno || student.apellidoMaterno ? " " : "") +
                      (student.apellidoMaterno || "")}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.direccion || "-"}</TableCell>
                  <TableCell>{student.edad ?? "-"}</TableCell>
                  <TableCell>{student.telefono || "-"}</TableCell>
                  <TableCell>{student.ocupacion || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student)}>
                        Ver
+                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                        Editar
+                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(student)}>
                        Eliminar
+                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        {/* Modal Ver detalles */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalles del Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div><strong>Nombre:</strong> {selectedPatient?.nombre}</div>
              <div><strong>Apellidos:</strong> {(selectedPatient?.apellidoPaterno||"") + " " + (selectedPatient?.apellidoMaterno||"")}</div>
              <div><strong>Email:</strong> {selectedPatient?.email}</div>
              <div><strong>Dirección:</strong> {selectedPatient?.direccion || "-"}</div>
              <div><strong>Edad:</strong> {selectedPatient?.edad ?? "-"}</div>
              <div><strong>Teléfono:</strong> {selectedPatient?.telefono || "-"}</div>
              <div><strong>Ocupación:</strong> {selectedPatient?.ocupacion || "-"}</div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Cerrar</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={isEditOpen} onOpenChange={(open) => { if(!open){ setIsEditOpen(false); setSelectedPatient(null);} else setIsEditOpen(open); }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Paciente</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <NewPatientForm
                patient={selectedPatient}
                onSuccess={handleStudentCreated}
                onCancel={() => { setIsEditOpen(false); setSelectedPatient(null); }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
