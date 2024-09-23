import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quati({ symbol }) {
  const [infos, setInfos] = useState({});

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        const data = res.data[0];
        setInfos(data);
      });
  }, [symbol]);

  // Fonction pour obtenir l'étiquette de notation en fonction du ratio
  const getRatioLabel = (performance) => {
    if (performance > 13) {
      return 'Excellente';
    } else if (performance >= 4 && performance <= 13) {
      return 'Correct';
    } else {
      return 'Faible';
    }
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
          <h2>Quanti-score</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderRatioRow('Performance 5 ans', infos.performance + " %")}
              {/* Affichage de la notation en fonction de la performance */}
              <div className="d-flex align-items-center mb-2">
                <span className="me-3">Notation :</span>
                <span>{getRatioLabel(infos.performance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
