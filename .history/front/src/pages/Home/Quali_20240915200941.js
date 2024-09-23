import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [quantiScore, setQuantiScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        console.log(res.data);
        const data = res.data[0];
        setInfos(data);
        calculateScore(data);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  const calculateScore = (data) => {
    // Helper function to ensure value is a number
    const getNumber = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    const ratios = [
      getNumber(data.buyback_yield),
      getNumber(data.croissance_CA_1_an),
      getNumber(data.croissance_CA_5_ans),
      getNumber(data.croissance_CA_10_ans),
      getNumber(data.croissance_annualisee),
      getNumber(data.croissance_moyenne),
      getNumber(data.croissance_resultat_net_1_an),
      getNumber(data.croissance_resultat_net_5_ans),
      getNumber(data.fcf_1_year),
      getNumber(data.fcf_5_years),
      getNumber(data.fcf_10_years),
      getNumber(data.fcf_margin_five_year),
      getNumber(data.fcf_margin_one_year),
      getNumber(data.performance),
      getNumber(data.piotroski_score),
      getNumber(data.rachat_net_moyen),
      getNumber(data.ratio_capex_revenu_net),
      getNumber(data.ratio_payout),
      getNumber(data.roce),
      getNumber(data.roce_5_year_avg),
      getNumber(data.debt_equity),
      getNumber(data.nbreannee)
    ];

    let score = 0;
    ratios.forEach(ratio => {
      if (ratio >= 15) {
        score += 1;
      } else if (ratio >= 10) {
        score += 0.5;
      }
      // No points added if ratio < 10
    });

    setQuantiScore(score);
  };

  return (
    <div>
      <div>
        <div className="container mt-4">
        <h2>Quanti Score: {quantiScore} / 20</h2>
          <div className="row">
            {/* Croissance */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Croissance</h5>
                </div>
                <div className="card-body">
                  <p>Performance 5 ans : {infos.performance || 'N/A'} %</p>
                  <p>Croissance CA 1 an : {infos.croissance_CA_1_an} %</p>
                  <p>Croissance CA 5 ans :{infos.croissance_CA_5_ans} %</p>
                  <p>Croissance CA 10 ans : {infos.croissance_CA_10_ans} %</p>
                  <p>FCF 1 an : {infos.fcf_1_year || 'N/A'} %</p>
                  <p>FCF 5 ans : {infos.fcf_5_years || 'N/A'} %</p>
                  <p>FCF 10 ans :{infos.fcf_10_years || 'N/A'} %</p>
                </div>
              </div>
            </div>

            {/* Profits */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Profits</h5>
                </div>
                <div className="card-body">
                  <p>Résultat Net 1 an : {infos.croissance_resultat_net_1_an || 'N/A'} %</p>
                  <p>Résultat Net 5 ans :{infos.croissance_resultat_net_5_ans || 'N/A'} %</p>
                  <p>CAPEX / Résultat Net (Moy 5A) : {infos.ratio_capex_revenu_net || 'N/A'} %</p>
                </div>
              </div>
            </div>

            {/* Rentabilité */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Rentabilité</h5>
                </div>
                <div className="card-body">
                  <p>ROCE 1 an : {infos.roce || 'N/A'}%</p>
                  <p>ROCE 5 ans : {infos.roce_5_year_avg || 'N/A'}%</p>
                  <p>Free Cash Flow Margin 1 an : {infos.fcf_margin_one_year || 'N/A'} %</p>
                  <p>Free Cash Flow Margin 5 ans : {infos.fcf_margin_five_year || 'N/A'} %</p>
                </div>
              </div>
            </div>

            {/* Santé */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Santé</h5>
                </div>
                <div className="card-body">
                  <p>Debt to Equity Ratio : {infos.debt_equity || 'N/A'}</p>
                  <p>Payout Ratio de : {infos.ratio_payout || 'N/A'} % </p>
                </div>
              </div>
            </div>

            {/* Dividende */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Dividende</h5>
                </div>
                <div className="card-body">
                  <p>Croissance 1 AN : {infos.croissance_annualisee || 'N/A'} %</p>
                  <p>Croissance (Moy 5A) : {infos.croissance_moyenne || 'N/A'} %</p>
                  <p>Le dividende n'a pas diminué depuis : {infos.nbreannee || 'N/A'} an(s) </p>
                </div>
              </div>
            </div>

            {/* Autre */}
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5>Autre</h5>
                </div>
                <div className="card-body">
                  <p>Buyback Yield : {infos.buyback_yield || 'N/A'}</p>
                  <p>Piotroski Score : {infos.piotroski_score || 'N/A'} / 9 points</p>
                  <p>Rachat net moyen d'actions (moy 5A) : {infos.rachat_net_moyen || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
