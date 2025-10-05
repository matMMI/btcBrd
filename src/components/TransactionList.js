"use client";
import { FaBitcoin } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import EditTransactionModal from "./EditTransactionModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TransactionList({ transactions, onUpdate, showActions = true }) {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    transactionId: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    transaction: null,
  });
  const [showAll, setShowAll] = useState(false);

  const handleDeleteConfirm = async () => {
    const { error } = await supabase
      .from("crypto_transactions")
      .delete()
      .eq("id", deleteModal.transactionId);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Transaction supprimée");
      onUpdate();
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-sm font-light text-muted-foreground">
            Aucune transaction enregistrée
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 10);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-light">
          Transactions
          <span className="text-sm font-light text-muted-foreground ml-2">
            ({displayedTransactions.length}/{transactions.length})
          </span>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="font-light"
        >
          {showAll ? "10 dernières" : "Voir tout"}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/40">
              <tr className="text-xs font-light text-muted-foreground">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Crypto</th>
                <th className="px-6 py-3 text-left">Satoshis</th>
                <th className="px-6 py-3 text-left">Prix</th>
                <th className="px-6 py-3 text-left">Plateforme</th>
                {showActions && <th className="px-6 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {displayedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-light">
                    {format(new Date(transaction.date), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="font-light">
                      {transaction.crypto_symbol}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-light text-muted-foreground">
                      <FaBitcoin className="text-orange-500 text-xs" />
                      {(transaction.crypto_amount * 100000000).toFixed(0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-light">
                    {transaction.fiat_amount
                      ? `${transaction.fiat_amount.toFixed(2)} €`
                      : <span className="text-muted-foreground">Gratuit</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-light text-muted-foreground">
                    {transaction.exchange_platform || "-"}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditModal({ isOpen: true, transaction })}
                          className="h-8 w-8 p-0 hover:bg-muted/50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, transactionId: transaction.id })}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {showActions && (
        <>
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
        </>
      )}
    </Card>
  );
}
