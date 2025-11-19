"use client";


import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Building2, GraduationCap, Package } from "lucide-react";

import { withRoleProtection } from "@/app/utils/withRoleProtection";

const stats = [
  {
    title: "Pacientes",
    value: "1,234",
    description: "Estudiantes activos",
    icon: Users,
  },
  {
    title: "Citas",
    value: "45",
    description: "Universidades registradas",
    icon: Building2,
  },
  {
    title: "Medicos",
    value: "120",
    description: "Carreras disponibles",
    icon: GraduationCap,
  },
  {
    title: "Consultas",
    value: "89",
    description: "Paquetes activos",
    icon: Package,
  },
];

export default withRoleProtection(HomePage, ["ADMIN"]);

function HomePage() {
  return (
      <div className="space-y-6" data-oid="-6urpd6">
        <div className="flex items-center justify-between" data-oid="5msdczt">
          <div className="w-full text-center" data-oid="vo2jd59">
  <h1
    className="text-3xl font-bold tracking-tight"
    data-oid="l21t9hz"
  >
    CENTRO DE CONVIVENCIA FAMILIAR
  </h1>
  <p className="text-muted-foreground" data-oid="962i1i7">
    Sistema de gestión para pacientes
  </p>
</div>

          <Button data-oid="m_zi38d">Ver Reportes</Button>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="bajs7n3"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="_n89fxa">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="iarl5mx"
              >
                <CardTitle className="text-sm font-medium" data-oid="7yqmhrj">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="-jzq88o"
                />
              </CardHeader>
              <CardContent data-oid="n2hbege">
                <div className="text-2xl font-bold" data-oid="s9p_n3o">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid="u7c6gvu">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
          data-oid="dlalawn"
        >
          <Card className="col-span-4" data-oid=".-w:zj7">
            <CardHeader data-oid="ro.t2ny">
              <CardTitle data-oid="lsku05m">Actividad Reciente</CardTitle>
              <CardDescription data-oid=":7j2c1-">
                Últimas actualizaciones en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent data-oid=":z47:ly">
              <div className="space-y-4" data-oid="9y8ajk7">
                <div className="flex items-center" data-oid="e-1fxu4">
                  <div className="ml-4 space-y-1" data-oid="6e:zm7n">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid=".rcxng:"
                    >
                      Nuevo Paciente registrado
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="aa1kp2a"
                    >
                      Juan Pérez se ha registrado en el sistema
                    </p>
                  </div>
                </div>
                <div className="flex items-center" data-oid="482-di4">
                  <div className="ml-4 space-y-1" data-oid="x7-t2f6">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid="ahqb_ob"
                    >
                      Pago procesado
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="tq61:3g"
                    >
                      Se ha procesado un pago por $1,500
                    </p>
                  </div>
                </div>
                <div className="flex items-center" data-oid="ky-:pw_">
                  <div className="ml-4 space-y-1" data-oid="bh:o.r_">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid="pp0a.--"
                    >
                      Nueva Cita agregada
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="s:.gfbv"
                    >
                      Universidad Tecnológica se ha agregado al sistema
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3" data-oid="oi_bz21">
            <CardHeader data-oid="1w5zd1t">
              <CardTitle data-oid="::7adrl">Próximos Eventos</CardTitle>
              <CardDescription data-oid="bnhraab">
                Eventos programados para los próximos días
              </CardDescription>
            </CardHeader>
            <CardContent data-oid="xf40-9u">
              <div className="space-y-4" data-oid="417e76n">
                <div className="flex items-center" data-oid="po1bw.v">
                  <div className="ml-4 space-y-1" data-oid="z2iei8l">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid="9_k6lc9"
                    >
                      Ceremonia de Graduación
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="hfgde72"
                    >
                      15 de Junio, 2024 - 10:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center" data-oid="fe-jqkj">
                  <div className="ml-4 space-y-1" data-oid="_fiqqxl">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid="a4xmb2k"
                    >
                      Entrega de Togas
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="h1ue9kr"
                    >
                      14 de Junio, 2024 - 2:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center" data-oid="ooer857">
                  <div className="ml-4 space-y-1" data-oid="r73l9fc">
                    <p
                      className="text-sm font-medium leading-none"
                      data-oid="v5wmk:b"
                    >
                      Sesión de Fotos
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="m.pt8:j"
                    >
                      13 de Junio, 2024 - 9:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
