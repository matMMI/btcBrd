// utils/taxCalculator.js
export function calculateTax(transactions) {
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let portfolio = {};
  let taxableGains = 0;
  let totalPortfolioValue = 0;
  sortedTransactions.forEach((transaction) => {
    if (transaction.type === "buy") {
      if (!portfolio[transaction.crypto_symbol]) {
        portfolio[transaction.crypto_symbol] = {
          amount: 0,
          totalCost: 0,
        };
      }
      portfolio[transaction.crypto_symbol].amount += transaction.crypto_amount;
      portfolio[transaction.crypto_symbol].totalCost += transaction.fiat_amount;
    } else if (transaction.type === "sell") {
      if (portfolio[transaction.crypto_symbol]) {
        const averageCost =
          portfolio[transaction.crypto_symbol].totalCost /
          portfolio[transaction.crypto_symbol].amount;
        const costBasis = averageCost * transaction.crypto_amount;
        const gain = transaction.fiat_amount - costBasis;

        taxableGains += gain;
        portfolio[transaction.crypto_symbol].amount -=
          transaction.crypto_amount;
        portfolio[transaction.crypto_symbol].totalCost -= costBasis;
        if (portfolio[transaction.crypto_symbol].amount < 0.00000001) {
          delete portfolio[transaction.crypto_symbol];
        }
      }
    }
  });
  Object.values(portfolio).forEach((crypto) => {
    totalPortfolioValue += crypto.totalCost;
  });
  const taxExemptionThreshold = 305;
  let taxableAmount = 0;
  let taxToPay = 0;

  if (taxableGains > taxExemptionThreshold) {
    taxableAmount = taxableGains;
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
