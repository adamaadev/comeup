import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Fonction pour calculer le score quantitatif
const calculateQuantiScore = (infos) => {
  const thresholds = { min: 10, mid: 14, max: 15 };
  let score = 0;
  
  const ratios = [
    infos.croissance_CA_5_ans, infos.croissance_CA_1_an, infos.croissance_CA_10_ans,
    infos.fcf_1_year, infos.fcf_5_years, infos.fcf_10_years,
    infos.croissance_resultat_net_1_an, infos.croissance_resultat_net_5_ans,
    infos.ratio_capex_revenu_net, infos.roce, infos.roce_5_year_avg,
    infos.fcf_margin_one_year, infos.fcf_margin_five_year, infos.debt_equity,
    infos.ratio_payout, infos.croissance_annualisee, infos.croissance_moyenne,
    infos.nbreannee, infos.buyback_yield, infos.piotroski_score
  ];
  
  ratios.forEach(ratio => {
    if (ratio < thresholds.min) {
      score += 0;
    } else if (ratio >= thresholds.min && ratio <= thresholds.mid) {
      score += 0.5;
    } else if (ratio > thresholds.mid) {
      score += 1;
    }
  });

  // Normalize score to be out of 20
  return (score / (ratios.length * 1)) * 20;
};

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [quantiScore, setQuantiScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        setInfos(res.data[0]);
        setQuantiScore(calculateQuantiScore(res.data[0]));
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  // Fonction pour déterminer la couleur de la barre de progression
  const getProgressBarColor = (score) => {
    if (score >= 15) return 'green';
    if (score >= 10) return 'yellow';
    return 'red';
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Quanti Score /20</h2>
        <div style={{ 
          height: '20px', 
          width: '100%', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '10px', 
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: '100%', 
            width: `${quantiScore}%`, 
            backgroundColor: getProgressBarColor(quantiScore), 
            transition: 'width 0.5s'
          }}></div>
        </div>
      </div>

      {/* Rest of your code... */}
      <div className="info-section">
        {/* ... */}
      </div>

      <div className="grid-container">
        {/* ... */}
      </div>

      <div className="grid-container">
        {/* ... */}
      </div>
    </div>
  );
}
