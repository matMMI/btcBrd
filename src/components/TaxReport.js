// src/components/TaxReport.js
"use client";

import { FaCalculator, FaFileDownload, FaInfoCircle } from "react-icons/fa";

export default function TaxReport({ taxData }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const downloadTaxReport = () => {
    const taxYear = new Date().getFullYear() - 1;
    const content = `
RAPPORT FISCAL CRYPTO - ${taxYear}
==============================

RÉSUMÉ DES GAINS
---------------
Plus-values totales réalisées: ${formatCurrency(taxData.totalGains)}
Seuil d'exonération appliqué: ${formatCurrency(taxData.exemptionApplied)}
Plus-value imposable: ${formatCurrency(taxData.taxableAmount)}

CALCUL DE L'IMPÔT
----------------
Taux d'imposition: 30%
- Impôt sur le revenu: 12,8%
- Prélèvements sociaux: 17,2%

Impôt à payer: ${formatCurrency(taxData.taxToPay)}

PORTEFEUILLE ACTUEL
------------------
${Object.entries(taxData.portfolio || {})
  .map(
    ([symbol, data]) =>
      `${symbol}: ${data.amount.toFixed(8)} (Coût: ${formatCurrency(
        data.totalCost
      )})`
  )
  .join("\n")}

Valeur totale du portefeuille: ${formatCurrency(taxData.totalPortfolioValue)}

==============================
Document généré le ${new Date().toLocaleString("fr-FR")}
    `;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `rapport-fiscal-crypto-${taxYear}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaCalculator className="text-primary" />
            Résumé fiscal
          </h3>
          <button
            onClick={downloadTaxReport}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFileDownload /> Télécharger le rapport
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Plus-values totales réalisées
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(taxData.totalGains)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Plus-value imposable</p>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(taxData.taxableAmount)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Exonération appliquée</p>
            <p className="text-2xl font-bold text-yellow-700">
              {formatCurrency(taxData.exemptionApplied)}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Impôt à payer</p>
            <p className="text-2xl font-bold text-danger">
              {formatCurrency(taxData.taxToPay)}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            Informations fiscales
          </h4>
          <ul className="text-sm space-y-2">
            <li>
              • <strong>Seuil d&apos;exonération:</strong> Les plus-values de
              moins de 305 EUR sont exonérées d&apos;impôt
            </li>
            <li>
              • <strong>Taux d&apos;imposition:</strong> 30% (12,8% IR + 17,2%
              prélèvements sociaux)
            </li>
            <li>
              • <strong>Formulaire 2086:</strong> À remplir pour les plus-values
              de cession d&apos;actifs numériques
            </li>
            <li>
              • <strong>Formulaire 2042 C:</strong> Report de la plus-value
              nette (case 3AN ou 3BN)
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Portefeuille actuel</h3>
        {Object.keys(taxData.portfolio || {}).length === 0 ? (
          <p className="text-gray-500">Aucun crypto-actif en portefeuille</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(taxData.portfolio || {}).map(([symbol, data]) => (
              <div
                key={symbol}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{symbol}</p>
                  <p className="text-sm text-gray-600">
                    {data.amount.toFixed(8)} unités
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(data.totalCost)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Prix moyen: {formatCurrency(data.totalCost / data.amount)}
                    /unité
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 text-right">
              <p className="text-lg font-bold">
                Valeur totale: {formatCurrency(taxData.totalPortfolioValue)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
