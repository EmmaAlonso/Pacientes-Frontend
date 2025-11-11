"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Cita } from "@/modules/citas/types/cita.types";

export default function CitaDetallePage() {
  const params = useParams();
  const id = Number(params?.id);
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      CitasApi.getById(id)
        .then((data) => setCita(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!cita) {
    return <p className="text-center mt-10 text-gray-600">Cita no encontrada.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Link href="/admin/citas">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Regresar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Paciente:</strong> {cita.paciente?.nombre} {(cita.paciente?.apellidoPaterno || '') + (cita.paciente?.apellidoPaterno && cita.paciente?.apellidoMaterno ? ' ' : '') + (cita.paciente?.apellidoMaterno || '')}
          </p>
          <p>
            <strong>Médico:</strong> {cita.medico?.nombre} {(cita.medico?.apellidoPaterno || '') + (cita.medico?.apellidoPaterno && cita.medico?.apellidoMaterno ? ' ' : '') + (cita.medico?.apellidoMaterno || '')}
          </p>
          <p>
            <strong>Fecha solicitada:</strong> {new Date(cita.fechaDeseada).toLocaleString()}
          </p>
          <p>
            <strong>Fecha cita:</strong> {cita.fechaCita ? new Date(cita.fechaCita).toLocaleString() : '-'}
          </p>
          <p>
            <strong>Motivo:</strong> {cita.motivo || '-'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
