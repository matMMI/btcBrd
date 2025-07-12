"use client";

import { FaBitcoin } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function DashboardCards({ 
  bitcoinPrice, 
  totalInvested, 
  totalBitcoin, 
  currentValue 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Carte Prix Bitcoin */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix Bitcoin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between items-center flex-1">
          <Badge variant="gold" className="px-4 py-3 text-lg">
            <FaBitcoin className="mr-3 text-lg" />
            {bitcoinPrice
              ? `${bitcoinPrice.toLocaleString("fr-FR")} €`
              : "Chargement..."}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Prix d&apos;un bitcoin
          </p>
        </CardContent>
      </Card>

      {/* Carte Investissement Total */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investi Total</CardTitle>
          <Badge variant="secondary">€</Badge>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1">
          <div className="text-2xl font-bold text-primary">
            {totalInvested.toLocaleString("fr-FR")} €
          </div>
          <p className="text-xs text-muted-foreground">
            {totalBitcoin.toFixed(8)} BTC
          </p>
        </CardContent>
      </Card>

      {/* Carte Valeur Actuelle */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Actuelle</CardTitle>
          <Badge
            className={`${
              currentValue > totalInvested
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
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
        <CardContent className="flex flex-col justify-between flex-1">
          <div className="text-2xl font-bold">
            {currentValue.toLocaleString("fr-FR")} €
          </div>
          <p
            className={`text-xs ${
              currentValue > totalInvested
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {currentValue > totalInvested ? "Profit" : "Perte"}:{" "}
            {Math.abs(currentValue - totalInvested).toLocaleString("fr-FR")}{" "}
            €
          </p>
        </CardContent>
      </Card>

      {/* Carte Flat Tax */}
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flat Tax (30%)</CardTitle>
          <Badge variant="outline">Impôt</Badge>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1">
          <div className="text-2xl font-bold text-orange-500">
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.3).toLocaleString("fr-FR")} €`
              : "0 €"}
          </div>
          <p className="text-xs text-green-500">
            Pour moi:{" "}
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.7).toLocaleString("fr-FR")} €`
              : "0 €"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}