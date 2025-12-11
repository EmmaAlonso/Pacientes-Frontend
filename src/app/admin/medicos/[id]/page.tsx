"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, CalendarDays, Users } from "lucide-react";
import { MedicosApi } from "@/modules/medicos/services/medicos.api";
import { Medico } from "@/modules/medicos/types/medico.types";

export default function MedicoDetallePage() {
  const params = useParams();
  const id = Number(params?.id);
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      MedicosApi.getById(id)
        .then((data) => setMedico(data))
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

  if (!medico) {
    return <p className="text-center mt-10 text-gray-600">Médico no encontrado.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/medicos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Regresar
          </Button>
        </Link>

       
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Nombre:</strong> {medico.nombre}{" "}
            {(medico.apellidoPaterno || "") +
              (medico.apellidoPaterno && medico.apellidoMaterno ? " " : "") +
              (medico.apellidoMaterno || "")}
          </p>
          <p>
            <strong>Especialidad:</strong> {medico.especialidad}
          </p>
          <p>
            <strong>Email:</strong> {medico.email || medico.usuario?.email || '-'}
          </p>
          <p>
            <strong>Teléfono:</strong> {medico.telefono}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
