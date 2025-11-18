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
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type SortField =
  | "nombre"
  | "email"
  | "direccion"
  | "telefono"
  | "edad"
  | "ocupacion";
type SortOrder = "asc" | "desc";

function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const patientsPerPage = 10;
  const { user } = useAuth(); // 👈 Obtener datos del usuario logueado

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      let data;

      if (user?.rol === "PACIENTE") {
        // El paciente solo ve su propio perfil
        data = [await PatientsApi.getMyData()];
      } else {
        // Admin y médico pueden ver todos los pacientes
        data = await PatientsApi.getAll();
      }

      setPatients(data);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const handlePatientCreated = () => {
    setIsModalOpen(false);
    toast.success("Paciente guardado correctamente");
    fetchPatients();
  };

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`¿Eliminar al paciente ${patient.nombre}?`)) return;
    try {
      await PatientsApi.delete(patient.id);
      toast.success("Paciente eliminado");
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
      toast.error("Error al eliminar el paciente");
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

  const filteredPatients = patients
    .filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(term) ||
        (p.email || "").toLowerCase().includes(term) ||
        (p.telefono || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField] ?? "";
      const bVal = b[sortField] ?? "";
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>

          {user?.rol === "ADMIN" && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Paciente</DialogTitle>
                </DialogHeader>
                <NewPatientForm
                  onSuccess={handlePatientCreated}
                  onCancel={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
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
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-6">{error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("nombre")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      Nombre <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Edad</TableHead>
                  {user?.rol === "ADMIN" && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPatients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.telefono || "-"}</TableCell>
                    <TableCell>{p.edad ?? "-"}</TableCell>
                    {user?.rol === "ADMIN" && (
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(p)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
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
        )}
      </div>
    </Layout>
  );
}

export default withRoleProtection(PacientesPage, ["ADMIN", "PACIENTE"]);
