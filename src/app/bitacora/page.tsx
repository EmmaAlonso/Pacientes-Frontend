"use client";

import React, { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import {
  Search,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

interface LogEntry {
  id: string;
  user: string;
  action: string;
  date: string;
  status: "success" | "error" | "warning";
}

// Mock data
const logs: LogEntry[] = [
  {
    id: "1",
    user: "Kevin Luciano",
    action: "Creó un nuevo usuario",
    date: "2024-06-01",
    status: "success",
  },
  {
    id: "2",
    user: "Ana Gómez",
    action: "Intentó eliminar un pago",
    date: "2024-06-03",
    status: "error",
  },
  {
    id: "3",
    user: "Carlos Ruiz",
    action: "Actualizó datos de estudiante",
    date: "2024-06-05",
    status: "warning",
  },
];

const statusConfig = {
  success: { label: "Éxito", color: "bg-green-500", icon: CheckCircle2 },
  error: { label: "Error", color: "bg-red-500", icon: XCircle },
  warning: { label: "Advertencia", color: "bg-yellow-500", icon: AlertCircle },
} as const;

const stats = [
  {
    title: "Total Registros",
    value: logs.length,
    icon: History,
    description: "Eventos registrados en la bitácora",
  },
  {
    title: "Éxitos",
    value: logs.filter((l) => l.status === "success").length,
    icon: CheckCircle2,
    description: "Acciones exitosas",
  },
  {
    title: "Errores",
    value: logs.filter((l) => l.status === "error").length,
    icon: XCircle,
    description: "Acciones con error",
  },
  {
    title: "Advertencias",
    value: logs.filter((l) => l.status === "warning").length,
    icon: AlertCircle,
    description: "Acciones con advertencia",
  },
];

export default function BitacoraPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LogEntry;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredAndSortedLogs = useMemo(() => {
    let filteredLogs = [...logs];

    // Aplicar búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.user.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.date.toLowerCase().includes(query) ||
          statusConfig[log.status].label.toLowerCase().includes(query)
      );
    }

    // Aplicar ordenamiento
    if (sortConfig) {
      filteredLogs.sort((a, b) => {
        if (sortConfig.key === "status") {
          const statusA = statusConfig[a.status].label;
          const statusB = statusConfig[b.status].label;
          return sortConfig.direction === "asc"
            ? statusA.localeCompare(statusB)
            : statusB.localeCompare(statusA);
        }

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filteredLogs;
  }, [searchQuery, sortConfig]);

  const requestSort = (key: keyof LogEntry) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort?.key === key && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <Layout data-oid="8qzq::5">
      <div className="space-y-6" data-oid="mqb5oun">
        <div className="flex items-center justify-between" data-oid=".9fh-aq">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Bitácora
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Consulta el historial de acciones y eventos del sistema
            </p>
          </div>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="s9f5m-w"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="wm.xrxo">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="jf2jg-l"
              >
                <CardTitle className="text-sm font-medium" data-oid="ftvr-wu">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="ldevwma"
                />
              </CardHeader>
              <CardContent data-oid="lm:7x5y">
                <div className="text-2xl font-bold" data-oid="sqdmpha">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid="85vlawq">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4" data-oid="6t7k-5n">
          <div className="relative flex-1" data-oid="sj5ldhy">
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="mom6v_i"
            />
            <Input
              placeholder="Buscar en la bitácora..."
              className="pl-8"
              data-oid="1y2lgju"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border" data-oid="tfwxk9p">
          <Table data-oid="j-opr2x">
            <TableHeader data-oid="t4q5gtv">
              <TableRow data-oid="1uwbjl8">
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("user")}
                  data-oid="n_9aehe"
                >
                  <div className="flex items-center gap-1">
                    Usuario
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("action")}
                  data-oid="h5t:k1w"
                >
                  <div className="flex items-center gap-1">
                    Acción
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("date")}
                  data-oid="m9ktjsa"
                >
                  <div className="flex items-center gap-1">
                    Fecha
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => requestSort("status")}
                  data-oid="cihdfu6"
                >
                  <div className="flex items-center gap-1">
                    Estado
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-oid="wvuikjw">
              {filteredAndSortedLogs.map((log) => {
                const Icon = statusConfig[log.status].icon;
                return (
                  <TableRow key={log.id} data-oid="op_2rwe">
                    <TableCell className="font-medium" data-oid="mrlxc0k">
                      {log.user}
                    </TableCell>
                    <TableCell data-oid="__tqm_l">{log.action}</TableCell>
                    <TableCell data-oid="-4i8pnf">
                      {new Date(log.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell data-oid="cs68t00">
                      <Badge
                        className={
                          statusConfig[log.status].color +
                          " flex items-center gap-1"
                        }
                        data-oid="wuetr.x"
                      >
                        <Icon className="h-4 w-4" data-oid="urbpn6_" />
                        {statusConfig[log.status].label}
                      </Badge>
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
