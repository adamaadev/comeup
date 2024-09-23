import React, { useState } from 'react';
import StockInfo from './StockInfo';
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
    <StockInfo />

  );
};

export default CompanyHeader;
