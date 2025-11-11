"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Bell,
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Notification {
  id: string;
  title: string;
  date: string;
  type: "info" | "warning" | "success";
  status: "read" | "unread";
}

// Mock data
const notifications: Notification[] = [
  {
    id: "1",
    title: "Nuevo pago registrado",
    date: "2024-06-01",
    type: "success",
    status: "unread",
  },
  {
    id: "2",
    title: "Entrega pendiente",
    date: "2024-06-03",
    type: "warning",
    status: "read",
  },
  {
    id: "3",
    title: "Actualización de datos",
    date: "2024-06-05",
    type: "info",
    status: "unread",
  },
];

const typeConfig = {
  info: { label: "Info", color: "bg-blue-500", icon: Clock },
  warning: { label: "Alerta", color: "bg-yellow-500", icon: AlertCircle },
  success: { label: "Éxito", color: "bg-green-500", icon: CheckCircle2 },
} as const;

const stats = [
  {
    title: "Total Notificaciones",
    value: notifications.length,
    icon: Bell,
    description: "Notificaciones registradas",
  },
  {
    title: "Sin Leer",
    value: notifications.filter((n) => n.status === "unread").length,
    icon: AlertCircle,
    description: "Notificaciones no leídas",
  },
  {
    title: "Leídas",
    value: notifications.filter((n) => n.status === "read").length,
    icon: CheckCircle2,
    description: "Notificaciones leídas",
  },
  {
    title: "Tipos",
    value: Object.keys(typeConfig).length,
    icon: Clock,
    description: "Tipos de notificación",
  },
];

type SortField = "title" | "type" | "date" | "status";
type SortOrder = "asc" | "desc";
type NotificationType = "info" | "warning" | "success";
type NotificationStatus = "read" | "unread";

export default function NotificacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    NotificationStatus[]
  >([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleType = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status: NotificationStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredAndSortedNotifications = notifications
    .filter((notification) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        notification.title.toLowerCase().includes(searchLower) ||
        typeConfig[notification.type].label
          .toLowerCase()
          .includes(searchLower) ||
        (notification.status === "unread" ? "sin leer" : "leída").includes(
          searchLower
        );

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(notification.type);
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(notification.status);

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "type":
          aValue = typeConfig[a.type].label;
          bValue = typeConfig[b.type].label;
          break;
        case "status":
          aValue = a.status === "unread" ? "sin leer" : "leída";
          bValue = b.status === "unread" ? "sin leer" : "leída";
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

  return (
    <Layout data-oid="q5:2mkn">
      <div className="space-y-6" data-oid="u2c1xgr">
        <div className="flex items-center justify-between" data-oid="ye-5lwb">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Notificaciones
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Gestiona las notificaciones del sistema
            </p>
          </div>

          <Button data-oid="w4ikjkx">
            <Plus className="mr-2 h-4 w-4" data-oid="2:w1sf6" />
            Nueva Notificación
          </Button>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="o:u2p.8"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="l.3zmik">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="hxuci-:"
              >
                <CardTitle className="text-sm font-medium" data-oid="4ropfsr">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="nf1:w:1"
                />
              </CardHeader>
              <CardContent data-oid="-oca0ft">
                <div className="text-2xl font-bold" data-oid="0-ymcez">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid="_5407qg">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4" data-oid="a39tlmb">
          <div className="relative flex-1" data-oid="qmtnh94">
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid=".3nbso6"
            />
            <Input
              placeholder="Buscar notificaciones..."
              className="pl-8"
              data-oid="v22bd-h"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("title")}
              className="flex items-center gap-2"
            >
              Título
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
                  <h4 className="mb-2 text-sm font-medium">Tipo</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("info")}
                    onCheckedChange={() => toggleType("info")}
                  >
                    Info
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("warning")}
                    onCheckedChange={() => toggleType("warning")}
                  >
                    Alerta
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("success")}
                    onCheckedChange={() => toggleType("success")}
                  >
                    Éxito
                  </DropdownMenuCheckboxItem>
                </div>
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Estado</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("unread")}
                    onCheckedChange={() => toggleStatus("unread")}
                  >
                    Sin leer
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("read")}
                    onCheckedChange={() => toggleStatus("read")}
                  >
                    Leída
                  </DropdownMenuCheckboxItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border" data-oid="w_d:e91">
          <Table data-oid="ph72gaa">
            <TableHeader data-oid="63.1n8h">
              <TableRow data-oid="5wc4fh-">
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("title")}
                  data-oid="d1ye.jn"
                >
                  <div className="flex items-center">
                    Título
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("type")}
                  data-oid="ox8cu-q"
                >
                  <div className="flex items-center">
                    Tipo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                  data-oid="-1:y-1:"
                >
                  <div className="flex items-center">
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                  data-oid="20db2lr"
                >
                  <div className="flex items-center">
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" data-oid="nl9h.a9">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-oid="1mcp:22">
              {filteredAndSortedNotifications.map((notification) => {
                const Icon = typeConfig[notification.type].icon;
                return (
                  <TableRow key={notification.id} data-oid="ev7h:-v">
                    <TableCell className="font-medium" data-oid="bkbirt3">
                      {notification.title}
                    </TableCell>
                    <TableCell data-oid="g8k9ys.">
                      <Badge
                        className={
                          typeConfig[notification.type].color +
                          " flex items-center gap-1"
                        }
                        data-oid="045e8-o"
                      >
                        <Icon className="h-4 w-4" data-oid="e9_5.8a" />
                        {typeConfig[notification.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell data-oid="3hc649e">
                      {new Date(notification.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell data-oid="nkmy3uh">
                      <Badge
                        className={
                          notification.status === "unread"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }
                        data-oid="vw9yj9n"
                      >
                        {notification.status === "unread"
                          ? "Sin leer"
                          : "Leída"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" data-oid="z3l9zfx">
                      <Button variant="ghost" size="sm" data-oid="mglegxf">
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
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
        </div>
      </div>
    </Layout>
  );
}
