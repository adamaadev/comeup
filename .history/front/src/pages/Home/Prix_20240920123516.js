import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

export default function Prix() {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données historiques pour un jour
        const response = await axios.get('https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=1y&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        setHistoricalData(response.data.historical);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  // Configuration des données pour le graphique
  const data = {
    labels: historicalData.map((entry) => entry.label), // Affichage des dates
    datasets: [
      {
        label: 'Prix de clôture',
        data: historicalData.map((entry) => entry.close), // Utilisation du prix de clôture
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM D, YYYY',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Prix (USD)',
        },
      },
    },
  };

  return (
    <div>
      <h2>Évolution du prix d'AAPL sur un jour</h2>
      <Line data={data} options={options} />
    </div>
  );
}
