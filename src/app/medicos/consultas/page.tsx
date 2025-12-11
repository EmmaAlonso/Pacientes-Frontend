"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

// ENUM DE TIPO DE SANGRE
const tiposSangre = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function MedicosConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  const [selectedConsulta, setSelectedConsulta] = useState<any>(null);

  // FORM DATA
  const [pacienteId, setPacienteId] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [tipoSangre, setTipoSangre] = useState("");
  const [alergias, setAlergias] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");

  const doctorId =
    (user?.medicoId ? Number(user.medicoId) : null) ||
    (typeof window !== "undefined"
      ? Number(localStorage.getItem("medicoId"))
      : null);

  // -----------------------------------------
  // CARGAR CONSULTAS
  // -----------------------------------------
  const loadConsultas = async () => {
    if (!doctorId) return;

    try {
      const res = await fetch(
        `http://localhost:3005/consultas/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setConsultas(data);
    } catch (err) {
      console.error("Error cargando consultas:", err);
    }
  };

  // -----------------------------------------
  // CARGAR PACIENTES
  // -----------------------------------------
  const loadPacientes = async () => {
    try {
      const res = await fetch("http://localhost:3005/api/patients/mine", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error("Error cargando pacientes:", err);
    }
  };

  useEffect(() => {
    loadPacientes();
    if (doctorId) loadConsultas();
  }, [doctorId]);

  // -----------------------------------------
  // CREAR CONSULTA
  // -----------------------------------------
  const crearConsulta = async () => {
    if (!doctorId) return alert("No se encontró el ID del médico.");

    try {
      const body = {
        pacienteId: Number(pacienteId),
        motivoConsulta,
        sintomas,
        tipoSangre,
        alergias,
        peso: peso ? Number(peso) : undefined,
        estatura: estatura ? Number(estatura) : undefined,
        tratamiento,
        observaciones,
      };

      await fetch("http://localhost:3005/consultas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      setModalOpen(false);
      loadConsultas();
    } catch (err) {
      console.error("Error creando consulta:", err);
    }
  };

  // -----------------------------------------
  // ABRIR MODAL DE VER
  // -----------------------------------------
  const verConsulta = (consulta: any) => {
    setSelectedConsulta(consulta);
    setModalVerOpen(true);
  };

  // -----------------------------------------
  // ABRIR MODAL DE EDITAR
  // -----------------------------------------
  const abrirEditarConsulta = (consulta: any) => {
    setSelectedConsulta(consulta);
    setPacienteId(consulta.pacienteId);
    setMotivoConsulta(consulta.motivoConsulta);
    setSintomas(consulta.sintomas);
    setTipoSangre(consulta.tipoSangre);
    setAlergias(consulta.alergias || "");
    setTratamiento(consulta.tratamiento);
    setObservaciones(consulta.observaciones || "");

    // load peso/estatura if present
    setPeso(consulta.peso !== undefined ? String(consulta.peso) : (consulta.weight !== undefined ? String(consulta.weight) : ""));
    setEstatura(consulta.estatura !== undefined ? String(consulta.estatura) : (consulta.height !== undefined ? String(consulta.height) : ""));

    setModalEditarOpen(true);
  };

  // -----------------------------------------
  // EDITAR CONSULTA
  // -----------------------------------------
  const guardarEdicion = async () => {
    if (!selectedConsulta) return;

    try {
      const body = {
        motivoConsulta,
        sintomas,
        tipoSangre,
        alergias,
        peso: peso ? Number(peso) : undefined,
        estatura: estatura ? Number(estatura) : undefined,
        tratamiento,
        observaciones,
      };

      await fetch(`http://localhost:3005/consultas/${selectedConsulta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      setModalEditarOpen(false);
      loadConsultas();
    } catch (err) {
      console.error("Error actualizando consulta:", err);
    }
  };

  // -----------------------------------------
  // ELIMINAR CONSULTA
  // -----------------------------------------
  const eliminarConsulta = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta consulta?")) return;

    try {
      await fetch(`http://localhost:3005/consultas/${id}`, {
        method: "DELETE",
      });

      loadConsultas();
    } catch (err) {
      console.error("Error eliminando consulta:", err);
    }
  };

  // -----------------------------------------
  // RENDER
  // -----------------------------------------
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Consultas Médicas</h1>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:opacity-90">Nueva Consulta</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva consulta</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <select
                className="w-full border p-2 rounded"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}
                  </option>
                ))}
              </select>

              <Textarea
                placeholder="Motivo de la consulta"
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
              />

              <Textarea
                placeholder="Síntomas"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Peso (kg)"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />
                <Input
                  placeholder="Estatura (cm)"
                  value={estatura}
                  onChange={(e) => setEstatura(e.target.value)}
                />
              </div>

              <select
                className="w-full border p-2 rounded"
                value={tipoSangre}
                onChange={(e) => setTipoSangre(e.target.value)}
              >
                <option value="">Tipo de sangre</option>
                {tiposSangre.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <Input
                placeholder="Alergias"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
              />

              <Textarea
                placeholder="Tratamiento"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
              />

              <Textarea
                placeholder="Observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />

              <Button className="w-full bg-green-600" onClick={crearConsulta}>
                Guardar consulta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ------------ LISTADO ------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultas.map((consulta: any) => (
          <Card key={consulta.id} className="shadow">
            <CardHeader>
              <CardTitle>Consulta #{consulta.id}</CardTitle>
            </CardHeader>

            <CardContent>
              <p>
                <strong>Paciente:</strong>{" "}
                {consulta.patient?.nombre} {consulta.patient?.apellidoPaterno}
              </p>
              <p>
                <strong>Motivo:</strong> {consulta.motivoConsulta}
              </p>
              <p>
                <strong>Síntomas:</strong> {consulta.sintomas}
              </p>
              <p>
                <strong>Tipo de sangre:</strong> {consulta.tipoSangre}
              </p>
              <p>
                <strong>Peso:</strong> {consulta.peso ?? consulta.weight ?? '-'} {consulta.peso ? 'kg' : ''}
              </p>
              <p>
                <strong>Estatura:</strong> {consulta.estatura ?? consulta.height ?? '-'} {consulta.estatura ? 'cm' : ''}
              </p>
              <p>
                <strong>Tratamiento:</strong> {consulta.tratamiento}
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={() => verConsulta(consulta)}>
                Ver
              </Button>

              <Button
                className="bg-black text-white hover:opacity-90"
                onClick={() => abrirEditarConsulta(consulta)}
              >
                Editar
              </Button>

              <Button
                className="bg-red-600 text-white"
                onClick={() => eliminarConsulta(consulta.id)}
              >
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ---------------- MODAL VER ---------------- */}
      {selectedConsulta && (
        <Dialog open={modalVerOpen} onOpenChange={setModalVerOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la consulta</DialogTitle>
            </DialogHeader>

            <div>
              <p><strong>ID:</strong> {selectedConsulta.id}</p>
              <p>
                <strong>Paciente:</strong>{" "}
                {selectedConsulta.patient?.nombre}{" "}
                {selectedConsulta.patient?.apellidoPaterno}
              </p>
              <p><strong>Peso:</strong> {selectedConsulta.peso ?? selectedConsulta.weight ?? '-'} {selectedConsulta.peso ? 'kg' : ''}</p>
              <p><strong>Estatura:</strong> {selectedConsulta.estatura ?? selectedConsulta.height ?? '-'} {selectedConsulta.estatura ? 'cm' : ''}</p>
              <p><strong>Motivo:</strong> {selectedConsulta.motivoConsulta}</p>
              <p><strong>Síntomas:</strong> {selectedConsulta.sintomas}</p>
              <p><strong>Tipo de sangre:</strong> {selectedConsulta.tipoSangre}</p>
              <p><strong>Alergias:</strong> {selectedConsulta.alergias}</p>
              <p><strong>Tratamiento:</strong> {selectedConsulta.tratamiento}</p>
              <p><strong>Observaciones:</strong> {selectedConsulta.observaciones}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ---------------- MODAL EDITAR ---------------- */}
      {selectedConsulta && (
        <Dialog open={modalEditarOpen} onOpenChange={setModalEditarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar consulta #{selectedConsulta.id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Textarea
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
              />

              <Textarea
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />
                <Input
                  value={estatura}
                  onChange={(e) => setEstatura(e.target.value)}
                />
              </div>

              <select
                className="w-full border p-2 rounded"
                value={tipoSangre}
                onChange={(e) => setTipoSangre(e.target.value)}
              >
                {tiposSangre.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <Input
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
              />

              <Textarea
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
              />

              <Textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />

              <Button className="w-full bg-green-600" onClick={guardarEdicion}>
                Guardar cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
