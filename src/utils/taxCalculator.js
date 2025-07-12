// utils/taxCalculator.js
export function calculateTax(transactions) {
  // Filtrer uniquement les transactions Bitcoin
  const bitcoinTransactions = transactions.filter(t => t.crypto_symbol === 'BTC');
  
  const sortedTransactions = bitcoinTransactions.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  
  let portfolio = {};
  let taxableGains = 0;
  let totalPortfolioValue = 0;
  
  sortedTransactions.forEach((transaction) => {
    const symbol = transaction.crypto_symbol;
    
    if (transaction.type === "buy" || transaction.type === "received") {
      if (!portfolio[symbol]) {
        portfolio[symbol] = {
          amount: 0,
          totalCost: 0,
        };
      }
      portfolio[symbol].amount += parseFloat(transaction.crypto_amount);
      // Pour les transactions "received", le coût est 0
      const cost = transaction.type === "received" ? 0 : parseFloat(transaction.fiat_amount || 0);
      portfolio[symbol].totalCost += cost;
    } else if (transaction.type === "sell") {
      if (portfolio[symbol] && portfolio[symbol].amount > 0) {
        const averageCost = portfolio[symbol].totalCost / portfolio[symbol].amount;
        const costBasis = averageCost * parseFloat(transaction.crypto_amount);
        const saleValue = parseFloat(transaction.fiat_amount || 0);
        const gain = saleValue - costBasis;

        taxableGains += gain;
        portfolio[symbol].amount -= parseFloat(transaction.crypto_amount);
        portfolio[symbol].totalCost -= costBasis;
        
        // Nettoyer si le montant est négligeable
        if (portfolio[symbol].amount < 0.00000001) {
          delete portfolio[symbol];
        }
      }
    }
  });
  
  // Calculer la valeur totale du portefeuille (coût d'acquisition)
  Object.values(portfolio).forEach((crypto) => {
    totalPortfolioValue += crypto.totalCost;
  });
  
  const taxExemptionThreshold = 305;
  let taxableAmount = 0;
  let taxToPay = 0;

  if (taxableGains > taxExemptionThreshold) {
    taxableAmount = taxableGains - taxExemptionThreshold;
    taxToPay = taxableAmount * 0.3;
  }

  return {
    totalGains: taxableGains,
    taxableAmount,
    taxToPay,
    exemptionApplied: Math.min(taxableGains, taxExemptionThreshold),
    portfolio,
    totalPortfolioValue,
  };
}
