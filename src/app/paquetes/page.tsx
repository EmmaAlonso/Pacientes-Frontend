"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Package,
  Users,
  CreditCard,
  Box,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PackageType {
  id: string;
  name: string;
  price: number;
  students: number;
  status: "active" | "inactive";
  type: "básico" | "premium" | "personalizado";
}

// Mock data
const packages: PackageType[] = [
  {
    id: "1",
    name: "Paquete Básico",
    price: 1500,
    students: 80,
    status: "active",
    type: "básico",
  },
  {
    id: "2",
    name: "Paquete Premium",
    price: 2500,
    students: 120,
    status: "active",
    type: "premium",
  },
  {
    id: "3",
    name: "Paquete Personalizado",
    price: 2000,
    students: 35,
    status: "inactive",
    type: "personalizado",
  },
  
];

const typeConfig = {
  básico: { label: "Básico", color: "bg-blue-500" },
  premium: { label: "Premium", color: "bg-purple-500" },
  personalizado: { label: "Personalizado", color: "bg-green-500" },
} as const;

const stats = [
  {
    title: "Total Paquetes",
    value: packages.length,
    icon: Package,
    description: "Paquetes registrados",
  },
  {
    title: "Estudiantes con Paquete",
    value: packages.reduce((acc, p) => acc + p.students, 0),
    icon: Users,
    description: "Estudiantes inscritos en paquetes",
  },
  {
    title: "Ingresos Estimados",
    value: `$${packages.reduce((acc, p) => acc + p.price * p.students, 0)}`,
    icon: CreditCard,
    description: "Total estimado por paquetes",
  },
  {
    title: "Tipos de Paquete",
    value: Object.keys(typeConfig).length,
    icon: Box,
    description: "Variedades de paquetes",
  },
];

type SortField = "name" | "type" | "price" | "students" | "status";
type SortOrder = "asc" | "desc";

export default function PaquetesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredPackages = packages
    .filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        typeConfig[pkg.type].label
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (pkg.status === "active" ? "activo" : "inactivo").includes(
          searchTerm.toLowerCase()
        )
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "type") {
        aValue = typeConfig[aValue as keyof typeof typeConfig].label;
        bValue = typeConfig[bValue as keyof typeof typeConfig].label;
      }

      if (sortField === "status") {
        aValue = aValue === "active" ? "activo" : "inactivo";
        bValue = bValue === "active" ? "activo" : "inactivo";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight">Consultas</h1>
            <p className="text-muted-foreground">
              
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Consulta
          </Button>
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
              placeholder="Buscar paquetes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); 
              }}
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                  <div className="flex items-center">
                    Tipo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                  <div className="flex items-center">
                    Precio
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("students")}>
                  <div className="flex items-center">
                    Estudiantes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>
                    <Badge className={typeConfig[pkg.type].color}>
                      {typeConfig[pkg.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell>${pkg.price}</TableCell>
                  <TableCell>{pkg.students}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        pkg.status === "active" ? "bg-green-500" : "bg-gray-400"
                      }
                    >
                      {pkg.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
      </div>
    </Layout>
  );
}
