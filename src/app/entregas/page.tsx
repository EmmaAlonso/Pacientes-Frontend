"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  Filter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Delivery {
  id: string;
  student: string;
  product: string;
  date: string;
  status: "delivered" | "pending" | "failed";
}

// Mock data
const deliveries: Delivery[] = [
  {
    id: "1",
    student: "Juan Pérez",
    product: "Toga",
    date: "2024-06-01",
    status: "delivered",
  },
  {
    id: "2",
    student: "Ana Gómez",
    product: "Birrete",
    date: "2024-06-03",
    status: "pending",
  },
  {
    id: "3",
    student: "Carlos Ruiz",
    product: "Anillo de Graduación",
    date: "2024-06-05",
    status: "failed",
  },
];

const statusConfig = {
  delivered: { label: "Entregado", color: "bg-green-500", icon: CheckCircle2 },
  pending: { label: "Pendiente", color: "bg-yellow-500", icon: Clock },
  failed: { label: "Fallido", color: "bg-red-500", icon: XCircle },
} as const;

const stats = [
  {
    title: "Total Entregas",
    value: deliveries.length,
    icon: Truck,
    description: "Entregas registradas",
  },
  {
    title: "Entregadas",
    value: deliveries.filter((d) => d.status === "delivered").length,
    icon: CheckCircle2,
    description: "Productos entregados",
  },
  {
    title: "Pendientes",
    value: deliveries.filter((d) => d.status === "pending").length,
    icon: Clock,
    description: "Entregas en espera",
  },
  {
    title: "Fallidas",
    value: deliveries.filter((d) => d.status === "failed").length,
    icon: XCircle,
    description: "Entregas con error",
  },
];

type SortField = "student" | "product" | "date" | "status";
type SortOrder = "asc" | "desc";
type Status = "delivered" | "pending" | "failed";

export default function EntregasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
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

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

 const filteredAndSortedDeliveries = deliveries
  .filter((delivery) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      delivery.student.toLowerCase().includes(searchLower) ||
      delivery.product.toLowerCase().includes(searchLower) ||
      statusConfig[delivery.status].label.toLowerCase().includes(searchLower);

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(delivery.status);

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortField) {
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "status":
        aValue = statusConfig[a.status].label;
        bValue = statusConfig[b.status].label;
        break;
      default:
        aValue = a[sortField] as string;
        bValue = b[sortField] as string;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

const totalPages = Math.ceil(filteredAndSortedDeliveries.length / itemsPerPage);
const paginatedDeliveries = filteredAndSortedDeliveries.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  return (
    <Layout data-oid="7r8boq7">
      <div className="space-y-6" data-oid="nu.ecsz">
        <div className="flex items-center justify-between" data-oid="-r4liea">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Entregas
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Gestiona la entrega de productos a los estudiantes
            </p>
          </div>

          <Button data-oid="3q-cok9">
            <Plus className="mr-2 h-4 w-4" data-oid="u7saawr" />
            Nueva Entrega
          </Button>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="5j795bo"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="_c7tg.7">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="h5mqxm7"
              >
                <CardTitle className="text-sm font-medium" data-oid="0pdjxj8">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="3tg80b9"
                />
              </CardHeader>
              <CardContent data-oid="zl57_xi">
                <div className="text-2xl font-bold" data-oid="un0f9is">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid="k9c9h3n">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4" data-oid="zzcemay">
          <div className="relative flex-1" data-oid="5z766r_">
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="m9nh29:"
            />
            <Input
              placeholder="Buscar entregas..."
              className="pl-8"
              data-oid="8mj4tqz"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("student")}
              className="flex items-center gap-2"
            >
              Estudiante
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("date")}
              className="flex items-center gap-2"
            >
              Fecha
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Estado</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("delivered")}
                    onCheckedChange={() => toggleStatus("delivered")}
                  >
                    Entregado
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("pending")}
                    onCheckedChange={() => toggleStatus("pending")}
                  >
                    Pendiente
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("failed")}
                    onCheckedChange={() => toggleStatus("failed")}
                  >
                    Fallido
                  </DropdownMenuCheckboxItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border" data-oid="owkfwqq">
          <Table data-oid="imrxnkz">
            <TableHeader data-oid="g.r42:c">
              <TableRow data-oid="3rxw_uh">
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("student")}
                  data-oid="pc.84kg"
                >
                  <div className="flex items-center">
                    Estudiante
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("product")}
                  data-oid="ssjs9.h"
                >
                  <div className="flex items-center">
                    Producto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                  data-oid="zju513d"
                >
                  <div className="flex items-center">
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                  data-oid="_c9-_fd"
                >
                  <div className="flex items-center">
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" data-oid="5pmff2a">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {paginatedDeliveries.map((delivery) => {
    const Icon = statusConfig[delivery.status].icon;
    return (
      <TableRow key={delivery.id}>
        <TableCell className="font-medium">{delivery.student}</TableCell>
        <TableCell>{delivery.product}</TableCell>
        <TableCell>{new Date(delivery.date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Badge className={`${statusConfig[delivery.status].color} flex items-center gap-1`}>
            <Icon className="h-4 w-4" />
            {statusConfig[delivery.status].label}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            Ver detalles
          </Button>
        </TableCell>
      </TableRow>
    );
  })}
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
