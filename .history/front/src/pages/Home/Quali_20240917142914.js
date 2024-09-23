import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Fonction de formatage
const formatValue = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Donnée indisponible';
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} milliards`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)} millions`;
  } else {
    return num.toFixed(2);
  }
};

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

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) {
      return 'N/A'; // Gérer le cas où num est undefined ou NaN
    }
    if (Math.abs(num) >= 1e9) {
      return (Math.round(num / 1e7) / 100) + ' B'; // Arrondir à deux chiffres après la virgule
    } else if (Math.abs(num) >= 1e6) {
      return (Math.round(num / 1e4) / 100) + ' M'; // Arrondir à deux chiffres après la virgule
    } else {
      return num.toFixed(2); // Limiter à deux chiffres après la virgule
    }
  };

  const getBarColor = (value) => {
    if (value >= 15) {
      return 'bg-success'; // Green
    } else if (value >= 10) {
      return 'bg-warning'; // Yellow
    } else {
      return 'bg-danger'; // Red
    }
  };

  const renderRatioRow = (label, value) => (
    <div className="d-flex align-items-center mb-2">
      <span className="me-3">{label} :</span>
      <div className="progress" style={{ width: '20%', marginRight: '10px' }}>
        <div
          className={`progress-bar ${getBarColor(value)}`}
          role="progressbar"
          style={{ width: `${Math.min(value, 100)}%`, textAlign: 'center' }}
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {value !== undefined ? formatValue(value) : 'N/A'}
        </div>
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
          <div className="mb-3">
            <h6>Performance 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.performance * 100}%` }}
                aria-valuenow={infos.performance * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.performance * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Croissance CA 1 an</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_CA_1_an * 100}%` }}
                aria-valuenow={infos.croissance_CA_1_an * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_CA_1_an * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Croissance CA 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_CA_5_ans * 100}%` }}
                aria-valuenow={infos.croissance_CA_5_ans * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_CA_5_ans * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Croissance CA 10 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_CA_10_ans * 100}%` }}
                aria-valuenow={infos.croissance_CA_10_ans * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_CA_10_ans * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>FCF 1 an</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.fcf_1_year * 100}%` }}
                aria-valuenow={infos.fcf_1_year * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.fcf_1_year * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>FCF 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.fcf_5_years * 100}%` }}
                aria-valuenow={infos.fcf_5_years * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.fcf_5_years * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>FCF 10 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.fcf_10_years * 100}%` }}
                aria-valuenow={infos.fcf_10_years * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.fcf_10_years * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <h5>Profits</h5>
          <div className="mb-3">
            <h6>Résultat Net 1 an</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_resultat_net_1_an * 100}%` }}
                aria-valuenow={infos.croissance_resultat_net_1_an * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_resultat_net_1_an * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Résultat Net 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_resultat_net_5_ans * 100}%` }}
                aria-valuenow={infos.croissance_resultat_net_5_ans * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_resultat_net_5_ans * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>CAPEX / Résultat Net (Moy 5A)</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.ratio_capex_revenu_net * 100}%` }}
                aria-valuenow={infos.ratio_capex_revenu_net * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.ratio_capex_revenu_net * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <h5>Rentabilité</h5>
          <div className="mb-3">
            <h6>ROCE 1 an</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.roce * 100}%` }}
                aria-valuenow={infos.roce * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.roce * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>ROCE 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.roce_5_year_avg * 100}%` }}
                aria-valuenow={infos.roce_5_year_avg * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.roce_5_year_avg * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Free Cash Flow Margin 1 an</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.fcf_margin_one_year * 100}%` }}
                aria-valuenow={infos.fcf_margin_one_year * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.fcf_margin_one_year * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Free Cash Flow Margin 5 ans</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.fcf_margin_five_year * 100}%` }}
                aria-valuenow={infos.fcf_margin_five_year * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.fcf_margin_five_year * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <h5>Santé</h5>
          <div className="mb-3">
            <h6>Debt to Equity Ratio</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.debt_equity}%` }}
                aria-valuenow={infos.debt_equity}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${infos.debt_equity}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Payout Ratio</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.ratio_payout * 100}%` }}
                aria-valuenow={infos.ratio_payout * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.ratio_payout * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <h5>Dividende</h5>
          <div className="mb-3">
            <h6>Croissance 1 AN</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_annualisee * 100}%` }}
                aria-valuenow={infos.croissance_annualisee * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_annualisee * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Croissance (Moy 5A)</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.croissance_moyenne * 100}%` }}
                aria-valuenow={infos.croissance_moyenne * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.croissance_moyenne * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Le dividende n'a pas diminué depuis</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.nbreannee}%` }}
                aria-valuenow={infos.nbreannee}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${infos.nbreannee}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <h5>Autre</h5>
          <div className="mb-3">
            <h6>Buyback Yield</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.buyback_yield * 100}%` }}
                aria-valuenow={infos.buyback_yield * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${(infos.buyback_yield * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Piotroski Score</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.piotroski_score}%` }}
                aria-valuenow={infos.piotroski_score}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${infos.piotroski_score}%`}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h6>Rachat net d'actions (Moy 5A)</h6>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${infos.rachat_net_moyen}%` }}
                aria-valuenow={infos.rachat_net_moyen}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {`${infos.rachat_net_moyen}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
