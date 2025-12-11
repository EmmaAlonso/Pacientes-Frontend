"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConsultasApi } from "@/modules/consultas/services/consultas.api";
import { Consulta } from "@/modules/consultas/types/consulta.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/Toast";

export default function PacienteConsultasPage() {
	const { user } = useAuth();
	const [consultas, setConsultas] = useState<Consulta[]>([]);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<Consulta | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

	const fetch = async () => {
		try {
			if (user?.rol === "PACIENTE") {
				// Paciente → usar endpoint dedicado
				const my = await ConsultasApi.getMine();
				setConsultas(my);
			} else {
				const data = await ConsultasApi.getAll();
				setConsultas(data);
			}
		} catch (err) {
			console.error(err);
			showToast("Error al cargar consultas", "error");
		}
	};

	useEffect(() => { fetch(); }, [user]);

	const filtered = consultas.filter((c) => {
		const t = search.toLowerCase();
		return (
			c.medico?.nombre.toLowerCase().includes(t) ||
			(c.medico?.apellidoPaterno || "").toLowerCase().includes(t) ||
			(c.motivo || "").toLowerCase().includes(t) ||
			(c.diagnostico || "").toLowerCase().includes(t)
		);
	});

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Mis Consultas</h1>
				<div className="relative w-1/3">
					<Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
					<Input className="pl-8" placeholder="Buscar consultas..." value={search} onChange={(e) => setSearch(e.target.value)} />
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha</TableHead>
							<TableHead>Médico</TableHead>
							<TableHead>Motivo</TableHead>
							<TableHead>Diagnóstico</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((c) => (
							<TableRow key={c.id}>
								<TableCell>{new Date(c.fecha).toLocaleString()}</TableCell>
								<TableCell>{c.medico?.nombre} {(c.medico?.apellidoPaterno || '')}</TableCell>
								<TableCell>{c.motivo || '-'}</TableCell>
								<TableCell>{c.diagnostico || '-'}</TableCell>
								<TableCell className="text-right">
									<Button variant="ghost" size="sm" onClick={() => { setSelected(c); setIsViewOpen(true); }}>Ver</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader><DialogTitle>Detalle de Consulta</DialogTitle></DialogHeader>
					{selected && (
						<div className="space-y-3">
							<div><strong>Fecha:</strong> {new Date(selected.fecha).toLocaleString()}</div>
							<div><strong>Médico:</strong> {selected.medico?.nombre} - {selected.medico?.especialidad || '-'}</div>
							<div><strong>Motivo:</strong><p className="whitespace-pre-wrap">{selected.motivo}</p></div>
							<div><strong>Diagnóstico:</strong><p className="whitespace-pre-wrap">{selected.diagnostico || '-'}</p></div>
							<div><strong>Tratamiento:</strong><p className="whitespace-pre-wrap">{selected.tratamiento || '-'}</p></div>
							<div><strong>Observaciones:</strong><p className="whitespace-pre-wrap">{selected.observaciones || '-'}</p></div>
							<div className="flex justify-end pt-4"><Button variant="outline" onClick={() => { setIsViewOpen(false); setSelected(null); }}>Cerrar</Button></div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</main>
	);
}

