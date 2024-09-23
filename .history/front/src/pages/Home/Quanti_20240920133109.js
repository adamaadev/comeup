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
      });
  }, [symbol]);

  const getProgressColor = (performance, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans, 
    buyback_yield, croissance_annualisee, croissance_moyenne, croissance_resultat_net_1_an, 
    croissance_resultat_net_5_ans, debt_equity, fcf_1_year, fcf_5_years, fcf_10_years, 
    fcf_margin_five_year, fcf_margin_one_year, nbreannee, piotroski_score, 
    rachat_net_moyen, ratio_capex_revenu_net, ratio_payout, roce, roce_5_year_avg) => {

    // Calcul pour la performance 5 ans
  if (performance > 13) {
    return 'bg-success';
  } else if (performance >= 4 && performance <= 13) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  // Calcul pour la croissance CA 1 an
  if (croissance_CA_1_an > 10) {
    return 'bg-success';
  } else if (croissance_CA_1_an >= 7 && croissance_CA_1_an <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  // Calcul pour la croissance CA 5 ans
  if (croissance_CA_5_ans > 10) {
    return 'bg-success';
  } else if (croissance_CA_5_ans >= 7 && croissance_CA_5_ans <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  // Calcul pour la croissance CA 10 ans
  if (croissance_CA_10_ans > 10) {
    return 'bg-success';
  } else if (croissance_CA_10_ans >= 7 && croissance_CA_10_ans <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  // Calcul pour le Free Cash Flow 1 an
  if (fcf_1_year > 9) {
    return 'bg-success';
  } else if (fcf_1_year >= 5 && fcf_1_year <= 9) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  // Calcul pour le Free Cash Flow 5 ans
  if (fcf_5_years > 10) {
    return 'bg-success';
  } else if (fcf_5_years >= 7 && fcf_5_years <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (fcf_10_years > 10) {
    return 'bg-success';
  } else if (fcf_10_years >= 7 && fcf_10_years  <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (croissance_resultat_net_1_an > 12) {
    return 'bg-success';
  } else if (croissance_resultat_net_1_an >= 10 && croissance_resultat_net_1_an  <= 12) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (croissance_resultat_net_5_ans > 14) {
    return 'bg-success';
  } else if (croissance_resultat_net_5_ans >= 8 && croissance_resultat_net_5_ans  <= 14) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (roce > 14) {
    return 'bg-success';
  } else if (roce >= 7 && roce <= 14) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (roce_5_year_avg > 15) {
    return 'bg-success';
  } else if (roce_5_year_avg >= 7 && roce_5_year_avg <= 15) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (fcf_margin_one_year > 10) {
    return 'bg-success';
  } else if (fcf_margin_one_year >= 5 && fcf_margin_one_year <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (fcf_margin_five_year > 10) {
    return 'bg-success';
  } else if (fcf_margin_five_year >= 6 && fcf_margin_five_year <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (croissance_annualisee > 10) {
    return 'bg-success';
  } else if (croissance_annualisee >= 5 && croissance_annualisee <= 10) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (croissance_moyenne > 8) {
    return 'bg-success';
  } else if (croissance_moyenne >= 5 && croissance_moyenne <= 8) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (nbreannee > 20) {
    return 'bg-success';
  } else if (nbreannee >= 10 && nbreannee <= 20) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (rachat_net_moyen < 0) {
    return 'bg-success';
  } else if (rachat_net_moyen === 0) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (ratio_capex_revenu_net <= -20) {
    return 'bg-success';
  } else if (ratio_capex_revenu_net > 20 && ratio_capex_revenu_net <= 40) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }
  
  if (debt_equity <= 0.5) {
    return 'bg-success';
  } else if (debt_equity > 0.5 && debt_equity <= 1) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (buyback_yield > 4) {
    return 'bg-success';
  } else if (buyback_yield >= 2 && buyback_yield <= 4) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }

  if (ratio_payout <= 35) {
    return 'bg-success';
  } else if (ratio_payout > 35 && ratio_payout <= 50) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
    }
  
  if (piotroski_score >= 7 && piotroski_score <= 9) {
    return 'bg-success';
  } else if (piotroski_score >= 5 && piotroski_score <= 6) {
    return 'bg-info'; // Bleu pour correct
  }else {
      return 'bg-danger'; // Rouge pour faible
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

    if (roce > 14) {
      newScore += 1;
    } else if (roce >= 7 && roce <= 14) {
      newScore += 0.5;
    }

    if (roce_5_year_avg > 15) {
      newScore += 1;
    } else if (roce_5_year_avg >= 7 && roce_5_year_avg <= 15) {
      newScore += 0.5;
    }

    if (fcf_margin_one_year > 10) {
      newScore += 1;
    } else if (fcf_margin_one_year >= 5 && fcf_margin_one_year <= 10) {
      newScore += 0.5;
    }

    if (fcf_margin_five_year > 10) {
      newScore += 1;
    } else if (fcf_margin_five_year >= 6 && fcf_margin_five_year <= 10) {
      newScore += 0.5;
    }

    if (croissance_annualisee > 10) {
      newScore += 1;
    } else if (croissance_annualisee >= 5 && croissance_annualisee <= 10) {
      newScore += 0.5;
    }

    if (croissance_moyenne > 8) {
      newScore += 1;
    } else if (croissance_moyenne >= 5 && croissance_moyenne <= 8) {
      newScore += 0.5;
    }

    if (nbreannee > 20) {
      newScore += 1;
    } else if (nbreannee >= 10 && nbreannee <= 20) {
      newScore += 0.5;
    }

    if (rachat_net_moyen < 0) {
      newScore += 1;
    } else if (rachat_net_moyen === 0) {
      newScore += 0.5;
    }

    if (ratio_capex_revenu_net <= -20) {
      newScore += 1;
    } else if (ratio_capex_revenu_net > 20 && ratio_capex_revenu_net <= 40) {
      newScore += 0.5;
    }
    
    if (debt_equity <= 0.5) {
      newScore += 1;
    } else if (debt_equity > 0.5 && debt_equity <= 1) {
      newScore += 0.5;
    }

    if (buyback_yield > 4) {
      newScore += 1;
    } else if (buyback_yield >= 2 && buyback_yield <= 4) {
      newScore += 0.5;
    }

    if (ratio_payout <= 35) {
      newScore += 1;
    } else if (ratio_payout > 35 && ratio_payout <= 50) {
      newScore += 0.5;
    }
    
    if (piotroski_score >= 7 && piotroski_score <= 9) {
      newScore += 1;
    } else if (piotroski_score >= 5 && piotroski_score <= 6) {
      newScore += 0.5;
    }

    if (newScore > 20) {
      newScore = 20;
    }
    setScore(newScore); // Mise à jour du score
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Quanti-score : {score} / 20</h2>
        </div>
        <div className="card-body">
          <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
              <h5>Croissance</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Performance 5 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.performance)}`}
                    role="progressbar"
                    style={{ width: `${infos.performance}%` }}
                    aria-valuenow={infos.performance}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.performance}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Croissance CA 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.croissance_CA_1_an)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_CA_1_an}%` }}
                    aria-valuenow={infos.performance}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_CA_1_an}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Croissance CA 5 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.croissance_CA_5_ans)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_CA_5_ans}%` }}
                    aria-valuenow={infos.croissance_CA_5_ans}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_CA_5_ans}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Croissance CA 10 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.croissance_CA_10_ans)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_CA_10_ans}%` }}
                    aria-valuenow={infos.croissance_CA_10_ans}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_CA_10_ans}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FCF 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.fcf_1_year)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_1_year}%` }}
                    aria-valuenow={infos.fcf_1_year}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_1_year}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FCF 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.fcf_1_year)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_1_year}%` }}
                    aria-valuenow={infos.fcf_1_year}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_1_year}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FCF 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor(infos.fcf_1_year)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_1_year}%` }}
                    aria-valuenow={infos.fcf_1_year}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_1_year}%
                    </span>
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