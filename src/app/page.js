// src/app/page.js
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  FaPlus,
  FaFileDownload,
  FaChartPie,
  FaBitcoin,
  FaSignOutAlt,
} from "react-icons/fa";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import TaxReport from "../components/TaxReport";
import ForeignAccountForm from "../components/ForeignAccountForm";
import LoginForm from "../components/LoginForm";
import PublicDashboard from "../components/PublicDashboard";
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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [foreignAccounts, setForeignAccounts] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
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
    setShowAdminLogin(true);
  };
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAdminLogin(false);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  // Affichage public par défaut
  if (!user && !showAdminLogin) {
    return <PublicDashboard onAdminLogin={handleAdminLogin} />;
  }
  // Formulaire de connexion admin
  if (!user && showAdminLogin) {
    return <LoginForm onLogin={handleLogin} />;
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
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("tax")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tax"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Imposition
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Prix Bitcoin
                </CardTitle>
                <Badge variant="gold" className="px-2 py-1">
                  <FaBitcoin className="mr-1" />
                  BTC
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bitcoinPrice
                    ? `${bitcoinPrice.toLocaleString("fr-FR")} €`
                    : "Chargement..."}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Prix en temps réel
                </p>
              </CardContent>
            </Card>
            {/* Carte Investissement Total */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Investi Total
                </CardTitle>
                <Badge variant="secondary">€</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {totalInvested.toLocaleString("fr-FR")} €
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalBitcoin.toFixed(8)} BTC
                </p>
              </CardContent>
            </Card>
            {/* Carte Valeur Actuelle */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valeur Actuelle
                </CardTitle>
                <Badge
                  variant={
                    currentValue > totalInvested ? "secondary" : "destructive"
                  }
                >
                  {currentValue > totalInvested ? "+" : ""}
                  {totalInvested > 0
                    ? (
                        ((currentValue - totalInvested) / totalInvested) *
                        100
                      ).toFixed(2)
                    : "0"}
                  %
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentValue.toLocaleString("fr-FR")} €
                </div>
                <p
                  className={`text-xs mt-1 ${
                    currentValue > totalInvested
                      ? "text-secondary"
                      : "text-destructive"
                  }`}
                >
                  {currentValue > totalInvested ? "Profit" : "Perte"}:{" "}
                  {Math.abs(currentValue - totalInvested).toLocaleString(
                    "fr-FR"
                  )}{" "}
                  €
                </p>
              </CardContent>
            </Card>
            {/* Résumé des transactions récentes */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaChartPie className="text-primary" />
                  Dernières Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center py-3 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            transaction.type === "buy"
                              ? "secondary"
                              : transaction.type === "sell"
                              ? "destructive"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {transaction.type === "buy"
                            ? "Achat"
                            : transaction.type === "sell"
                            ? "Vente"
                            : "Reçu"}
                        </Badge>
                        <div>
                          <div className="font-medium">
                            {transaction.exchange_platform}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString(
                              "fr-FR"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium flex items-center gap-1">
                          {parseFloat(transaction.crypto_amount).toFixed(8)}
                          <Badge variant="gold" className="text-xs px-1 py-0">
                            <FaBitcoin className="text-xs" />
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.fiat_amount
                            ? `${parseFloat(
                                transaction.fiat_amount
                              ).toLocaleString("fr-FR")} €`
                            : "Gratuit"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === "transactions" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setShowTransactionForm(true)}
                className="flex items-center gap-2"
              >
                <FaPlus /> Ajouter une transaction
              </Button>
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
