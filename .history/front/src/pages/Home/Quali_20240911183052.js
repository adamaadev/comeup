import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Function to calculate the quantitative score
const calculateQuantiScore = (infos) => {
  const thresholds = { min: 10, mid: 14, max: 15 };
  let score = 0;

  const ratios = [
    infos.croissance_CA_5_ans,
    infos.croissance_CA_1_an,
    infos.croissance_CA_5_ans,
    infos.croissance_CA_10_ans,
    infos.fcf_1_year,
    infos.fcf_5_years,
    infos.fcf_10_years,
    infos.croissance_resultat_net_1_an,
    infos.croissance_resultat_net_5_ans,
    infos.ratio_capex_revenu_net,
    infos.roce,
    infos.roce_5_year_avg,
    infos.fcf_margin_one_year,
    infos.fcf_margin_five_year,
    infos.debt_equity,
    infos.ratio_payout,
    infos.croissance_annualisee,
    infos.croissance_moyenne,
    infos.nbreannee,
    infos.buyback_yield,
    infos.piotroski_score
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

  return (score / (ratios.length * 1)) * 20;
};

// Main component
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

  const getProgressBarColor = (score) => {
    if (score >= 15) return 'green';
    if (score >= 10) return 'yellow';
    return 'red';
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>Note quantitative</h2>
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

      <div className="grid-container">
        {/* Rentabilité Section */}
        <div>
          <h3>Rentabilité</h3>
          <ul>
            <li>ROIC 1A: {infos.roce}</li>
            <li>ROIC 5A: {infos.roce_5_year_avg}</li>
            <li>ROE 1A: {infos.fcf_margin_one_year}</li>
            <li>ROE 5A: {infos.fcf_margin_five_year}</li>
          </ul>
        </div>

        {/* Profits Section */}
        <div>
          <h3>Profits</h3>
          <ul>
            <li>Marge brute: {infos.marge_brute}</li>
            <li>Marge opé.: {infos.marge_ope}</li>
            <li>Marge nette: {infos.marge_nette}</li>
          </ul>
        </div>

        {/* Croissance Section */}
        <div>
          <h3>Croissance</h3>
          <ul>
            <li>CA 1A: {infos.croissance_CA_1_an}</li>
            <li>CA 5A: {infos.croissance_CA_5_ans}</li>
            <li>CA 10A: {infos.croissance_CA_10_ans}</li>
            <li>Prédictibilité: {infos.predictibilite}</li>
          </ul>
        </div>

        {/* Bénéfices Section */}
        <div>
          <h3>Bénéfices</h3>
          <ul>
            <li>FCF 1A: {infos.fcf_1_year}</li>
            <li>FCF 5A: {infos.fcf_5_years}</li>
            <li>FCF 10A: {infos.fcf_10_years}</li>
          </ul>
        </div>

        {/* Santé Section */}
        <div>
          <h3>Santé</h3>
          <ul>
            <li>Dettes: {infos.debt_equity}</li>
            <li>Payout ratio: {infos.ratio_payout}</li>
          </ul>
        </div>

        {/* Dividende Section */}
        <div>
          <h3>Dividende</h3>
          <ul>
            <li>Div 1A: {infos.croissance_annualisee}</li>
            <li>Div 5A: {infos.croissance_moyenne}</li>
            <li>Div 10A: {infos.nbreannee}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
