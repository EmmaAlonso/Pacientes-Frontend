"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { Cita } from "@/modules/citas/types/cita.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewCitaForm } from "@/modules/citas/components/NewCitaForm";
import { showToast } from "@/components/ui/Toast";

export default function PacienteCitasPage() {
	const { user } = useAuth();
	const [citas, setCitas] = useState<Cita[]>([]);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [selected, setSelected] = useState<Cita | null>(null);
	const [search, setSearch] = useState("");

	const fetch = async () => {
		try {
			const data = await CitasApi.getAll();
			if (user?.rol === "PACIENTE") {
				setCitas(data.filter((c) => c.paciente?.id === user.sub));
			} else {
				setCitas(data);
			}
		} catch (err) {
			console.error(err);
			showToast("Error al cargar citas", "error");
		}
	};

	useEffect(() => { fetch(); }, [user]);

	const handleCreateOpen = () => {
		setSelected(user ? ({ paciente: { id: user.sub } } as any) : null);
		setIsCreateOpen(true);
	};

	const handleEdit = (c: Cita) => { setSelected(c); setIsEditOpen(true); };
	const handleView = (c: Cita) => { setSelected(c); setIsViewOpen(true); };

	const handleDelete = async (c: Cita) => {
		const ok = confirm("¿Eliminar cita?");
		if (!ok) return;
		try { await CitasApi.delete(c.id); showToast("Cita eliminada", "success"); fetch(); } catch (err) { console.error(err); showToast("Error al eliminar", "error"); }
	};

	const onSuccess = () => { setIsCreateOpen(false); setIsEditOpen(false); setSelected(null); fetch(); };

	const filtered = citas.filter((c) => {
		const t = search.toLowerCase();
		return (
			c.medico?.nombre.toLowerCase().includes(t) ||
			(c.medico?.apellidoPaterno || "").toLowerCase().includes(t) ||
			(c.medico?.apellidoMaterno || "").toLowerCase().includes(t) ||
			(c.especialidad || "").toLowerCase().includes(t) ||
			(c.motivo || "").toLowerCase().includes(t)
		);
	});

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Mis Citas</h1>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
						<Input className="pl-8" placeholder="Buscar citas..." value={search} onChange={(e) => setSearch(e.target.value)} />
					</div>
					<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
						<DialogTrigger asChild>
							<Button onClick={handleCreateOpen}><Plus className="mr-2 h-4 w-4" />Nueva Cita</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]">
							<DialogHeader><DialogTitle>Registrar Nueva Cita</DialogTitle></DialogHeader>
							<NewCitaForm onSuccess={onSuccess} onCancel={() => setIsCreateOpen(false)} cita={selected ?? undefined} />
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Fecha solicitada</TableHead>
							<TableHead>Fecha cita</TableHead>
							<TableHead>Médico</TableHead>
							<TableHead>Especialidad</TableHead>
							<TableHead>Motivo</TableHead>
							<TableHead className="text-right">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((c) => (
							<TableRow key={c.id}>
								<TableCell>{new Date(c.fechaDeseada).toLocaleString()}</TableCell>
								<TableCell>{c.fechaCita ? new Date(c.fechaCita).toLocaleString() : '-'}</TableCell>
								<TableCell>{c.medico?.nombre} {(c.medico?.apellidoPaterno || '')}</TableCell>
								<TableCell>{c.especialidad || '-'}</TableCell>
								<TableCell>{c.motivo || '-'}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button variant="ghost" size="sm" onClick={() => handleView(c)}>Ver</Button>
										<Button variant="outline" size="sm" onClick={() => handleEdit(c)}>Editar</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(c)}>Eliminar</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Edit dialog */}
			<Dialog open={isEditOpen} onOpenChange={(open) => { if (!open) { setIsEditOpen(false); setSelected(null); } }}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader><DialogTitle>Editar Cita</DialogTitle></DialogHeader>
					{selected && <NewCitaForm cita={selected} onSuccess={onSuccess} onCancel={() => { setIsEditOpen(false); setSelected(null); }} />}
				</DialogContent>
			</Dialog>

			{/* View dialog */}
			<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader><DialogTitle>Detalles de la Cita</DialogTitle></DialogHeader>
					{selected && (
						<div className="space-y-3">
							<div><strong>Fecha solicitada:</strong> {new Date(selected.fechaDeseada).toLocaleString()}</div>
							<div><strong>Fecha cita:</strong> {selected.fechaCita ? new Date(selected.fechaCita).toLocaleString() : '-'}</div>
							<div><strong>Médico:</strong> {selected.medico?.nombre} - {selected.medico?.especialidad || '-'}</div>
							<div><strong>Motivo:</strong><p className="whitespace-pre-wrap">{selected.motivo || '-'}</p></div>
							<div className="flex justify-end gap-2 pt-4">
								<Button variant="outline" onClick={() => { setIsViewOpen(false); setSelected(null); }}>Cerrar</Button>
								<Button onClick={() => { setIsViewOpen(false); setIsEditOpen(true); }}>Editar</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</main>
	);
}

