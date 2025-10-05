"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FaShieldAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import DashboardCards from "./DashboardCards";
import TransactionList from "./TransactionList";
export default function PublicDashboard({ onAdminLogin }) {
  const [transactions, setTransactions] = useState([]);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalBitcoin, setTotalBitcoin] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    fetchTransactions();
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

      // Total des bitcoins reçus gratuitement
      const totalReceivedAmount = transactions
        .filter((t) => t.type === "received")
        .reduce((sum, t) => sum + parseFloat(t.crypto_amount), 0);

      // Total des satoshis possédés (achats + reçus - ventes)
      const totalBitcoinBalance = transactions.reduce((sum, t) => {
        const amount = parseFloat(t.crypto_amount);
        if (t.type === "buy" || t.type === "received") {
          return sum + amount;
        } else if (t.type === "sell") {
          return sum - amount;
        }
        return sum; // pour les autres types comme "exchange"
      }, 0);

      setTotalInvested(totalInvestedAmount);
      setTotalBitcoin(totalBitcoinBalance);
      setTotalReceived(totalReceivedAmount);
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
    if (!error) {
      setTransactions(data);
    }
  }
  async function fetchBitcoinPrice() {
    try {
      const response = await fetch("/api/bitcoin-price");
      const data = await response.json();
      if (data.bitcoin) {
        setBitcoinPrice(data.bitcoin.eur);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du prix Bitcoin:", error);
    }
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light tracking-tight">cryptotracker</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdminLogin}
            className="flex items-center gap-2 font-light"
          >
            <FaShieldAlt className="text-sm" />
            Administration
          </Button>
        </div>
        <DashboardCards
          bitcoinPrice={bitcoinPrice}
          totalInvested={totalInvested}
          totalBitcoin={totalBitcoin}
          totalReceived={totalReceived}
          currentValue={currentValue}
        />
        <TransactionList
          transactions={transactions}
          onUpdate={fetchTransactions}
          showActions={false}
        />
      </div>
    </div>
  );
}
