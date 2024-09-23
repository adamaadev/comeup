import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
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

const CompanyHeader = () => {
  const [activeTab, setActiveTab] = useState('resume');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resume':
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
          <button className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>
            Résumé
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'quant' ? 'active' : ''}`} onClick={() => setActiveTab('quant')}>
            Quantitatif
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'concurrents' ? 'active' : ''}`} onClick={() => setActiveTab('concurrents')}>
            Concurrents
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'resume' && (
          <div className="d-flex">
            <div className="chart-section">
              <Line data={data} options={options} />
            </div>
            <div className="info-section">
              <h4>Informations</h4>
              <p>Ticker: MA</p>
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

export default CompanyHeader;
