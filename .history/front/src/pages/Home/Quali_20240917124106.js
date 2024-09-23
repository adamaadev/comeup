import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      if (ratio >= 10) {
        score += 1;
      } else if (ratio >= 7) {
        score += 0.5;
      }
    });

    setQuantiScore(score);
  };

  const getProgressBarColor = (value) => {
    if (value < 10) {
      return 'danger'; // Red
    } else if (value >= 10 && value < 15) {
      return 'warning'; // Yellow
    } else {
      return 'success'; // Green
    }
  };

  const renderProgressBar = (label, value) => (
    <div className="d-flex align-items-center mb-2">
      <div style={{ width: '40%' }}>
        <strong>{label}</strong>
      </div>
      <div style={{ width: '10%', margin: '0 15px' }}>
        <strong>{value || 'N/A'}</strong>
      </div>
      <div style={{ width: '50%' }}>
        <ProgressBar 
          variant={getProgressBarColor(value)} 
          now={Math.min(value, 100)} 
          label={`${value}%`} 
          className="w-100" 
        />
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Note Quantitative : {quantiScore} / 20</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              {renderProgressBar('Performance 5 ans',)}
              {renderProgressBar('Croissance CA 1 an', infos.croissance_CA_1_an)}
              {renderProgressBar('Croissance CA 5 ans', infos.croissance_CA_5_ans)}
              {renderProgressBar('Croissance CA 10 ans', infos.croissance_CA_10_ans)}
              {renderProgressBar('FCF 1 an', infos.fcf_1_year)}
              {renderProgressBar('FCF 5 ans', infos.fcf_5_years)}
              {renderProgressBar('FCF 10 ans', infos.fcf_10_years)}
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Profits</h5>
              {renderProgressBar('Résultat Net 1 an', infos.croissance_resultat_net_1_an)}
              {renderProgressBar('Résultat Net 5 ans', infos.croissance_resultat_net_5_ans)}
              {renderProgressBar('CAPEX / Résultat Net (Moy 5A)', infos.ratio_capex_revenu_net)}
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Rentabilité</h5>
              {renderProgressBar('ROCE 1 an', infos.roce)}
              {renderProgressBar('ROCE 5 ans', infos.roce_5_year_avg)}
              {renderProgressBar('FCF Margin 1 an', infos.fcf_margin_one_year)}
              {renderProgressBar('FCF Margin 5 ans', infos.fcf_margin_five_year)}
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Santé</h5>
              {renderProgressBar('Debt to Equity', infos.debt_equity)}
              {renderProgressBar('Payout Ratio', infos.ratio_payout)}
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Dividende</h5>
              {renderProgressBar('Croissance 1 an', infos.croissance_annualisee)}
              {renderProgressBar('Croissance Moyenne (5A)', infos.croissance_moyenne)}
              {renderProgressBar('Le dividende n\'a pas diminué depuis', infos.nbreannee)}
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Autre</h5>
              {renderProgressBar('Buyback Yield', infos.buyback_yield)}
              {renderProgressBar('Piotroski Score', infos.piotroski_score)}
              {renderProgressBar('Rachat net d\'actions (Moy 5A)', infos.rachat_net_moyen)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
