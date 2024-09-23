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
        // Assurez-vous que toutes les données sont passées à calculateScore
        calculateScore(
          data.performance,
        );
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

  const calculateScore = (
    performance ) => {
    let newScore = 0;

    // Calcul pour la performance 5 ans
    if (performance > 13) {
      newScore += 1;
    } else if (performance >= 4 && performance <= 13) {
      newScore += 0.5;
    }

   
    setScore(newScore); // Mise à jour du score
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
          <h2>Quanti-score : {score} / 20</h2>
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
