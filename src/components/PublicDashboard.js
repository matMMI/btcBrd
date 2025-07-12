"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FaBitcoin, FaChartPie, FaShieldAlt } from "react-icons/fa";
import { calculateTax } from "../utils/taxCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import DashboardCards from "./DashboardCards";
export default function PublicDashboard({ onAdminLogin }) {
  const [transactions, setTransactions] = useState([]);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalBitcoin, setTotalBitcoin] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [taxData, setTaxData] = useState(null);
  useEffect(() => {
    fetchTransactions();
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
    if (!error) {
      setTransactions(data);
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
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex justify-end items-center mb-6">
          <Button
            variant="outline"
            onClick={onAdminLogin}
            className="flex items-center gap-2"
          >
            <FaShieldAlt />
            Administration
          </Button>
        </div>
        <DashboardCards 
          bitcoinPrice={bitcoinPrice}
          totalInvested={totalInvested}
          totalBitcoin={totalBitcoin}
          currentValue={currentValue}
        />
        {/* Graphique des transactions récentes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaChartPie className="text-primary" />
              Dernières Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 8).map((transaction) => (
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
                        {new Date(transaction.date).toLocaleDateString("fr-FR")}
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
                        ? `${parseFloat(transaction.fiat_amount).toLocaleString(
                            "fr-FR"
                          )} €`
                        : "Gratuit"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
