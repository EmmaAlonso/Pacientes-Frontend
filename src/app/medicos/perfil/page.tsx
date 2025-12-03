"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { withRoleProtection } from "@/app/utils/withRoleProtection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Briefcase, Award, Clock, Edit, Save } from "lucide-react";
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
      // Usar getMe() para obtener el médico autenticado
      const data = await MedicosApi.getMe();
      setMedico(data);
      setFormData(data);
    } catch (error) {
      console.error("Error cargando perfil del backend:", error);
      
      // Fallback: crear objeto médico con datos del JWT
      if (user) {
        const fallbackMedico: Medico = {
          id: user.sub || 0,
          nombre: user.nombre || "Médico",
          email: user.email || "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          especialidad: "",
          telefono: "",
          consultorio: "",
          createdAt: new Date().toISOString(),
        };
        
        console.warn("Usando datos de fallback desde el JWT");
        setMedico(fallbackMedico);
        setFormData(fallbackMedico);
        toast.info("Cargando datos básicos desde tu sesión. Por favor completa tu perfil.");
      } else {
        toast.error("No se pudo cargar la información del perfil. Por favor intenta de nuevo.");
      }
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

  const initials = `${medico.nombre?.charAt(0)}${medico.apellidoPaterno?.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ENCABEZADO CON INFORMACIÓN PRINCIPAL */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-10"></div>
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="pt-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* AVATAR */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32 border-4 border-blue-500 shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${medico.nombre}`} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* INFORMACIÓN PRINCIPAL */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Dr. {medico.nombre} {medico.apellidoPaterno}
                    </h1>
                    {medico.especialidad && (
                      <Badge className="bg-blue-100 text-blue-800 text-base px-4 py-2 mb-3">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {medico.especialidad}
                      </Badge>
                    )}
                  </div>

                  {/* CONTACTO RÁPIDO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{medico.email}</span>
                    </div>
                    {medico.telefono && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{medico.telefono}</span>
                      </div>
                    )}
                    {medico.consultorio && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Consultorio {medico.consultorio}</span>
                      </div>
                    )}
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex gap-3">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRID DE INFORMACIÓN PROFESIONAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* INFORMACIÓN PERSONAL */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre || ""}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno</label>
                    <input
                      type="text"
                      value={formData.apellidoPaterno || ""}
                      onChange={(e) => handleInputChange("apellidoPaterno", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                    <input
                      type="text"
                      value={formData.apellidoMaterno || ""}
                      onChange={(e) => handleInputChange("apellidoMaterno", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {medico.nombre} {medico.apellidoPaterno} {medico.apellidoMaterno || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">{medico.email}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* INFORMACIÓN PROFESIONAL */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Credenciales Profesionales
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                    <input
                      type="text"
                      value={formData.especialidad || ""}
                      onChange={(e) => handleInputChange("especialidad", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultorio</label>
                    <input
                      type="text"
                      value={formData.consultorio || ""}
                      onChange={(e) => handleInputChange("consultorio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Especialidad</p>
                    <p className="text-lg font-semibold text-gray-900">{medico.especialidad || "No registrada"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultorio</p>
                    <p className="text-lg font-semibold text-gray-900">{medico.consultorio || "No registrado"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* INFORMACIÓN DE CONTACTO */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono || ""}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="text-lg font-semibold text-gray-900">{medico.telefono || "No registrado"}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SECCIÓN DE HORARIOS DE ATENCIÓN */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios de Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{day}</span>
                  <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4 p-3 bg-yellow-50 rounded-lg">
              💡 Próximamente podrás editar tus horarios de atención personalizados
            </p>
          </CardContent>
        </Card>

        {/* SECCIÓN DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Pacientes Atendidos", value: "156", icon: "👥" },
            { label: "Consultas Este Mes", value: "28", icon: "📋" },
            { label: "Citas Programadas", value: "12", icon: "📅" },
            { label: "Calificación", value: "4.8/5", icon: "⭐" },
          ].map((stat, idx) => (
            <Card key={idx} className="shadow-lg border-0">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BOTÓN CERRAR SESIÓN */}
        <div className="flex justify-center pt-4">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-2">
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withRoleProtection(PerfilMedicoPage, ["MEDICO"]);
