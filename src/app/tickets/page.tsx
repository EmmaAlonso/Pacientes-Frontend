"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Ticket,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
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

interface TicketType {
  id: string;
  subject: string;
  requester: string;
  date: string;
  status: "open" | "in_progress" | "closed";
}

const tickets: TicketType[] = [
  { id: "1", subject: "Problema con pago", requester: "Juan Pérez", date: "2024-06-01", status: "open" },
  { id: "2", subject: "No puedo descargar recibo", requester: "Ana Gómez", date: "2024-06-03", status: "in_progress" },
  { id: "3", subject: "Error en datos personales", requester: "Carlos Ruiz", date: "2024-06-05", status: "closed" },
];

const statusConfig = {
  open: { label: "Abierto", color: "bg-yellow-500", icon: AlertCircle },
  in_progress: { label: "En Progreso", color: "bg-blue-500", icon: Clock },
  closed: { label: "Cerrado", color: "bg-green-500", icon: CheckCircle2 },
} as const;

const stats = [
  { title: "Total Tickets", value: tickets.length, icon: Ticket, description: "Tickets registrados" },
  { title: "Abiertos", value: tickets.filter((t) => t.status === "open").length, icon: AlertCircle, description: "Tickets abiertos" },
  { title: "En Progreso", value: tickets.filter((t) => t.status === "in_progress").length, icon: Clock, description: "Tickets en progreso" },
  { title: "Cerrados", value: tickets.filter((t) => t.status === "closed").length, icon: CheckCircle2, description: "Tickets cerrados" },
];

type SortField = "subject" | "requester" | "date" | "status";
type SortOrder = "asc" | "desc";
type Status = "open" | "in_progress" | "closed";

export default function TicketsPage() {
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
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];
      setCurrentPage(1);
      return newStatuses;
    });
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.requester.toLowerCase().includes(searchLower) ||
      statusConfig[ticket.status].label.toLowerCase().includes(searchLower);

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(ticket.status);

    return matchesSearch && matchesStatus;
  });

  const sortedTickets = filteredTickets.sort((a, b) => {
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

    return sortOrder === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);

  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground">
              Gestiona los tickets y solicitudes de soporte
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Ticket
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
              placeholder="Buscar tickets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="mb-2 text-sm font-medium">Estado</h4>
                {Object.keys(statusConfig).map((key) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedStatuses.includes(key as Status)}
                    onCheckedChange={() => toggleStatus(key as Status)}
                  >
                    {statusConfig[key as Status].label}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("subject")}>Asunto <ArrowUpDown className="ml-2 h-4 w-4" /></TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("requester")}>Solicitante <ArrowUpDown className="ml-2 h-4 w-4" /></TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>Fecha <ArrowUpDown className="ml-2 h-4 w-4" /></TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>Estado <ArrowUpDown className="ml-2 h-4 w-4" /></TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.map((ticket) => {
                const Icon = statusConfig[ticket.status].icon;
                return (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.requester}</TableCell>
                    <TableCell>{new Date(ticket.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[ticket.status].color} flex items-center gap-1`}>
                        <Icon className="h-4 w-4" />
                        {statusConfig[ticket.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Ver detalles</Button>
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        </div>
      </div>
    </Layout>
  );
}
