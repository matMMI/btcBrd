// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FaPlus, FaFileDownload, FaChartPie } from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TaxReport from "../components/TaxReport";
import ForeignAccountForm from "../components/ForeignAccountForm";
import { calculateTax } from "../utils/taxCalculator";
import { toast } from "react-toastify";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [foreignAccounts, setForeignAccounts] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [taxData, setTaxData] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    fetchTransactions();
    fetchForeignAccounts();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const calculated = calculateTax(transactions);
      setTaxData(calculated);
    }
  }, [transactions]);

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from("crypto_transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des transactions");
      console.error("Error:", error);
    } else {
      setTransactions(data);
    }
  }

  async function fetchForeignAccounts() {
    const { data, error } = await supabase
      .from("foreign_crypto_accounts")
      .select("*")
      .order("platform_name");

    if (error) {
      toast.error("Erreur lors du chargement des comptes");
      console.error("Error:", error);
    } else {
      setForeignAccounts(data);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Tableau de bord Crypto</h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("tax")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tax"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Imposition
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "accounts"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Comptes à l'étranger
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "transactions" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowTransactionForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <FaPlus /> Ajouter une transaction
              </button>
            </div>

            {showTransactionForm && (
              <div className="mb-8">
                <TransactionForm
                  onSubmit={() => {
                    setShowTransactionForm(false);
                    fetchTransactions();
                  }}
                  onCancel={() => setShowTransactionForm(false)}
                />
              </div>
            )}

            <TransactionList
              transactions={transactions}
              onUpdate={fetchTransactions}
            />
          </div>
        )}

        {activeTab === "tax" && (
          <div>{taxData && <TaxReport taxData={taxData} />}</div>
        )}

        {activeTab === "accounts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowAccountForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <FaPlus /> Ajouter un compte à l'étranger
              </button>
            </div>

            {showAccountForm && (
              <div className="mb-8">
                <ForeignAccountForm
                  onSubmit={() => {
                    setShowAccountForm(false);
                    fetchForeignAccounts();
                  }}
                  onCancel={() => setShowAccountForm(false)}
                />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Comptes crypto à l'étranger
              </h3>
              {foreignAccounts.length === 0 ? (
                <p className="text-gray-500">Aucun compte enregistré</p>
              ) : (
                <div className="space-y-4">
                  {foreignAccounts.map((account) => (
                    <div key={account.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {account.platform_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {account.platform_country}
                          </p>
                          <p className="text-sm text-gray-500">
                            {account.account_type}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            account.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
