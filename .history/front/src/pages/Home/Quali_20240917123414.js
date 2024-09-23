import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [quantiScore, setQuantiScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
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

  // Composant pour la barre de progression colorée
  const ProgressBar = ({ value }) => {
    let color = 'bg-danger'; // Rouge par défaut

    if (value >= 15) {
      color = 'bg-success'; // Vert
    } else if (value >= 10) {
      color = 'bg-warning'; // Jaune
    }

    return (
      <div className="progress">
        <div
          className={`progress-bar ${color}`}
          role="progressbar"
          style={{ width: `${Math.min(value, 100)}%` }}
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {value || 'N/A'}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Note Quantitative : {quantiScore} / 20</h2>
        </div>
        <div className="card-body">
  <div className="row">
    {/* Croissance */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Croissance</h5>
      <p>
        Performance 5 ans : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.performance} />
        </span> 
        % 
      </p>
      <p>
        Croissance CA 1 an : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_CA_1_an} />
        </span> 
        % 
      </p>
      <p>
        Croissance CA 5 ans : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_CA_5_ans} />
        </span> 
        % 
      </p>
      <p>
        Croissance CA 10 ans : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_CA_10_ans} />
        </span> 
        % 
      </p>
    </div>

    {/* Profits */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Profits</h5>
      <p>
        Résultat Net 1 an : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_resultat_net_1_an} />
        </span> 
        % 
      </p>
      <p>
        Résultat Net 5 ans : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_resultat_net_5_ans} />
        </span> 
        % 
      </p>
    </div>

    {/* Rentabilité */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Rentabilité</h5>
      <p>
        ROCE 1 an : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.roce} />
        </span> 
        % 
      </p>
      <p>
        ROCE 5 ans : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.roce_5_year_avg} />
        </span> 
        % 
      </p>
    </div>

    {/* Santé */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Santé</h5>
      <p>
        Debt to Equity Ratio : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.debt_equity} />
        </span>
      </p>
    </div>

    {/* Dividende */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Dividende</h5>
      <p>
        Croissance 1 AN : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.croissance_annualisee} />
        </span> 
        % 
      </p>
      <p>
        Le dividende n'a pas diminué depuis : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.nbreannee} />
        </span> 
        an(s)
      </p>
    </div>

    {/* Autre */}
    <div className="col-md-6 col-lg-4 mb-4">
      <h5>Autre</h5>
      <p>
        Buyback Yield : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.buyback_yield} />
        </span> 
        % 
      </p>
      <p>
        Piotroski Score : <span style={{ display: 'inline-block', width: '50%' }}>
          <ProgressBar value={infos.piotroski_score} />
        </span> 
        / 9 points
      </p>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
