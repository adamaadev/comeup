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

// Composant principal
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

      <div className="info-section">
        <h2>Croissance</h2>
        <ul>
          <li>Performance 5 ANS : {infos.croissance_CA_5_ans}</li>
          <li>CA 1 AN : {infos.croissance_CA_1_an}</li>
          <li>CA 5 ANS : {infos.croissance_CA_5_ans}</li>
          <li>CA 10 ANS : {infos.croissance_CA_10_ans}</li>
          <li>FCF 1 AN : {infos.fcf_1_year}</li>
          <li>FCF 5 ANS : {infos.fcf_5_years}</li>
          <li>FCF 10 ANS : {infos.fcf_10_years}</li>
        </ul>

        <h2>Profits</h2>
        <ul>
          <li>Résultat Net 1 AN : {infos.croissance_resultat_net_1_an}</li>
          <li>Résultat Net 5 ANS : {infos.croissance_resultat_net_5_ans}</li>
          <li>% CAPEX/Résultat Net (moyenne 5 ans) : {infos.ratio_capex_revenu_net}</li>
        </ul>
      </div>

      <div className="grid-container">
        <h2>Rentabilité</h2>
        <ul>
          <li>ROCE 1 AN : {infos.roce}</li>
          <li>ROCE 5 ANS : {infos.roce_5_year_avg}</li>
          <li>FCF Margin 1 AN : {infos.fcf_margin_one_year}</li>
          <li>FCF Margin 5 ANS : {infos.fcf_margin_five_year}</li>
        </ul>

        <h2>Santé</h2>
        <ul>
          <li>Debt/Equity : {infos.debt_equity}</li>
          <li>Payout Ratio : {infos.ratio_payout}</li>
        </ul>
      </div>

      <div className="grid-container">
        <h2>Dividende</h2>
        <ul>
          <li>Croissance 1 AN : {infos.croissance_annualisee}</li>
          <li>Croissance Moyenne 5 ANS : {infos.croissance_moyenne}</li>
          <li>Année Sans Interruption : {infos.nbreannee}</li>
        </ul>

        <h2>Autre</h2>
        <ul>
          <li>Buyback Yield : {infos.buyback_yield}</li>
          <li>Piotroski-Score : {infos.piotroski_score}</li>
        </ul>
      </div>
    </div>
  );
}
