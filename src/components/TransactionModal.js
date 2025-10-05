"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

export default function TransactionModal({ isOpen, onClose, onSubmit }) {
  const [transaction, setTransaction] = useState({
    date: "",
    type: "buy",
    crypto_symbol: "BTC",
    crypto_amount: "",
    fiat_amount: "",
    exchange_platform: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("crypto_transactions").insert([
      {
        date: transaction.date,
        type: transaction.type,
        crypto_symbol: transaction.crypto_symbol,
        crypto_amount: parseFloat(transaction.crypto_amount),
        fiat_amount: parseFloat(transaction.fiat_amount),
        fiat_currency: "EUR",
        exchange_platform: transaction.exchange_platform,
        notes: transaction.notes,
      },
    ]);

    if (error) {
      toast.error("Erreur lors de l'ajout de la transaction");
      console.error("Error:", error);
    } else {
      toast.success("Transaction ajoutée avec succès");
      setTransaction({
        date: "",
        type: "buy",
        crypto_symbol: "BTC",
        crypto_amount: "",
        fiat_amount: "",
        exchange_platform: "",
        notes: "",
      });
      onSubmit();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">Nouvelle Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={transaction.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Type
              </label>
              <select
                name="type"
                value={transaction.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light transition-colors"
              >
                <option value="buy">Achat</option>
                <option value="sell">Vente</option>
                <option value="received">Reçu gratuitement</option>
                <option value="exchange">Échange</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Crypto
              </label>
              <input
                type="text"
                name="crypto_symbol"
                value={transaction.crypto_symbol}
                onChange={handleChange}
                placeholder="BTC, ETH, etc."
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Quantité
              </label>
              <input
                type="number"
                name="crypto_amount"
                value={transaction.crypto_amount}
                onChange={handleChange}
                placeholder="0.00000000"
                step="0.00000001"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Montant total (EUR)
              </label>
              <input
                type="number"
                name="fiat_amount"
                value={transaction.fiat_amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-muted-foreground mb-2">
                Plateforme d&apos;échange
              </label>
              <input
                type="text"
                name="exchange_platform"
                value={transaction.exchange_platform}
                onChange={handleChange}
                placeholder="Binance, Coinbase, etc."
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-light text-muted-foreground mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={transaction.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors resize-none"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 font-light transition-colors"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 font-light transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}