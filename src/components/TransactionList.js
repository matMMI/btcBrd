"use client";
import { FaBitcoin } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import EditTransactionModal from "./EditTransactionModal";
import { Badge } from "./ui/badge";
export default function TransactionList({
  transactions,
  onUpdate,
  showActions = true,
}) {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    transactionId: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    transaction: null,
  });
  const [showAll, setShowAll] = useState(false);
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
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 10);
  return (
    <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-dark-text">
            Transactions ({displayedTransactions.length}/{transactions.length})
          </h3>
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-blue-600"
          >
            {showAll ? "10 dernières" : "Toutes"}
          </button>
        </div>
      </div>
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
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-muted uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-dark-card divide-y divide-dark-border">
            {displayedTransactions.map((transaction) => (
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
                  €
                  {transaction.fiat_amount
                    ? transaction.fiat_amount.toFixed(2)
                    : "Gratuit"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                  {transaction.exchange_platform || "-"}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-muted">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(transaction)}
                        className="text-orange-500 hover:text-orange-400"
                      >
                        modifier
                      </button>
                      <button
                        onClick={() => handleDeleteClick(transaction.id)}
                        className="text-danger hover:text-red-400"
                      >
                        supprimer
                      </button>
                    </div>
                  </td>
                )}
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
      {showActions && (
        <EditTransactionModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, transaction: null })}
          onSubmit={onUpdate}
          transaction={editModal.transaction}
        />
      )}
    </div>
  );
}
