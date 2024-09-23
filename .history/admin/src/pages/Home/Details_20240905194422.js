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

  const type = "admin";
  const { symbol } = useParams();
  const [id, setId] = useState(0);
  const [infos, setInfos] = useState({});
  const [exist, setExist] = useState(true);

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id))

    axios.post('http://localhost:4000/listcompany', { symbol })
      .then(res => {
        if (res.data.length > 0) {
          setInfos(res.data[0]);
        }
      })
      .catch(error => console.error('Error fetching company information:', error));

  }, [symbol]);

  useEffect(() => {
    if (id > 0) {
      axios.post('http://localhost:4000/checkcompany', { symbol, id , type })
        .then(res => setExist(res.data.exist))
    }
  }, [symbol, id]);

  const add = () => {
    console.log(id);
    
    axios.post('http://localhost:4000/addcompany', { symbol, id, type })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      })
  };

  const removeFromWatchlist = () => {
    axios.post('http://localhost:4000/deletecompany', { symbol, id , type })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      })
  };


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
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Informations':
        return <div>Résumé du contenu</div>;
      case 'quantitatif':
        return <div>Analyse Quantitative</div>;
      case 'concurrents':
        return <div>Liste des Concurrents</div>;
      case 'fondamental':
        return <div>Analyse Fondamentale</div>;
      case 'evaluation':
        return <div>Évaluation</div>;
      case 'historique':
        return <div>Historique des données</div>;
      default:
        return <div>Résumé du contenu</div>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="company-name">Mastercard Inc</h2>
          <p className="stock-price">476,45 USD</p>
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
            <div className="info-section">
              <h4>Informations</h4>
              <p>Ticker: </p>
              <p>Bourse: New York Stock Exchange (XNYS)</p>
              <p>ISIN: US57636Q1040</p>
              <p>Pays: États-Unis</p>
              <p>Capitalisation: 446,53 Md $ (USD)</p>
              <p>Site internet: <a href="https://mastercard.com" target="_blank" rel="noreferrer">mastercard.com</a></p>
              <p>Secteur: Finance</p>
              <p>Devise: USD</p>
              <p>Éligible au PEA: Non</p>
              <p>Verse un dividende: Oui</p>
              <p>Rendement du dividende: 0,54%</p>
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