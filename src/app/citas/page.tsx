"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, CalendarCheck, Users, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CitasApi } from "@/modules/citas/services/citas.api";
import { NewCitaForm } from "@/modules/citas/components/NewCitaForm";
import { Cita } from "@/modules/citas/types/cita.types";
import { showToast } from "@/components/ui/Toast";
import { ModalConfirm } from "@/components/ui/ModalConfirm";

export default function CitasPage() {
	const [citas, setCitas] = useState<Cita[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [citaToDelete, setCitaToDelete] = useState<Cita | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const fetchCitas = async () => {
		try {
			const data = await CitasApi.getAll();
			setCitas(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => { fetchCitas(); }, []);

	const handleCreated = () => { setIsModalOpen(false); fetchCitas(); };

	const filtered = citas.filter(c => {
		const t = searchTerm.toLowerCase();
		return (
			c.paciente.nombre.toLowerCase().includes(t) ||
			(c.paciente.apellidoPaterno || '').toLowerCase().includes(t) ||
			(c.paciente.apellidoMaterno || '').toLowerCase().includes(t) ||
			c.paciente.email.toLowerCase().includes(t) ||
			c.medico.nombre.toLowerCase().includes(t) ||
			(c.medico.apellidoPaterno || '').toLowerCase().includes(t) ||
			(c.medico.apellidoMaterno || '').toLowerCase().includes(t) ||
			(c.especialidad || '').toLowerCase().includes(t) ||
			(c.motivo || '').toLowerCase().includes(t) ||
			(c.consultorio || '').toLowerCase().includes(t) ||
			(c.telefono || '').toLowerCase().includes(t)
		);
	});

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const stats = [
		{ title: 'Citas totales', value: citas.length, icon: CalendarCheck, description: 'Citas registradas' },
		{ title: 'Pacientes', value: new Set(citas.map(c => c.paciente.id)).size, icon: Users, description: 'Pacientes con citas' },
		{ title: 'Médicos', value: new Set(citas.map(c => c.medico.id)).size, icon: Stethoscope, description: 'Médicos con citas' },
		{ title: 'Próximas citas', value: citas.filter(c => new Date(c.fechaCita) > new Date()).length, icon: CalendarCheck, description: 'Citas próximas' },
	];

		const handleView = (c: Cita) => { setSelectedCita(c); setIsViewOpen(true); };
		const handleEdit = (c: Cita) => { setSelectedCita(c); setIsEditOpen(true); };

	const handleDelete = async (c: Cita) => {
		setCitaToDelete(c);
		setIsConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (!citaToDelete) return;
		setIsConfirmOpen(false);
		try { await CitasApi.delete(citaToDelete.id); showToast('Cita eliminada','success'); fetchCitas(); } catch (err) { console.error(err); showToast('Error al eliminar','error'); }
		setCitaToDelete(null);
	};

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div className="w-full text-center"><h1 className="text-3xl font-bold tracking-tight">Citas</h1></div>

					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger asChild>
							<Button><Plus className="mr-2 h-4 w-4"/>Nueva Cita</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Registrar Nueva Cita</DialogTitle></DialogHeader>
							<NewCitaForm onSuccess={handleCreated} onCancel={() => setIsModalOpen(false)} />
						</DialogContent>
					</Dialog>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{stats.map(s => (
						<Card key={s.title}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{s.title}</CardTitle><s.icon className="h-4 w-4 text-muted-foreground"/></CardHeader>
							<CardContent><div className="text-2xl font-bold">{s.value}</div><p className="text-xs text-muted-foreground">{s.description}</p></CardContent>
						</Card>
					))}
				</div>

				<div className="flex items-center gap-4">
					<div className="relative flex-1"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/><Input placeholder="Buscar citas..." className="pl-8" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} /></div>
					<Button variant="outline">Filtros</Button>
				</div>

				<div className="rounded-md border">
		 			<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Fecha Solicitada</TableHead>
								<TableHead>Fecha Cita</TableHead>
								<TableHead>Paciente</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Médico</TableHead>
								<TableHead>Especialidad</TableHead>
								<TableHead>Motivo</TableHead>
								<TableHead>Consultorio</TableHead>
								<TableHead>Teléfono</TableHead>
								<TableHead className="text-right">Acciones</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{current.map(c => (
								<TableRow key={c.id}>
									<TableCell>{new Date(c.fechaDeseada).toLocaleString()}</TableCell>
									<TableCell>{c.fechaCita ? new Date(c.fechaCita).toLocaleString() : '-'}</TableCell>
									<TableCell className="font-medium">{c.paciente.nombre}</TableCell>
									<TableCell>{c.paciente.email}</TableCell>
									<TableCell>{c.medico.nombre}</TableCell>
									<TableCell>{c.especialidad || '-'}</TableCell>
									<TableCell>{c.motivo || '-'}</TableCell>
									<TableCell>{c.consultorio || '-'}</TableCell>
									<TableCell>{c.telefono || '-'}</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button variant="ghost" size="sm" onClick={()=>handleView(c)}>Ver</Button>
											<Button variant="outline" size="sm" onClick={()=>handleEdit(c)}>Editar</Button>
											<Button variant="destructive" size="sm" onClick={()=>handleDelete(c)}>Eliminar</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
	 				</Table>
					<Pagination>
						<PaginationContent>
							<PaginationItem><PaginationPrevious href="#" onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} /></PaginationItem>
							{[...Array(totalPages)].map((_,i)=>(<PaginationItem key={i}><PaginationLink href="#" isActive={currentPage===i+1} onClick={()=>setCurrentPage(i+1)}>{i+1}</PaginationLink></PaginationItem>))}
							<PaginationItem><PaginationNext href="#" onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} /></PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>

			{/* Edit modal: reusar formulario */}
			<Dialog open={isEditOpen} onOpenChange={(open) => { if(!open){ setIsEditOpen(false); setSelectedCita(null);} else setIsEditOpen(open); }}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Editar Cita</DialogTitle>
					</DialogHeader>
					{selectedCita && (
						<NewCitaForm cita={selectedCita ?? undefined} onSuccess={() => { setIsEditOpen(false); setSelectedCita(null); fetchCitas(); }} onCancel={() => { setIsEditOpen(false); setSelectedCita(null); }} />
					)}
				</DialogContent>
			</Dialog>

			{/* Modal global de confirmación */}
			<ModalConfirm open={isConfirmOpen} title="Eliminar cita" description="¿Estás seguro que quieres eliminar esta cita?" onConfirm={confirmDelete} onCancel={() => { setIsConfirmOpen(false); setCitaToDelete(null); }} />

					{/* View modal: detalles de la cita */}
					<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
						<DialogContent className="sm:max-w-[500px]">
							<DialogHeader>
								<DialogTitle>Detalles de la Cita</DialogTitle>
							</DialogHeader>
							{selectedCita && (
								<div className="space-y-3">
									<div><strong>Folio:</strong> {`CITA-${selectedCita.id}-${new Date(selectedCita.createdAt).toISOString().slice(0,10).replace(/-/g,'')}`}</div>
									<div><strong>Fecha solicitada:</strong> {new Date(selectedCita.fechaDeseada).toLocaleDateString()}</div>
									<div><strong>Paciente:</strong> {selectedCita.paciente.nombre} ({selectedCita.paciente.email})</div>
									<div><strong>Médico:</strong> {selectedCita.medico.nombre} - {selectedCita.medico.especialidad || '-'}</div>
									<div><strong>Motivo:</strong><p className="whitespace-pre-wrap">{selectedCita.motivo || '-'}</p></div>
									<div><strong>Consultorio:</strong> {selectedCita.consultorio || '-'}</div>
									<div><strong>Teléfono:</strong> {selectedCita.telefono || '-'}</div>
									<div className="flex justify-end gap-2 pt-4">
										<Button variant="outline" onClick={() => { setIsViewOpen(false); setSelectedCita(null); }}>Cerrar</Button>
										<Button onClick={() => { setIsViewOpen(false); setIsEditOpen(true); }}>Editar</Button>
										<Button variant="destructive" onClick={async () => { if (!selectedCita) return; const ok = confirm('Eliminar cita?'); if (!ok) return; await CitasApi.delete(selectedCita.id); setIsViewOpen(false); fetchCitas(); }}>Eliminar</Button>
										<Button onClick={() => {
											if (!selectedCita) return;
											const folio = `CITA-${selectedCita.id}-${new Date(selectedCita.createdAt).toISOString().slice(0,10).replace(/-/g,'')}`;
											const printWindow = window.open('', '_blank');
											if (!printWindow) return;
											printWindow.document.write(`<html><head><title>${folio}</title><style>body{font-family:Arial,sans-serif;padding:20px} h1{font-size:18px} .label{font-weight:600}</style></head><body>` +
												`<h1>Detalle de Cita - ${folio}</h1>` +
												`<p><span class="label">Fecha solicitada:</span> ${new Date(selectedCita.fechaDeseada).toLocaleString()}</p>` +
												`<p><span class="label">Paciente:</span> ${selectedCita.paciente.nombre} (${selectedCita.paciente.email})</p>` +
												`<p><span class="label">Médico:</span> ${selectedCita.medico.nombre} - ${selectedCita.medico.especialidad || '-'}</p>` +
												`<p><span class="label">Motivo:</span> ${selectedCita.motivo || '-'}</p>` +
												`<p><span class="label">Consultorio:</span> ${selectedCita.consultorio || '-'}</p>` +
												`<p><span class="label">Teléfono:</span> ${selectedCita.telefono || '-'}</p>` +
												`</body></html>`);
											printWindow.document.close();
											printWindow.focus();
											setTimeout(() => { printWindow.print(); printWindow.close(); }, 300);
										}}>Imprimir</Button>
									</div>
								</div>
							)}
						</DialogContent>
					</Dialog>

		</Layout>
	);
}
