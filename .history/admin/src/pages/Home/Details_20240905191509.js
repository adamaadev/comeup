import React, { useState } from 'react';
import './App.css'; // Assurez-vous d'importer le CSS pour le style personnalisé

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <img
            src="https://logo.clearbit.com/mastercard.com"
            alt="Logo"
            className="company-logo"
          />
          <div className="ms-3">
            <h2 className="mb-0">Mastercard Inc</h2>
            <p className="text-muted">476,45 USD</p>
          </div>
        </div>
        <button className="btn btn-primary">
          Ajouter à <i className="bi bi-caret-down-fill"></i>
        </button>
      </div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            Résumé
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'quantitatif' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantitatif')}
          >
            Quantitatif
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'concurrents' ? 'active' : ''}`}
            onClick={() => setActiveTab('concurrents')}
          >
            Concurrents
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'fondamental' ? 'active' : ''}`}
            onClick={() => setActiveTab('fondamental')}
          >
            Fondamental
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'evaluation' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluation')}
          >
            Évaluation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'historique' ? 'active' : ''}`}
            onClick={() => setActiveTab('historique')}
          >
            Historique
          </button>
        </li>
      </ul>
      <div className="mt-3">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CompanyHeader;
