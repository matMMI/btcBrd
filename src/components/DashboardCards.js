"use client";
import { FaBitcoin } from "react-icons/fa";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
export default function DashboardCards({
  bitcoinPrice,
  totalInvested,
  totalBitcoin,
  totalReceived,
  currentValue,
}) {
  const [multiplier, setMultiplier] = useState(10);
  const predictedBtcPrice = bitcoinPrice * multiplier;
  const predictedValue = totalBitcoin * predictedBtcPrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Investi Total
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-light tracking-tight text-primary">
            {totalInvested.toLocaleString("fr-FR")} €
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-light text-muted-foreground">
              <FaBitcoin className="inline mr-1.5 text-orange-500" />
              {(totalBitcoin * 100000000).toFixed(0)} sats
            </div>
            {totalReceived > 0 && (
              <div className="text-xs font-light text-muted-foreground">
                dont {(totalReceived * 100000000).toFixed(0)} sats gratuits
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Valeur Actuelle
          </CardTitle>
          <Badge variant="outline" className="text-xs font-light">
            {currentValue > totalInvested ? "+" : ""}
            {totalInvested > 0
              ? (
                  ((currentValue - totalInvested) / totalInvested) *
                  100
                ).toFixed(1)
              : "0"}
            %
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-light text-muted-foreground">
            <FaBitcoin className="text-orange-500" />
            <span>
              1 BTC ={" "}
              <span className="text-yellow-400 font-semibold">
                {bitcoinPrice ? bitcoinPrice.toLocaleString("fr-FR") : "..."} €
              </span>
            </span>
          </div>
          <div className="text-3xl font-light tracking-tight">
            {currentValue.toLocaleString("fr-FR")} €
          </div>
          <div
            className={`text-sm font-light ${
              currentValue > totalInvested ? "text-green-500" : "text-red-500"
            }`}
          >
            {currentValue > totalInvested ? "+" : "-"}
            {Math.abs(currentValue - totalInvested).toLocaleString("fr-FR")} €
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Flat Tax
          </CardTitle>
          <Badge variant="outline" className="text-xs font-light">
            30%
          </Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-light tracking-tight text-orange-500">
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.3).toLocaleString(
                  "fr-FR"
                )} €`
              : "0 €"}
          </div>
          <div className="text-sm font-light text-green-500">
            Net:{" "}
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.7).toLocaleString(
                  "fr-FR"
                )} €`
              : "0 €"}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Prédiction
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={multiplier}
              onChange={(e) => {
                const val = e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, "");
                setMultiplier(parseFloat(val) || 0);
              }}
              placeholder="10"
              className="w-20 px-2 py-1 bg-background border border-border rounded-md text-sm font-light focus:outline-none focus:ring-1 focus:ring-primary text-center"
            />
            <span className="text-xs font-light text-muted-foreground">
              × BTC actuel
            </span>
          </div>
          <div className="text-xs font-light text-muted-foreground">
            <FaBitcoin className="inline text-orange-500 mr-1" />1 BTC ={" "}
            <span className="text-purple-400">
              {predictedBtcPrice.toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="text-3xl font-light tracking-tight text-purple-500">
            {predictedValue.toLocaleString("fr-FR")} €
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
