import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quati({ symbol }) {
  const [infos, setInfos] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        const data = res.data[0];
        setInfos(data);
        // Passer toutes les données nécessaires à calculateScore
        calculateScore(data);
      })
      .catch((error) => console.error("Erreur lors de la récupération des données:", error));
  }, [symbol]);

  const calculateScore = (data) => {
    let newScore = 0;
    // Exemple de calcul simplifié pour le score
    if (data.performance > 13) {
      newScore += 1;
    }
    // Ajouter d'autres calculs...
    setScore(newScore);
  };

  // Fonction pour attribuer une notation en fonction des ratios
  const getNotation = (value, excellentThreshold, correctThreshold) => {
    if (value > excellentThreshold) {
      return 'Excellent';
    } else if (value >= correctThreshold) {
      return 'Correct';
    } else {
      return 'Faible';
    }
  };

  const renderRatioRow = (label, value, excellentThreshold, correctThreshold) => {
    const notation = getNotation(value, excellentThreshold, correctThreshold);
    return (
      <div className="d-flex align-items-center mb-2">
        <span className="me-3">{label} :</span>
        <span>{value !== undefined ? value + " %" : 'N/A'} ({notation})</span>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Quanti-score : {score} / 20</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderRatioRow('Performance 5 ans', infos.performance, 13, 4)}
              {renderRatioRow('Croissance CA 1 an', infos.croissance_CA_1_an, 10, 7)}
              {renderRatioRow('Croissance CA 5 ans', infos.croissance_CA_5_ans, 10, 7)}
              {renderRatioRow('Croissance CA 10 ans', infos.croissance_CA_10_ans, 10, 7)}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Profits</h5>
              {renderRatioRow('Résultat Net 1 an', infos.croissance_resultat_net_1_an, 12, 10)}
              {renderRatioRow('Résultat Net 5 ans', infos.croissance_resultat_net_5_ans, 14, 8)}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Rentabilité</h5>
              {renderRatioRow('ROCE 1 an', infos.roce, 14, 7)}
              {renderRatioRow('ROCE 5 ans', infos.roce_5_year_avg, 15, 7)}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Santé</h5>
              {renderRatioRow('Debt to Equity Ratio', infos.debt_equity, 0.5, 1)}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Dividende</h5>
              {renderRatioRow('Croissance 1 AN', infos.croissance_annualisee, 10, 5)}
              {renderRatioRow('Croissance (Moy 5A)', infos.croissance_moyenne, 8, 5)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
