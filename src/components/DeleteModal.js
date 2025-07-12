"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

export default function DeleteModal({ isOpen, onClose, onConfirm, title, description }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Confirmer la suppression"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            {description || "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."}
          </p>
        </div>
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}