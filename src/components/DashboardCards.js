"use client";
import { FaBitcoin } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
export default function DashboardCards({
  bitcoinPrice,
  totalInvested,
  totalBitcoin,
  totalReceived,
  currentValue,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix Bitcoin</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center flex-1 space-y-4">
          <Badge variant="gold" className="px-4 py-3 text-lg">
            <FaBitcoin className="mr-3 text-lg" />
            {bitcoinPrice
              ? `${bitcoinPrice.toLocaleString("fr-FR")} €`
              : "Chargement..."}
          </Badge>
          <p className="text-xs text-muted-foreground text-center">
            Prix d&apos;un bitcoin
          </p>
        </CardContent>
      </Card>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investi Total</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center flex-1 ">
          <div className="text-2xl font-regular  text-primary text-center">
            {totalInvested.toLocaleString("fr-FR")} €
          </div>
          <div className="flex flex-col items-center ">
            <Badge variant="gold" className="text-xs px-2 py-1 my-3">
              <FaBitcoin className="mr-1 text-xs" />
              {(totalBitcoin * 100000000).toFixed(0)} sats au total
            </Badge>
            {totalReceived > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                dont {(totalReceived * 100000000).toFixed(0)}{" "}
                <FaBitcoin className="inline mr-1 text-xs" />
                sats reçus gratos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
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
        <CardContent className="flex flex-col justify-center items-center flex-1 space-y-4">
          <div className="text-2xl font-regular text-center">
            {currentValue.toLocaleString("fr-FR")} €
          </div>
          <Badge
            className={`text-xs px-3 py-1 ${
              currentValue > totalInvested
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {currentValue > totalInvested ? "Profit" : "Perte"} :{" "}
            {Math.abs(currentValue - totalInvested).toLocaleString("fr-FR")} €
          </Badge>
        </CardContent>
      </Card>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flat Tax (30%)</CardTitle>
          <Badge variant="outline">Impôt</Badge>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center flex-1 space-y-4">
          <div className="text-2xl font-regular  text-orange-500 text-center">
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.3).toLocaleString(
                  "fr-FR"
                )} €`
              : "0 €"}
          </div>
          <Badge className="bg-green-600 text-white hover:bg-green-700 text-xs px-3 py-1">
            Pour moi :{" "}
            {currentValue > totalInvested
              ? `${((currentValue - totalInvested) * 0.7).toLocaleString(
                  "fr-FR"
                )} €`
              : "0 €"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
