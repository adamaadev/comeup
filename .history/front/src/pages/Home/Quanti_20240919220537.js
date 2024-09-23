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
        calculateScore(data.performance, data.croissance_CA_1_an); // Calcul du score dès que les données sont récupérées
      })
  }, [symbol]);

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'N/A'; // Gérer les cas indéfinis ou NaN
    }
    if (Math.abs(num) >= 1e9) {
      return (Math.round(num / 1e7) / 100) + ' Milliards'; // Arrondir à deux décimales
    } else if (Math.abs(num) >= 1e6) {
      return (Math.round(num / 1e4) / 100) + ' Millions'; // Arrondir à deux décimales
    } else {
      return num.toFixed(2); // Limiter à deux décimales
    }
  };

  // Fonction pour calculer le score basé sur les deux ratios
  const calculateScore = (performance, croissance_CA_1_an) => {
    let newScore = 0;

    // Calcul pour la performance 5 ans
    if (performance > 13) {
      newScore += 1;
    } else if (performance >= 4 && performance <= 13) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 1 an
    if (croissance_CA_1_an > 10) {
      newScore += 1;
    } else if (croissance_CA_1_an >= 7 && croissance_CA_1_an <= 10) {
      newScore += 0.5;
    }

    setScore(newScore); // Met à jour le score
  };

  const renderRatioRow = (label, value) => (
    <div className="d-flex align-items-center mb-2">
      <span className="me-3">{label} :</span>
      <span>{value !== undefined ? value : 'N/A'}</span>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h4>Score: {score}</h4> {/* Affichage du score */}
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderRatioRow('Performance 5 ans', infos.performance + " %")}
              {renderRatioRow('Croissance CA 1 an', infos.croissance_CA_1_an + " %")}
              {renderRatioRow('Croissance CA 5 ans', infos.croissance_CA_5_ans + " %")}
              {renderRatioRow('Croissance CA 10 ans', infos.croissance_CA_10_ans + " %")}
              {renderRatioRow('FCF 1 an', infos.fcf_1_year + " %")}
              {renderRatioRow('FCF 5 ans', infos.fcf_5_years + " %")}
              {renderRatioRow('FCF 10 ans', infos.fcf_10_years + " %")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
