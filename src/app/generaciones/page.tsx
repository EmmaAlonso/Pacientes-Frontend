"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Calendar,
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { GenerationsApi } from "@/modules/generations/services/generations.api";
import { Generation } from "@/modules/generations/types/generation.types";
import { NewGenerationForm } from "@/modules/generations/components/NewGenerationForm";

const statusConfig = {
  active: { label: "En Progreso", color: "bg-blue-500" },
  completed: { label: "Completada", color: "bg-green-500" },
  upcoming: { label: "Próxima", color: "bg-yellow-500" },
} as const;

const eventStatusConfig = {
  completed: { icon: CheckCircle2, color: "text-green-500" },
  pending: { icon: AlertCircle, color: "text-yellow-500" },
  upcoming: { icon: Clock, color: "text-blue-500" },
} as const;

type SortField =
  | "name"
  | "startDate"
  | "endDate"
  | "totalStudents"
  | "completedStudents"
  | "status";
type SortOrder = "asc" | "desc";

function getStatusConfig(status: Generation["status"] | undefined) {
  return (
    statusConfig[status as keyof typeof statusConfig] ??
    statusConfig["upcoming"]
  );
}

export default function GeneracionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGenerations = async () => {
    try {
      setIsLoading(true);
      const data = await GenerationsApi.getAll();
      setGenerations(data);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  const handleGenerationCreated = () => {
    setIsModalOpen(false);
    fetchGenerations(); // Recargar la lista de generaciones
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredGenerations = generations
    .filter(
      (generation) =>
        (generation.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        statusConfig[generation.status].label
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        generation.events?.some((event) =>
          (event.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Manejo especial para fechas
      if (sortField === "startDate" || sortField === "endDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Manejo especial para el estado
      if (sortField === "status") {
        aValue = statusConfig[aValue as keyof typeof statusConfig].label;
        bValue = statusConfig[bValue as keyof typeof statusConfig].label;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const stats = [
    {
      title: "Total Generaciones",
      value: generations.length,
      icon: Calendar,
      description: "Generaciones registradas",
    },
    {
      title: "Estudiantes Activos",
      value: generations.reduce(
        (acc, gen) => acc + (gen.totalStudents ?? 0),
        0
      ),
      icon: Users,
      description: "Estudiantes en proceso",
    },
    {
      title: "Completados",
      value: generations.reduce(
        (acc, gen) => acc + (gen.completedStudents ?? 0),
        0
      ),
      icon: GraduationCap,
      description: "Estudiantes graduados",
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
            <h1 className="text-3xl font-bold tracking-tight">Generaciones</h1>
            <p className="text-muted-foreground">
              Gestiona las generaciones y eventos de graduación
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Generación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Generación</DialogTitle>
              </DialogHeader>
              <NewGenerationForm
                onSuccess={handleGenerationCreated}
                onCancel={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
              placeholder="Buscar generaciones..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("startDate")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por Fecha
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("status")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por Estado
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredGenerations.map((generation) => (
            <Card key={generation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{generation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(generation.startDate).toLocaleDateString()} -{" "}
                      {new Date(generation.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusConfig(generation.status).color}>
                    {getStatusConfig(generation.status).label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">
                        Progreso de Estudiantes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {generation.completedStudents} /{" "}
                        {generation.totalStudents}
                      </p>
                    </div>
                    <Progress
                      value={
                        generation.totalStudents > 0
                          ? (generation.completedStudents /
                              generation.totalStudents) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Eventos Programados
                      </h4>
                      <div className="space-y-2">
                        {generation.events?.map((event, index) => {
                          const Icon = eventStatusConfig[event.status].icon;
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  eventStatusConfig[event.status].color
                                }`}
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {event.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
