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
    price_per_unit: "",
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
        price_per_unit: transaction.fiat_amount ? transaction.fiat_amount.toString() : "",
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

    const fiat_amount =
      parseFloat(formData.crypto_amount) *
      parseFloat(formData.price_per_unit);

    const { error } = await supabase
      .from("crypto_transactions")
      .update({
        ...formData,
        crypto_amount: parseFloat(formData.crypto_amount),
        price_per_unit: parseFloat(formData.price_per_unit),
        fiat_amount,
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
          <DialogTitle>Modifier la Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text"
              >
                <option value="buy">Achat</option>
                <option value="sell">Vente</option>
                <option value="exchange">Échange</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Crypto
              </label>
              <input
                type="text"
                name="crypto_symbol"
                value={formData.crypto_symbol}
                onChange={handleChange}
                placeholder="BTC, ETH, etc."
                required
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text placeholder-dark-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
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
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text placeholder-dark-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Prix (EUR)
              </label>
              <input
                type="number"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text placeholder-dark-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Plateforme d&apos;échange
              </label>
              <input
                type="text"
                name="exchange_platform"
                value={formData.exchange_platform}
                onChange={handleChange}
                placeholder="Binance, Coinbase, etc."
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text placeholder-dark-muted"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-dark-text mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-dark-text placeholder-dark-muted"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-dark-border text-dark-text px-4 py-2 rounded-md hover:bg-dark-muted hover:bg-opacity-20"
            >
              Annuler
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}