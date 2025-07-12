// src/app/page.js
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FaPlus, FaChartPie, FaBitcoin, FaSignOutAlt } from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TaxReport from "../components/TaxReport";
import ForeignAccountForm from "../components/ForeignAccountForm";
import AdminModal from "../components/AdminModal";
import PublicDashboard from "../components/PublicDashboard";
import TransactionModal from "../components/TransactionModal";
import DashboardCards from "../components/DashboardCards";
import { calculateTax } from "../utils/taxCalculator";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
export default function Home() {
  const [user, setUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [foreignAccounts, setForeignAccounts] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [taxData, setTaxData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalBitcoin, setTotalBitcoin] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    fetchTransactions();
    fetchForeignAccounts();
    fetchBitcoinPrice();
    // Mise à jour du prix Bitcoin toutes les 30 secondes
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (transactions.length > 0) {
      const calculated = calculateTax(transactions);
      setTaxData(calculated);
      // Calculer l'investissement total et le nombre de Bitcoin
      const buyTransactions = transactions.filter((t) => t.type === "buy");
      const totalInvestedAmount = buyTransactions.reduce(
        (sum, t) => sum + parseFloat(t.fiat_amount),
        0
      );
      const totalBitcoinAmount = buyTransactions.reduce(
        (sum, t) => sum + parseFloat(t.crypto_amount),
        0
      );
      setTotalInvested(totalInvestedAmount);
      setTotalBitcoin(totalBitcoinAmount);
      if (bitcoinPrice) {
        setCurrentValue(totalBitcoinAmount * bitcoinPrice);
      }
    }
  }, [transactions, bitcoinPrice]);
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
  async function fetchBitcoinPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur"
      );
      const data = await response.json();
      setBitcoinPrice(data.bitcoin.eur);
    } catch (error) {
      console.error("Erreur lors de la récupération du prix Bitcoin:", error);
    }
  }
  const handleAdminLogin = () => {
    setShowAdminModal(true);
  };
  const handleLogin = (userData) => {
    setUser(userData);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  // Affichage public par défaut
  if (!user) {
    return (
      <>
        <PublicDashboard onAdminLogin={handleAdminLogin} />
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Administration
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <FaSignOutAlt />
            Déconnexion
          </Button>
        </div>
        <div className="border-b border-border mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <FaBitcoin className="inline mr-2" />
              Dashboard & Transactions
            </button>
            <button
              onClick={() => setActiveTab("accounts")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "accounts"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Comptes à l&apos;étranger
            </button>
          </nav>
        </div>
        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div>
            <DashboardCards
              bitcoinPrice={bitcoinPrice}
              totalInvested={totalInvested}
              totalBitcoin={totalBitcoin}
              currentValue={currentValue}
            />
            {/* Section de gestion des transactions */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setShowTransactionModal(true)}
                className="flex items-center gap-2"
              >
                <FaPlus /> Ajouter une transaction
              </Button>
            </div>
            <TransactionList
              transactions={transactions}
              onUpdate={fetchTransactions}
            />
            <TransactionModal
              isOpen={showTransactionModal}
              onClose={() => setShowTransactionModal(false)}
              onSubmit={fetchTransactions}
            />
          </div>
        )}
        {activeTab === "accounts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setShowAccountForm(true)}
                className="flex items-center gap-2"
              >
                <FaPlus /> Ajouter un compte à l&apos;étranger
              </Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Comptes crypto à l&apos;étranger</CardTitle>
              </CardHeader>
              <CardContent>
                {foreignAccounts.length === 0 ? (
                  <p className="text-muted-foreground">
                    Aucun compte enregistré
                  </p>
                ) : (
                  <div className="space-y-4">
                    {foreignAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {account.platform_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {account.platform_country}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {account.account_type}
                            </p>
                          </div>
                          <Badge
                            variant={
                              account.is_active ? "secondary" : "destructive"
                            }
                          >
                            {account.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
