"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { Consulta } from "@/modules/consultas/types/consulta.types";

export default function ConsultaDetallePage() {
  const params = useParams();
  const id = Number(params?.id);
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ConsultasApi.getById(id)
        .then((data) => setConsulta(data))
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

  if (!consulta) {
    return <p className="text-center mt-10 text-gray-600">Consulta no encontrada.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Link href="/admin/consultas">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Regresar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Consulta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Paciente:</strong> {consulta.paciente?.nombre} {consulta.paciente?.apellidoPaterno} {consulta.paciente?.apellidoMaterno}</p>
          <p><strong>Médico:</strong> {consulta.medico?.nombre} {consulta.medico?.apellidoPaterno} {consulta.medico?.apellidoMaterno}</p>
          <p><strong>Fecha:</strong> {new Date(consulta.fecha).toLocaleString()}</p>
          <p><strong>Motivo de consulta:</strong> {consulta.motivo}</p>
          <p><strong>Estado:</strong> {consulta.estado}</p>
          <p><strong>Diagnóstico:</strong> {consulta.diagnostico || "Pendiente"}</p>
          <p><strong>Tratamiento:</strong> {consulta.tratamiento || "Pendiente"}</p>
          <p><strong>Observaciones:</strong> {consulta.observaciones || "Ninguna"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
