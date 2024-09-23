import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importation des composants Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Prix(symbol) {
  const [activeTab, setActiveTab] = useState('Informations');
  const [historicalData, setHistoricalData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [priceData, setPriceData] = useState([]);

  // Fonction pour récupérer les données historiques de l'action AAPL
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=12&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`);
      const historical = response.data.historical;

      // Mettre à jour les labels (dates) et les données (prix de clôture)
      const newLabels = historical.map((data) => data.date);
      const newPriceData = historical.map((data) => data.close);

      setLabels(newLabels);
      setPriceData(newPriceData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques', error);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  // Données du graphique
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Prix de l\'action (USD)',
        data: priceData,
        fill: false,
        borderColor: '#007bff',
      },
    ],
  };

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution du cours de l\'action AAPL',
      },
    },
  };

  return (
    <div className="container mt-4">
      <div className="tab-content mt-4">
        {activeTab === 'Informations' && (
          <div className="d-flex">
            <div className="chart-section">
              <Line data={data} options={options} height={500} width={1000} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
