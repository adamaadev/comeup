import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Quali.css'; // Ajoutez les styles personnalisés ici

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        setInfos(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  // Fonction pour formater les pourcentages
  const formatProgress = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${value}%`;
  };

  const getProgressColor = (value) => {
    if (value >= 75) return 'green';  // vert pour haute performance
    if (value < 25) return 'red';     // rouge pour basse performance
    return 'blue';                    // bleu pour moyenne performance
  };

  return (
    <div className="container">
      <div className="section">
        <h6 className="section-title">Rentabilité</h6>
        <ul className="section-list">
          <li className="list-item">
            ROIC 1A: {formatProgress(infos.roce)}
            <div className="progress-bar">
              <div className="progress" 
                style={{ width: `${infos.roce || 0}%`, backgroundColor: getProgressColor(infos.roce) }}>
              </div>
            </div>
          </li>
          <li className="list-item">
            ROCE 5A: {formatProgress(infos.roce_5_year_avg)}
            <div className="progress-bar">
              <div className="progress" 
                style={{ width: `${infos.roce_5_year_avg || 0}%`, backgroundColor: getProgressColor(infos.roce_5_year_avg) }}>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="section">
        <h6 className="section-title">Croissance</h6>
        <ul className="section-list">
          <li className="list-item">
            CA 1 AN: {formatProgress(infos.croissance_CA_1_an)}
            <div className="progress-bar">
              <div className="progress" 
                style={{ width: `${infos.croissance_CA_1_an || 0}%`, backgroundColor: getProgressColor(infos.croissance_CA_1_an) }}>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
