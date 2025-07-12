// src/components/TransactionList.js
"use client";

import { FaTrash, FaEdit, FaBitcoin } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import EditTransactionModal from "./EditTransactionModal";
import { Badge } from "./ui/badge";

export default function TransactionList({ transactions, onUpdate }) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transactionId: null });
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null });

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, transactionId: id });
  };

  const handleEditClick = (transaction) => {
    setEditModal({ isOpen: true, transaction });
  };

  const handleDeleteConfirm = async () => {
    const { error } = await supabase
      .from("crypto_transactions")
      .delete()
      .eq("id", deleteModal.transactionId);

    if (error) {
      toast.error("Erreur lors de la suppression");
      console.error("Error:", error);
    } else {
      toast.success("Transaction supprimée");
      onUpdate();
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border text-center text-dark-muted">
        Aucune transaction enregistrée
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-border">
          <thead className="bg-dark-bg">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Crypto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Satoshis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Prix (EUR)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Plateforme
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-dark-card divide-y divide-dark-border">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                  {transaction.crypto_symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                  <Badge variant="gold" className="text-xs px-2 py-1">
                    <FaBitcoin className="mr-1 text-xs" />
                    {(transaction.crypto_amount * 100000000).toFixed(0)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text font-medium">
                  €{transaction.fiat_amount ? transaction.fiat_amount.toFixed(2) : 'Gratuit'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                  {transaction.exchange_platform || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-muted">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(transaction)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction.id)}
                      className="text-danger hover:text-red-400"
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

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transactionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la transaction"
        description="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
      />

      <EditTransactionModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, transaction: null })}
        onSubmit={onUpdate}
        transaction={editModal.transaction}
      />
    </div>
  );
}
