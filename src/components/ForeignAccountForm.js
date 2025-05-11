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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Nouveau compte à l'étranger
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Pour le formulaire 3916-BIS (déclaration des comptes crypto à
        l'étranger)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la plateforme
          </label>
          <input
            type="text"
            name="platform_name"
            value={account.platform_name}
            onChange={handleChange}
            placeholder="Ex: Binance, Kraken, Coinbase..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pays de la plateforme
          </label>
          <input
            type="text"
            name="platform_country"
            value={account.platform_country}
            onChange={handleChange}
            placeholder="Ex: Malte, États-Unis, Suisse..."
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de compte
          </label>
          <input
            type="text"
            name="account_type"
            value={account.account_type}
            onChange={handleChange}
            placeholder="Ex: Exchange, Wallet..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={account.is_active}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Compte actif</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
