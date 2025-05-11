// src/components/TransactionList.js
"use client";

import { FaTrash, FaEdit } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { format } from "date-fns";

export default function TransactionList({ transactions, onUpdate }) {
  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")
    ) {
      const { error } = await supabase
        .from("crypto_transactions")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Erreur lors de la suppression");
        console.error("Error:", error);
      } else {
        toast.success("Transaction supprimée");
        onUpdate();
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Aucune transaction enregistrée
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crypto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix unitaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (EUR)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plateforme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === "buy"
                        ? "bg-green-100 text-green-800"
                        : transaction.type === "sell"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {transaction.type === "buy"
                      ? "Achat"
                      : transaction.type === "sell"
                      ? "Vente"
                      : "Échange"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.crypto_symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.crypto_amount.toFixed(8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{transaction.price_per_unit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  €{transaction.fiat_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.exchange_platform || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
