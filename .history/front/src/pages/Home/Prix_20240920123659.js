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

// Enregistrement des composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale, // Importer et enregistrer l'échelle de temps
  Tooltip,
  Legend
);

export default function Prix() {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=1y&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX');
        setHistoricalData(response.data.historical);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: historicalData.map((entry) => entry.date), // Utiliser la date
    datasets: [
      {
        label: 'Prix de clôture',
        data: historicalData.map((entry) => entry.close), // Prix de clôture
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
        type: 'time', // Spécifier le type comme 'time'
        time: {
          unit: 'day', // Unité de temps
          tooltipFormat: 'MMM d, yyyy',
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
