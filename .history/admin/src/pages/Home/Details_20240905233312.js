import React, { useState  , useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
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

export default function Details (){
  const [activeTab, setActiveTab] = useState('Informations');

  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Prix de l\'action (USD)',
        data: [450, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560],
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
        text: 'Évolution du cours de l\'action',
      },
    },
  };
  return (
    <div className="container mt-4">

      <div className="tab-content mt-4">
        {activeTab === 'Informations' && (
          <div className="d-flex">
            <div className="chart-section">
              <Line data={data} options={options} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};