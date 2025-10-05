"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

export default function EditTransactionModal({ isOpen, onClose, onSubmit, transaction }) {
  const [formData, setFormData] = useState({
    date: "",
    type: "buy",
    crypto_symbol: "BTC",
    crypto_amount: "",
    fiat_amount: "",
    exchange_platform: "",
    notes: "",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        type: transaction.type,
        crypto_symbol: transaction.crypto_symbol,
        crypto_amount: transaction.crypto_amount.toString(),
        fiat_amount: transaction.fiat_amount ? transaction.fiat_amount.toString() : "",
        exchange_platform: transaction.exchange_platform || "",
        notes: transaction.notes || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFiatAmount = parseFloat(formData.fiat_amount);

    const { error } = await supabase
      .from("crypto_transactions")
      .update({
        ...formData,
        crypto_amount: parseFloat(formData.crypto_amount),
        fiat_amount: finalFiatAmount,
        fiat_currency: "EUR",
      })
      .eq("id", transaction.id);

    if (error) {
      toast.error("Erreur lors de la modification de la transaction");
      console.error("Error:", error);
    } else {
      toast.success("Transaction modifiée avec succès");
      onSubmit();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">Modifier la Transaction</DialogTitle>
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
                value={formData.date}
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
                value={formData.type}
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
                value={formData.crypto_symbol}
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
                value={formData.crypto_amount}
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
                value={formData.fiat_amount}
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
                value={formData.exchange_platform}
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
              value={formData.notes}
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
              Modifier
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