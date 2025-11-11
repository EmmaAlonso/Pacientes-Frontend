"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Payment {
  id: string;
  student: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "failed";
}

const payments: Payment[] = [
  {
    id: "1",
    student: "Juan Pérez",
    amount: 1500,
    date: "2024-06-01",
    status: "paid",
  },
  {
    id: "2",
    student: "Ana Gómez",
    amount: 2500,
    date: "2024-06-03",
    status: "pending",
  },
  {
    id: "3",
    student: "Carlos Ruiz",
    amount: 2000,
    date: "2024-06-05",
    status: "failed",
  },
  
];

const statusConfig = {
  paid: { label: "Pagado", color: "bg-green-500", icon: CheckCircle2 },
  pending: { label: "Pendiente", color: "bg-yellow-500", icon: CreditCard },
  failed: { label: "Fallido", color: "bg-red-500", icon: XCircle },
} as const;

const stats = [
  {
    title: "Total Pagos",
    value: payments.length,
    icon: CreditCard,
    description: "Pagos registrados",
  },
  {
    title: "Pagos Completados",
    value: payments.filter((p) => p.status === "paid").length,
    icon: CheckCircle2,
    description: "Pagos exitosos",
  },
  {
    title: "Pendientes",
    value: payments.filter((p) => p.status === "pending").length,
    icon: CreditCard,
    description: "Pagos en espera",
  },
  {
    title: "Fallidos",
    value: payments.filter((p) => p.status === "failed").length,
    icon: XCircle,
    description: "Pagos con error",
  },
];

type SortField = "student" | "amount" | "date" | "status";
type SortOrder = "asc" | "desc";

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
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

  const filteredPayments = payments
    .filter(
      (payment) =>
        payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statusConfig[payment.status].label
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortField === "status") {
        aValue = statusConfig[aValue as keyof typeof statusConfig].label;
        bValue = statusConfig[bValue as keyof typeof statusConfig].label;
      }

      if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
      else return aValue < bValue ? 1 : -1;
    });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
            <p className="text-muted-foreground">
              Gestiona los pagos realizados por los estudiantes
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pago
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
              placeholder="Buscar pagos..."
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
                <TableHead onClick={() => handleSort("student")} className="cursor-pointer">
                  <div className="flex items-center">
                    Estudiante
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                  <div className="flex items-center">
                    Monto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                  <div className="flex items-center">
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  <div className="flex items-center">
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => {
                const Icon = statusConfig[payment.status].icon;
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.student}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusConfig[payment.status].color + " flex items-center gap-1"
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {statusConfig[payment.status].label}
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
