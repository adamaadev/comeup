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
        calculateScore(data.performance);
      });
  }, [symbol]);

  const getRatioLabel = (performance) => {
    if (performance > 13) {
      return 'Excellente';
    } else if (performance >= 4 && performance <= 13) {
      return 'Correct';
    } else {
      return 'Faible';
    }
  };

  const calculateScore = (performance) => {
    let newScore = 0;

    // Calcul pour la performance 5 ans
    if (performance > 13) {
      newScore += 1;  // Par exemple, +1 point si performance > 13%
    } else if (performance >= 4 && performance <= 13) {
      newScore += 0.5;  // Par exemple, +0.5 point si performance entre 4% et 13%
    } else {
      newScore += 0;  // Pas de points si performance < 4%
    }

    // Mettre à jour le score dans l'état
    setScore(newScore * 20); // Score ramené sur une base de 20
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
        <div className="card-header">
          {/* Affichage du score sur une base de 20 */}
          <h2>Quanti-score : {score} / 20</h2>
          {/* Affichage de la notation en fonction de la performance */}
          <h4>Notation : {getRatioLabel(infos.performance)}</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderRatioRow('Performance 5 ans', infos.performance + " %")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
