"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Paperclip,
  FileText,
  CheckCircle2,
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

interface Attachment {
  id: string;
  name: string;
  type: string;
  uploader: string;
  date: string;
  status: "available" | "deleted";
}

// Mock data
const attachments: Attachment[] = [
  {
    id: "1",
    name: "ComprobantePago.pdf",
    type: "PDF",
    uploader: "Juan Pérez",
    date: "2024-06-01",
    status: "available",
  },
  {
    id: "2",
    name: "FotoGraduacion.jpg",
    type: "Imagen",
    uploader: "Ana Gómez",
    date: "2024-06-03",
    status: "available",
  },
  {
    id: "3",
    name: "Contrato.docx",
    type: "Word",
    uploader: "Carlos Ruiz",
    date: "2024-06-05",
    status: "deleted",
  },
];

const stats = [
  {
    title: "Total Adjuntos",
    value: attachments.length,
    icon: Paperclip,
    description: "Archivos adjuntos registrados",
  },
  {
    title: "Disponibles",
    value: attachments.filter((a) => a.status === "available").length,
    icon: CheckCircle2,
    description: "Archivos disponibles",
  },
  {
    title: "Eliminados",
    value: attachments.filter((a) => a.status === "deleted").length,
    icon: XCircle,
    description: "Archivos eliminados",
  },
  {
    title: "Tipos",
    value: new Set(attachments.map((a) => a.type)).size,
    icon: FileText,
    description: "Tipos de archivo",
  },
];

type SortField = "name" | "type" | "uploader" | "date" | "status";
type SortOrder = "asc" | "desc";
type AttachmentType = "PDF" | "Imagen" | "Word";
type AttachmentStatus = "available" | "deleted";

export default function AdjuntosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTypes, setSelectedTypes] = useState<AttachmentType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AttachmentStatus[]>(
    []
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleType = (type: AttachmentType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStatus = (status: AttachmentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredAndSortedAttachments = attachments
    .filter((attachment) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        attachment.name.toLowerCase().includes(searchLower) ||
        attachment.type.toLowerCase().includes(searchLower) ||
        attachment.uploader.toLowerCase().includes(searchLower) ||
        (attachment.status === "available"
          ? "disponible"
          : "eliminado"
        ).includes(searchLower);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(attachment.type as AttachmentType);
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(attachment.status);

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
        case "status":
          aValue = a.status === "available" ? "disponible" : "eliminado";
          bValue = b.status === "available" ? "disponible" : "eliminado";
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
    <Layout data-oid="enturbs">
      <div className="space-y-6" data-oid="9w-bhy2">
        <div className="flex items-center justify-between" data-oid="lar1px3">
          <div className="w-full text-center" data-oid="vo2jd59">
            <h1
              className="text-3xl font-bold tracking-tight"
              data-oid="l21t9hz"
            >
              Adjuntos
            </h1>
            <p className="text-muted-foreground" data-oid="962i1i7">
              Gestiona los archivos adjuntos del sistema
            </p>
          </div>

          <Button data-oid="quaz3mq">
            <Plus className="mr-2 h-4 w-4" data-oid="3dx8.ij" />
            Nuevo Adjunto
          </Button>
        </div>

        <div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          data-oid="mc6tm04"
        >
          {stats.map((stat) => (
            <Card key={stat.title} data-oid="lpgu5d9">
              <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                data-oid="c6g9lyn"
              >
                <CardTitle className="text-sm font-medium" data-oid="vwlqtmc">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className="h-4 w-4 text-muted-foreground"
                  data-oid="l2f2.nh"
                />
              </CardHeader>
              <CardContent data-oid="cka2ji_">
                <div className="text-2xl font-bold" data-oid="oet:z46">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground" data-oid="z6xrlq2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4" data-oid="r:_m4j_">
          <div className="relative flex-1" data-oid="g1em5kl">
            <Search
              className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
              data-oid="00.ja.y"
            />
            <Input
              placeholder="Buscar adjuntos..."
              className="pl-8"
              data-oid="_g6uyi7"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSort("name")}
              className="flex items-center gap-2"
            >
              Nombre
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
                    checked={selectedTypes.includes("PDF")}
                    onCheckedChange={() => toggleType("PDF")}
                  >
                    PDF
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Imagen")}
                    onCheckedChange={() => toggleType("Imagen")}
                  >
                    Imagen
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes("Word")}
                    onCheckedChange={() => toggleType("Word")}
                  >
                    Word
                  </DropdownMenuCheckboxItem>
                </div>
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Estado</h4>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("available")}
                    onCheckedChange={() => toggleStatus("available")}
                  >
                    Disponible
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes("deleted")}
                    onCheckedChange={() => toggleStatus("deleted")}
                  >
                    Eliminado
                  </DropdownMenuCheckboxItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border" data-oid="uu7c.qs">
          <Table data-oid="77:emk9">
            <TableHeader data-oid="6zdv-dn">
              <TableRow data-oid="je1v-6.">
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                  data-oid="wlq6:ua"
                >
                  <div className="flex items-center">
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("type")}
                  data-oid="kh8c2o3"
                >
                  <div className="flex items-center">
                    Tipo
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("uploader")}
                  data-oid="6.h1cyu"
                >
                  <div className="flex items-center">
                    Subido por
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                  data-oid="6utqh29"
                >
                  <div className="flex items-center">
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                  data-oid="8ljqv20"
                >
                  <div className="flex items-center">
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right" data-oid="604nheo">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody data-oid="6h837h:">
              {filteredAndSortedAttachments.map((attachment) => (
                <TableRow key={attachment.id} data-oid="uu1fshk">
                  <TableCell className="font-medium" data-oid="tz:667o">
                    {attachment.name}
                  </TableCell>
                  <TableCell data-oid="dlvh2qu">{attachment.type}</TableCell>
                  <TableCell data-oid="5kwo5mw">
                    {attachment.uploader}
                  </TableCell>
                  <TableCell data-oid="g6_._m-">
                    {new Date(attachment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell data-oid="f9-3aa7">
                    <Badge
                      className={
                        attachment.status === "available"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                      data-oid="nqzh5-z"
                    >
                      {attachment.status === "available"
                        ? "Disponible"
                        : "Eliminado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" data-oid="jgdn487">
                    <Button variant="ghost" size="sm" data-oid="cmssgu8">
                      Ver detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
