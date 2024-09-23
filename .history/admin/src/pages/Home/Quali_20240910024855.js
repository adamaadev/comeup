import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        const data = res.data[0];
        setInfos(data);

        // Calculer le score quantitatif
        const calculateScore = (ratio) => {
          if (ratio < 10) return 0;
          if (ratio >= 10 && ratio <= 14) return 0.5;
          if (ratio > 15) return 1;
          return 0;
        };

        const totalScore = [
          data.croissance_CA_5_ans,
          data.croissance_CA_1_an,
          data.croissance_CA_10_ans,
          data.fcf_1_year,
          data.fcf_5_years,
          data.fcf_10_years,
          data.croissance_resultat_net_1_an,
          data.croissance_resultat_net_5_ans,
          data.ratio_capex_revenu_net,
          data.roce,
          data.roce_5_year_avg,
          data.fcf_margin_one_year,
          data.fcf_margin_five_year,
          data.debt_equity,
          data.ratio_payout,
          data.croissance_annualisee,
          data.croissance_moyenne,
          data.nbreannee,
          data.buyback_yield,
          data.piotroski_score
        ].reduce((acc, ratio) => acc + calculateScore(ratio), 0);

        setScore(totalScore);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  return (
    <div>
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

      <div className="score-section">
        <h2>Score Quantitatif : {score.toFixed(2)}/20</h2>
      </div>
    </div>
  );
}
