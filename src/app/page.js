"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FaPlus, FaBitcoin, FaSignOutAlt } from "react-icons/fa";
import TransactionList from "../components/TransactionList";
import ForeignAccountForm from "../components/ForeignAccountForm";
import AdminModal from "../components/AdminModal";
import PublicDashboard from "../components/PublicDashboard";
import TransactionModal from "../components/TransactionModal";
import DashboardCards from "../components/DashboardCards";
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalBitcoin, setTotalBitcoin] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    fetchTransactions();
    fetchForeignAccounts();
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 20000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (transactions.length > 0) {
      // Montant total investi (seulement les achats payants)
      const totalInvestedAmount = transactions
        .filter((t) => t.type === "buy" && parseFloat(t.fiat_amount) > 0)
        .reduce((sum, t) => sum + parseFloat(t.fiat_amount), 0);
      
      // Total des bitcoins achetés (pour la carte "Investi Total")
      const totalBitcoinBought = transactions
        .filter((t) => t.type === "buy")
        .reduce((sum, t) => sum + parseFloat(t.crypto_amount), 0);
      
      // Total des satoshis possédés (achats + reçus - ventes) pour "Valeur Actuelle"
      const totalBitcoinBalance = transactions.reduce((sum, t) => {
        const amount = parseFloat(t.crypto_amount);
        if (t.type === "buy" || t.type === "received") {
          return sum + amount;
        } else if (t.type === "sell") {
          return sum - amount;
        }
        return sum; // pour les autres types comme "exchange"
      }, 0);
      
      console.log("Bitcoin achetés:", totalBitcoinBought);
      console.log("Bitcoin balance total:", totalBitcoinBalance);
      
      setTotalInvested(totalInvestedAmount);
      setTotalBitcoin(totalBitcoinBalance); // Total complet pour les satoshis
      if (bitcoinPrice) {
        setCurrentValue(totalBitcoinBalance * bitcoinPrice);
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
      const response = await fetch("/api/bitcoin-price", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      console.log("Prix Bitcoin reçu:", data);
      if (data.bitcoin) {
        console.log("Mise à jour du prix Bitcoin:", data.bitcoin.eur);
        setBitcoinPrice(data.bitcoin.eur);
      }
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
        <div className="flex justify-end items-center mb-4">
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
        {activeTab === "dashboard" && (
          <div>
            <DashboardCards
              bitcoinPrice={bitcoinPrice}
              totalInvested={totalInvested}
              totalBitcoin={totalBitcoin}
              currentValue={currentValue}
            />
            
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
