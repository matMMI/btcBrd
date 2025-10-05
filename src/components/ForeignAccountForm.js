// src/components/ForeignAccountForm.js
"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";

export default function ForeignAccountForm({ onSubmit, onCancel }) {
  const [account, setAccount] = useState({
    platform_name: "",
    platform_country: "",
    account_type: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("foreign_crypto_accounts")
      .insert([account]);

    if (error) {
      toast.error("Erreur lors de l'ajout du compte");
      console.error("Error:", error);
    } else {
      toast.success("Compte ajouté avec succès");
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-xl font-light mb-2">
        Nouveau compte à l&apos;étranger
      </h3>
      <p className="text-sm font-light text-muted-foreground mb-6">
        Pour le formulaire 3916-BIS (déclaration des comptes crypto à
        l&apos;étranger)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-light text-muted-foreground mb-2">
            Nom de la plateforme
          </label>
          <input
            type="text"
            name="platform_name"
            value={account.platform_name}
            onChange={handleChange}
            placeholder="Ex: Binance, Kraken, Coinbase..."
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-muted-foreground mb-2">
            Pays de la plateforme
          </label>
          <input
            type="text"
            name="platform_country"
            value={account.platform_country}
            onChange={handleChange}
            placeholder="Ex: Malte, États-Unis, Suisse..."
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-light text-muted-foreground mb-2">
            Type de compte
          </label>
          <input
            type="text"
            name="account_type"
            value={account.account_type}
            onChange={handleChange}
            placeholder="Ex: Exchange, Wallet..."
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-light placeholder:text-muted-foreground/50 transition-colors"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={account.is_active}
              onChange={handleChange}
              className="rounded border-border text-primary focus:ring-primary focus:ring-1"
            />
            <span className="ml-2 text-sm font-light">Compte actif</span>
          </label>
        </div>
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
          onClick={onCancel}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 font-light transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
