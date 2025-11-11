"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  UserCog,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
}

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "Kevin Luciano",
    email: "kevin@crm.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Ana Gómez",
    email: "ana@crm.com",
    role: "editor",
    status: "active",
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    email: "carlos@crm.com",
    role: "viewer",
    status: "inactive",
  },
];

const roleConfig = {
  admin: { label: "Administrador", color: "bg-blue-500", icon: ShieldCheck },
  editor: { label: "Editor", color: "bg-purple-500", icon: Users },
  viewer: { label: "Visualizador", color: "bg-gray-500", icon: UserCog },
} as const;

const stats = [
  {
    title: "Total Usuarios",
    value: users.length,
    icon: Users,
    description: "Usuarios registrados",
  },
  {
    title: "Activos",
    value: users.filter((u) => u.status === "active").length,
    icon: CheckCircle2,
    description: "Usuarios activos",
  },
  {
    title: "Inactivos",
    value: users.filter((u) => u.status === "inactive").length,
    icon: XCircle,
    description: "Usuarios inactivos",
  },
  {
    title: "Roles",
    value: Object.keys(roleConfig).length,
    icon: UserCog,
    description: "Tipos de usuario",
  },
];

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Aplicar búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          roleConfig[user.role].label.toLowerCase().includes(query)
      );
    }

    // Aplicar ordenamiento
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return result;
  }, [users, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof User) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Usuarios
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Gestiona los usuarios y sus permisos
            </p>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
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
              placeholder="Buscar usuarios..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Nombre
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Rol
                    {getSortIcon("role")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Estado
                    {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.map((user) => {
                const Icon = roleConfig[user.role].icon;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          roleConfig[user.role].color +
                          " flex items-center gap-1"
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {roleConfig[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }
                      >
                        {user.status === "active" ? "Activo" : "Inactivo"}
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
        </div>
      </div>
    </Layout>
  );
}
