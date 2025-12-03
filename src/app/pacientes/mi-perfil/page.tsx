"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MiPerfilPage() {
  const { user } = useAuth();

  if (!user) return <p>Cargando...</p>;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> Paciente</p>
      </CardContent>
    </Card>
  );
}
