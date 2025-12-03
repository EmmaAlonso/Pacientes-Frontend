"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { axiosInstance } from "@/lib/axios/config";
import { ENDPOINTS } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/Toast";

type Attachment = any;

export default function HistorialMedicoPage() {
	const { user } = useAuth();
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<Attachment | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
			const { data } = await axiosInstance.get('/attachments');
				const list: any[] = Array.isArray(data) ? data : [];
				// Try to filter by common patient id fields
				const patientId = user?.sub;
				const filtered = list.filter((a) => {
					return (
						a.patientId === patientId ||
						a.pacienteId === patientId ||
						a.ownerId === patientId ||
						(a.meta && (a.meta.patientId === patientId || a.meta.pacienteId === patientId))
					);
				});
				setAttachments(filtered);
			} catch (err) {
				console.error(err);
				showToast("No se pudieron cargar los documentos", "error");
			} finally {
				setLoading(false);
			}
		};
		if (user) load();
	}, [user]);

	return (
		<main className="container mx-auto px-4 py-6">
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Historial Médico</h1>
				<p className="text-sm text-muted-foreground">Documentos y archivos subidos por tu médico. Sólo vista.</p>

				<Card>
					<CardHeader><CardTitle>Documentos</CardTitle></CardHeader>
					<CardContent>
						{loading ? <p>Cargando...</p> : attachments.length === 0 ? <p className="text-sm text-muted-foreground">No hay documentos disponibles.</p> : (
							<div className="overflow-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nombre</TableHead>
											<TableHead>Tipo</TableHead>
											<TableHead>Subido por</TableHead>
											<TableHead>Fecha</TableHead>
											<TableHead className="text-right">Acciones</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{attachments.map((a) => (
											<TableRow key={a.id || a.name}>
												<TableCell className="font-medium">{a.name || a.filename || `Documento ${a.id}`}</TableCell>
												<TableCell>{a.type || a.mime || '-'}</TableCell>
												<TableCell>{a.uploader || a.uploadedBy || (a.meta && a.meta.uploader) || '-'}</TableCell>
												<TableCell>{a.date ? new Date(a.date).toLocaleDateString() : (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-')}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button variant="ghost" size="sm" onClick={() => { setSelected(a); setOpen(true); }}>Ver</Button>
														{a.url && <Button size="sm" onClick={() => window.open(a.url, '_blank')}>Abrir</Button>}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className="sm:max-w-[900px]">
						<DialogHeader><DialogTitle>Documento</DialogTitle></DialogHeader>
						{selected ? (
							<div>
								{selected.url ? (
									<iframe src={selected.url} className="w-full h-[70vh] border" />
								) : (
									<pre className="text-sm p-4 bg-gray-100 rounded">{JSON.stringify(selected, null, 2)}</pre>
								)}
							</div>
						) : <p>No hay documento seleccionado.</p>}
					</DialogContent>
				</Dialog>
			</div>
		</main>
	);
}

