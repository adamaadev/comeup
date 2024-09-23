import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chartjs-adapter-date-fns'; // Import the date adapter

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
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function Details() {
  const [labels, setLabels] = useState([]);
  const [priceData, setPriceData] = useState([]);

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        'https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=36&apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX'
      );
      const historical = response.data.historical;

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

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Prix de l\'action (USD)',
        data: priceData,
        fill: false,
        borderColor: '#007bff',
        borderWidth: 2,
        tension: 0.4, 
      },
      {
        label: 'Prix juste',
        data: new Array(labels.length).fill(400),
        borderColor: '#0000ff',
        borderWidth: 2,
        borderDash: [5, 5], 
        fill: false,
        pointRadius: 0 
      }
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          tooltipFormat: 'yyyy-MM-dd',
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
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution du cours de l\'action AAPL avec Prix Juste',
      },
    },
  };

  return (
    <div className="container mt-4">
      <div className="chart-section">
    
