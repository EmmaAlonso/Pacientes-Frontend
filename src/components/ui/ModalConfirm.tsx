"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalConfirmProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ModalConfirm({ open, title = "Confirmar", description, onConfirm, onCancel }: ModalConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <div className="py-2">{description}</div>}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); }}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
