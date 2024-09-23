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
      <div className="d-flex justify-content-between align-items-center mb-4">
  <div className="d-flex align-items-center">
    <img
      src={infos.logo}
      alt={`${infos.Name} logo`}
      width="40"
      height="40"
      style={{ marginRight: '15px' }}
    />
    <div>
      <h2 className="company-name" style={{ margin: 0 }}>Mastercard Inc</h2>
      <p className="stock-price" style={{ margin: 0 }}>476,45 USD</p>
    </div>
  </div>
  <button className="btn btn-primary">Ajouter à <i className="arrow-icon"></i></button>
</div>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'Informations' ? 'active' : ''}`} onClick={() => setActiveTab('Informations')}>
            Informations
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'quant' ? 'active' : ''}`} onClick={() => setActiveTab('quant')}>
            Analyse Quantitative
          </button>
        </li>
      </ul>
      <div className="tab-content mt-4">
        {activeTab === 'Informations' && (
          <div className="d-flex">
            <div className="chart-section">
              <Line data={data} options={options} />
            </div>
          </div>
        )}
        {activeTab === 'quant' && (
          <div>
            <h4>Quantitatif</h4>
            <p>Données quantitatives à afficher ici.</p>
          </div>
        )}
        {activeTab === 'concurrents' && (
          <div>
            <h4>Concurrents</h4>
            <p>Liste des concurrents ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};