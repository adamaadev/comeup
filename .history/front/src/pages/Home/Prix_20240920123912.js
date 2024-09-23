import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { parseISO } from 'date-fns';

// Enregistrer les composants nécessaires de chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale, 
  Tooltip,
  Legend
);

export default function Prix() {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=1y&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        console.log(response.data.historical); // Vérifiez les données dans la console
        setHistoricalData(response.data.historical);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: historicalData.map((entry) => parseISO(entry.date)), // Convertir les dates ISO
    datasets: [
      {
        label: 'Prix de clôture',
        data: historicalData.map((entry) => entry.close),
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
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <h2>Évolution du prix d'AAPL sur un jour</h2>
      {historicalData.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
}
