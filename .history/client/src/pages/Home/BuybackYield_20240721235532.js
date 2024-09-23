import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuybackYield = ({ symbol }) => {
  const [buybackYield, setBuybackYield] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Récupérer les données du revenu
        const incomeStatementResponse = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=6&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        const incomeData = incomeStatementResponse.data;

        // Récupérer les données du bilan
        const balanceSheetResponse = await axios.get(`https://financialmodelingprep.com/api/v3/financials/balance-sheet-statement/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
        const balanceData = balanceSheetResponse.data.financials;

        if (!incomeData || !balanceData) {
          throw new Error('Données financières manquantes');
        }

        // Calcul du buyback yield
        const sharesOutstanding = incomeData.map(data => data.weightedAverageShsOut);
        const buybackYield = ((sharesOutstanding[0] - sharesOutstanding[1]) / sharesOutstanding[1]) * 100;

        setBuybackYield(buybackYield.toFixed(2) + '%');
      } catch (error) {
        setError('Error fetching financial data');
        console.error(`Error fetching financial data for ${symbol}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <p>Buybackyield {buybackYield}</p>
    </div>
  );
};

export default BuybackYield;
