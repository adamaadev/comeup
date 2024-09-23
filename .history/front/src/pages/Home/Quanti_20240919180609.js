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
          data.performance, data.croissance_CA_1_an, data.croissance_CA_5_ans, 
          data.croissance_CA_10_ans, data.buyback_yield, data.croissance_annualisee, 
          data.croissance_moyenne, data.croissance_resultat_net_1_an, 
          data.croissance_resultat_net_5_ans, data.debt_equity, data.fcf_1_year, 
          data.fcf_5_years, data.fcf_10_years, data.fcf_margin_five_year, 
          data.fcf_margin_one_year, data.nbreannee, data.piotroski_score, 
          data.rachat_net_moyen, data.ratio_capex_revenu_net, data.ratio_payout, 
          data.roce, data.roce_5_year_avg
        );
      })
      .catch((error) => console.error("Erreur lors de la récupération des données:", error));
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
    performance, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans, 
    buyback_yield, croissance_annualisee, croissance_moyenne, croissance_resultat_net_1_an, 
    croissance_resultat_net_5_ans, debt_equity, fcf_1_year, fcf_5_years, fcf_10_years, 
    fcf_margin_five_year, fcf_margin_one_year, nbreannee, piotroski_score, 
    rachat_net_moyen, ratio_capex_revenu_net, ratio_payout, roce, roce_5_year_avg
  ) => {
    let newScore = 0;

    // Calcul pour la performance 5 ans
    if (performance > 13) {
      newScore += 1;
    } else if (performance >= 4 && performance <= 13) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 1 an
    if (croissance_CA_1_an > 10) {
      newScore += 1;
    } else if (croissance_CA_1_an >= 7 && croissance_CA_1_an <= 10) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 5 ans
    if (croissance_CA_5_ans > 10) {
      newScore += 1;
    } else if (croissance_CA_5_ans >= 7 && croissance_CA_5_ans <= 10) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 10 ans
    if (croissance_CA_10_ans > 10) {
      newScore += 1;
    } else if (croissance_CA_10_ans >= 7 && croissance_CA_10_ans <= 10) {
      newScore += 0.5;
    }

    // Calcul pour le Free Cash Flow 1 an
    if (fcf_1_year > 9) {
      newScore += 1;
    } else if (fcf_1_year >= 5 && fcf_1_year <= 9) {
      newScore += 0.5;
    }

    // Calcul pour le Free Cash Flow 5 ans
    if (fcf_5_years > 10) {
      newScore += 1;
    } else if (fcf_5_years >= 7 && fcf_5_years <= 10) {
      newScore += 0.5;
    }

    if (fcf_10_years > 10) {
      newScore += 1;
    } else if (fcf_10_years >= 7 && fcf_10_years  <= 10) {
      newScore += 0.5;
    }

    if (croissance_resultat_net_1_an > 12) {
      newScore += 1;
    } else if (croissance_resultat_net_1_an >= 10 && croissance_resultat_net_1_an  <= 12) {
      newScore += 0.5;
    }

    if (croissance_resultat_net_5_ans > 14) {
      newScore += 1;
    } else if (croissance_resultat_net_5_ans >= 8 && croissance_resultat_net_5_ans  <= 14) {
      newScore += 0.5;
    }

    if (roce > 12) {
      newScore += 1;
    } else if (roce >= 8 && roce <= 14) {
      newScore += 0.5;
    }

    if (newScore > 20) {
      newScore = 20;
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
        <div className="card-body">
          <h4>Score: {score}</h4> {/* Affichage du score */}
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderRatioRow('Performance 5 ans', infos.performance + " %")}
              {renderRatioRow('Croissance CA 1 an', infos.croissance_CA_1_an + " %")}
              {renderRatioRow('Croissance CA 5 ans', infos.croissance_CA_5_ans + " %")}
              {renderRatioRow('Croissance CA 10 ans', infos.croissance_CA_10_ans + " %")}
              {renderRatioRow('FCF 1 an', infos.fcf_1_year + " %")}
              {renderRatioRow('FCF 5 ans', infos.fcf_5_years + " %")}
              {renderRatioRow('FCF 10 ans', infos.fcf_10_years + " %")}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Profits</h5>
              {renderRatioRow('Résultat Net 1 an', infos.croissance_resultat_net_1_an + " %")}
              {renderRatioRow('Résultat Net 5 ans', infos.croissance_resultat_net_5_ans + " %")}
              {renderRatioRow('CAPEX / Résultat Net (Moy 5A)', infos.ratio_capex_revenu_net + " %")}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Rentabilité</h5>
              {renderRatioRow('ROCE 1 an', infos.roce + " %")}
              {renderRatioRow('ROCE 5 ans', infos.roce_5_year_avg + " %")}
              {renderRatioRow('Free Cash Flow Margin 1 an', infos.fcf_margin_one_year + " %")}
              {renderRatioRow('Free Cash Flow Margin 5 ans', infos.fcf_margin_five_year + " %")}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Santé</h5>
              {renderRatioRow('Debt to Equity Ratio', infos.debt_equity)}
              {renderRatioRow('Payout Ratio', infos.ratio_payout + " %")}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Dividende</h5>
              {renderRatioRow('Croissance 1 AN', infos.croissance_annualisee + " %")}
              {renderRatioRow('Croissance (Moy 5A)', infos.croissance_moyenne + " %")}
              {renderRatioRow('Le dividende n\'a pas diminué depuis', infos.nbreannee)}
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Autre</h5>
              {renderRatioRow('Buyback Yield', infos.buyback_yield)}
              {renderRatioRow('Piotroski Score', infos.piotroski_score)}
              {renderRatioRow('Rachat net d\'actions (Moy 5A)', formatNumber(infos.rachat_net_moyen))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
