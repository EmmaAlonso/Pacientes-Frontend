"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Edit,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { MedicosApi } from "@/modules/medicos/services/medicos.api";
import { Medico } from "@/modules/medicos/types/medico.types";

function PerfilMedicoPage() {
  const { user } = useAuth();
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Medico>>({});

  useEffect(() => {
    if (!user) return;
    fetchMedicoData();
  }, [user]);

  const fetchMedicoData = async () => {
    try {
      setLoading(true);
      const data = await MedicosApi.getMe();
      setMedico(data);
      setFormData(data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      toast.error("No se pudo cargar la información del perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!medico?.id) return;
      await MedicosApi.update(medico.id, formData);
      setMedico({ ...medico, ...formData });
      setIsEditing(false);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      toast.error("Error al guardar los cambios");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!medico) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No se encontró información del médico</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* INFORMACIÓN PRINCIPAL */}
        <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
          <CardContent className="py-10 px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-semibold text-gray-900">
                Dr. {medico.nombre} {medico.apellidoPaterno} {medico.apellidoMaterno}
              </h1>
              {medico.especialidad && (
                <Badge className="bg-black-100 text-blue-800 text-base px-4 py-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {medico.especialidad}
                </Badge>
              )}

              <div className="mt-6 space-y-3 text-gray-700">
                <div className="flex justify-center items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{medico.usuario?.email}</span>
                </div>
                {medico.telefono && (
                  <div className="flex justify-center items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>{medico.telefono}</span>
                  </div>
                )}
                {medico.consultorio && (
                  <div className="flex justify-center items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Consultorio {medico.consultorio}</span>
                  </div>
                )}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="mt-8 flex justify-center gap-4">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(medico);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HORARIOS DE ATENCIÓN */}
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-gradient-to-r from-black-500 to-black-600 text-black rounded-t-xl text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-2">
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <div
                  key={day}
                  className="flex justify-between w-80 p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withRoleProtection(PerfilMedicoPage, ["MEDICO"]);
