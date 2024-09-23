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

  // Function to get the color based on ratio value
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
      <span className="me-3">{label}:</span>
      <div className="progress" style={{ width: '10%', marginRight: '10px' }}>
        <div
          className={`progress-bar ${getBarColor(value)}`}
          role="progressbar"
          style={{ width: `${Math.min(value, 100)}%` }} // To ensure the width doesn't exceed 100%
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <span style={{ color: 'black' }}>{value !== undefined ? value : 'N/A'}</span>
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
              {renderRatioRow
