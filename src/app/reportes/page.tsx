"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Package, CreditCard } from "lucide-react";

const stats = [
  {
    title: "Estudiantes",
    value: "1,234",
    icon: Users,
    description: "Estudiantes activos",
  },
  {
    title: "Graduados",
    value: "567",
    icon: GraduationCap,
    description: "Estudiantes graduados",
  },
  {
    title: "Paquetes",
    value: "89",
    icon: Package,
    description: "Paquetes activos",
  },
  {
    title: "Pagos",
    value: "$150,000",
    icon: CreditCard,
    description: "Total de pagos procesados",
  },
];

export default function ReportesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">
              Visualiza estadísticas y reportes del sistema
            </p>
          </div>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Reporte General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                [Gráfico o resumen general aquí]
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                [Gráfico de pagos aquí]
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Paquetes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                [Gráfico de paquetes aquí]
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
