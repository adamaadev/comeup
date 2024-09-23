import axios from 'axios';
import React, { useEffect, useState } from 'react';
export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [quantiScore, setQuantiScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        console.log(res.data);
        
        setInfos(res.data[0]);
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
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>Quanti Score</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            height: '20px', 
            width: '70%', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '10px', 
            overflow: 'hidden',
            marginRight: '10px'
          }}>
            <div style={{ 
              height: '100%', 
              width: `${quantiScore}%`, 
              backgroundColor: getProgressBarColor(quantiScore), 
              transition: 'width 0.5s'
            }}></div>
          </div>
          <span>{quantiScore.toFixed(1)} / 20</span>
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
