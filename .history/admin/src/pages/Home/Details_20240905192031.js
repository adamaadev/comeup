import React, { useState } from 'react';

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
    {/* Ajouter d'autres tabs */}
  </ul>

  <div className="tab-content mt-4">
    {activeTab === 'resume' && (
      <div className="d-flex">
        <div className="chart-section">
          <h3>Évolution du cours de l'action</h3>
          {/* Insérer ici un graphique, par exemple avec Chart.js */}
        </div>
        <div className="info-section">
          <h4>Informations</h4>
          <p>Ticker: MA</p>
          <p>Bourse: New York Stock Exchange (XNYS)</p>
          <p>ISIN: US57636Q1040</p>
          <p>Pays: États-Unis</p>
          <p>Capitalisation: 446,53 Md $ (USD)</p>
          <p>Site internet: <a href="https://mastercard.com" target="_blank">mastercard.com</a></p>
          <p>Secteur: Finance</p>
          <p>Devise: USD</p>
          <p>Éligible au PEA: Non</p>
          <p>Verse un dividende: Oui</p>
          <p>Rendement du dividende: 0,54%</p>
        </div>
      </div>
    )}
    {/* Ajouter le contenu pour les autres tabs */}
  </div>
</div>

  );
};

export default CompanyHeader;
