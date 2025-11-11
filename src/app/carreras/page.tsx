"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { CareersApi } from "@/modules/careers/services/careers.api";
import { Career } from "@/modules/careers/types/career.types";
import { NewCareerForm } from "@/modules/careers/components/NewCareerForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SortField = "nombre" | "universidad" | "estudiantes" | "generaciones";
type SortOrder = "asc" | "desc";

export default function CarrerasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [careers, setCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCareers = async () => {
    try {
      setIsLoading(true);
      const data = await CareersApi.getAll();
      setCareers(data);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleCareerCreated = () => {
    setIsModalOpen(false);
    fetchCareers(); // Recargar la lista de carreras
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCareers = careers
    .filter(
      (career) =>
        career.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.universidad?.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "nombre":
          aValue = a.nombre;
          bValue = b.nombre;
          break;
        case "universidad":
          aValue = a.universidad?.nombre ?? "";
          bValue = b.universidad?.nombre ?? "";
          break;
        case "estudiantes":
          aValue = a.estudiantes?.length ?? 0;
          bValue = b.estudiantes?.length ?? 0;
          break;
        case "generaciones":
          aValue = a.generaciones?.length ?? 0;
          bValue = b.generaciones?.length ?? 0;
          break;
        default:
          aValue = a.nombre;
          bValue = b.nombre;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCareers = filteredCareers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);

  const stats = [
    {
      title: "Medicos",
      value: careers.length,
      icon: GraduationCap,
      description: "Carreras registradas",
    },
    {
      title: "Pacientes",
      value: careers.reduce(
        (acc, career) => acc + (career.estudiantes?.length ?? 0),
        0
      ),
      icon: Users,
      description: "Estudiantes en carreras",
    },
    {
      title: "Citas",
      value: new Set(
        careers
          .map((career) => career.universidad?.id)
          .filter((id): id is number => id !== undefined)
      ).size,
      icon: Building2,
      description: "Universidades con carreras",
    },
    {
      title: "Generaciones",
      value: careers.reduce(
        (acc, career) => acc + (career.generaciones?.length ?? 0),
        0
      ),
      icon: BookOpen,
      description: "Generaciones activas",
    },
  ];

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
            <h1 className="text-3xl font-bold tracking-tight">Medicos</h1>
            <p className="text-muted-foreground">
              
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Medico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Carrera</DialogTitle>
              </DialogHeader>
              <NewCareerForm
                onSuccess={handleCareerCreated}
                onCancel={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar carreras..."
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
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("universidad")}
                >
                  <div className="flex items-center">
                    Universidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("estudiantes")}
                >
                  <div className="flex items-center">
                    Estudiantes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("generaciones")}
                >
                  <div className="flex items-center">
                    Generaciones
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCareers.map((career) => (
                <TableRow key={career.id}>
                  <TableCell className="font-medium">{career.nombre}</TableCell>
                  <TableCell>{career.universidad?.nombre ?? "-"}</TableCell>
                  <TableCell>{career.estudiantes?.length ?? 0}</TableCell>
                  <TableCell>{career.generaciones?.length ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver detalles
                    </Button>
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

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
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
      </div>
    </Layout>
  );
}
