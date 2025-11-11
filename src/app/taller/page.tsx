"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Wrench,
  Users,
  CheckCircle2,
  ListChecks,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KanbanBoard from "@/components/workshop/KanbanBoard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stats = [
  {
    title: "Total Tareas",
    value: 12,
    icon: ListChecks,
    description: "Tareas registradas en el taller",
  },
  {
    title: "Tareas Completadas",
    value: 7,
    icon: CheckCircle2,
    description: "Tareas finalizadas",
  },
  {
    title: "Colaboradores",
    value: 4,
    icon: Users,
    description: "Personas asignadas al taller",
  },
  {
    title: "Taller",
    value: "Activo",
    icon: Wrench,
    description: "Estado actual",
  },
];

type SortField = "title" | "priority" | "dueDate" | "assignee";
type SortOrder = "asc" | "desc";
type Priority = "low" | "medium" | "high";
type Status = "pending" | "in_progress" | "completed";

export default function TallerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <Layout data-oid=":kqd9ss">
      <div className="space-y-6" data-oid="kri71qy">
        <div className="flex items-center justify-between" data-oid="b1os05e">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Taller
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Gestiona las tareas y actividades del taller
            </p>
          </div>

          <Button data-oid="rusc7rn">
            <Plus className="mr-2 h-4 w-4" data-oid="de53q9b" />
            Nueva Tarea
          </Button>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="46sk21g"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="s-l5jxd">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="9f31864"
              >
                <CardTitle className="text-sm font-medium" data-oid="yxivlv.">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="z-.9cw5"
                />
              </CardHeader>
              <CardContent data-oid="3qjdtb3">
                <div className="text-2xl font-bold" data-oid=".7-hf3i">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid=".dz6h8l">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4" data-oid="cyimula">
          <div className="relative flex-1" data-oid="x-pqez_">
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="hq..9lr"
            />
            <Input
              placeholder="Buscar tareas..."
              className="pl-8"
              data-oid=".bc_tcd"
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
              onClick={() => handleSort("priority")}
              className="flex items-center gap-2"
            >
              Prioridad
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("dueDate")}
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
                  <h4 className="mb-2 text-sm font-medium">Prioridad</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedPriorities.includes("high")}
                    onCheckedChange={() => togglePriority("high")}
                  >
                    Alta
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedPriorities.includes("medium")}
                    onCheckedChange={() => togglePriority("medium")}
                  >
                    Media
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedPriorities.includes("low")}
                    onCheckedChange={() => togglePriority("low")}
                  >
                    Baja
                  </DropdownMenuCheckboxItem>
                </div>
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Estado</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("pending")}
                    onCheckedChange={() => toggleStatus("pending")}
                  >
                    Pendiente
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("in_progress")}
                    onCheckedChange={() => toggleStatus("in_progress")}
                  >
                    En Proceso
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("completed")}
                    onCheckedChange={() => toggleStatus("completed")}
                  >
                    Completado
                  </DropdownMenuCheckboxItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <KanbanBoard
          searchTerm={searchTerm}
          sortField={sortField}
          sortOrder={sortOrder}
          selectedPriorities={selectedPriorities}
          selectedStatuses={selectedStatuses}
        />
      </div>
    </Layout>
  );
}
