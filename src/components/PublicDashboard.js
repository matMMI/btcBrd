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
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    fetchTransactions();
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (transactions.length > 0) {
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
        <TransactionList transactions={transactions} showActions={false} />
      </div>
    </div>
  );
}
