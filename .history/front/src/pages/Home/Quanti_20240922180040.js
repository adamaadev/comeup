import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quati({ symbol }) {
  const [infos, setInfos] = useState({});
  const [score, setScore] = useState(0);
  const [final , setfinal] = useState(0);

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

  const calculateScore = (
    performance, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans,
    buyback_yield, croissance_annualisee, croissance_moyenne, croissance_resultat_net_1_an,
    croissance_resultat_net_5_ans, debt_equity, fcf_1_year, fcf_5_years, fcf_10_years,
    fcf_margin_five_year, fcf_margin_one_year, nbreannee, piotroski_score,
    rachat_net_moyen, ratio_capex_revenu_net, ratio_payout, roce, roce_5_year_avg
  ) => {
    let newScore = 0;

    // Calcul pour la performance 5 ans
    if (performance >= 13) {
      newScore += 1;
    } else if (performance >= 4 && performance < 13) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 1 an
    if (croissance_CA_1_an >= 10) {
      newScore += 1;
    } else if (croissance_CA_1_an >= 7 && croissance_CA_1_an < 10) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 5 ans
    if (croissance_CA_5_ans >= 10) {
      newScore += 1;
    } else if (croissance_CA_5_ans >= 7 && croissance_CA_5_ans < 10) {
      newScore += 0.5;
    }

    // Calcul pour la croissance CA 10 ans
    if (croissance_CA_10_ans >= 10) {
      newScore += 1;
    } else if (croissance_CA_10_ans >= 7 && croissance_CA_10_ans < 10) {
      newScore += 0.5;
    }

    // Calcul pour le Free Cash Flow 1 an
    if (fcf_1_year >= 9) {
      newScore += 1;
    } else if (fcf_1_year >= 5 && fcf_1_year < 9) {
      newScore += 0.5;
    }

    // Calcul pour le Free Cash Flow 5 ans
    if (fcf_5_years >= 10) {
      newScore += 1;
    } else if (fcf_5_years >= 7 && fcf_5_years < 10) {
      newScore += 0.5;
    }

    if (fcf_10_years >= 10) {
      newScore += 1;
    } else if (fcf_10_years >= 7 && fcf_10_years < 10) {
      newScore += 0.5;
    }

    if (croissance_resultat_net_1_an >= 12) {
      newScore += 1;
    } else if (croissance_resultat_net_1_an >= 10 && croissance_resultat_net_1_an < 12) {
      newScore += 0.5;
    }

    if (croissance_resultat_net_5_ans >= 14) {
      newScore += 1;
    } else if (croissance_resultat_net_5_ans >= 8 && croissance_resultat_net_5_ans < 14) {
      newScore += 0.5;
    }

    if (roce >= 14) {
      newScore += 1;
    } else if (roce >= 7 && roce < 14) {
      newScore += 0.5;
    }

    if (roce_5_year_avg >= 15) {
      newScore += 1;
    } else if (roce_5_year_avg >= 7 && roce_5_year_avg < 15) {
      newScore += 0.5;
    }

    if (fcf_margin_one_year >= 10) {
      newScore += 1;
    } else if (fcf_margin_one_year >= 5 && fcf_margin_one_year < 10) {
      newScore += 0.5;
    }

    if (fcf_margin_five_year >= 10) {
      newScore += 1;
    } else if (fcf_margin_five_year >= 6 && fcf_margin_five_year < 10) {
      newScore += 0.5;
    }

    if (croissance_annualisee >= 10) {
      newScore += 1;
    } else if (croissance_annualisee >= 5 && croissance_annualisee < 10) {
      newScore += 0.5;
    }

    if (croissance_moyenne >= 8) {
      newScore += 1;
    } else if (croissance_moyenne >= 5 && croissance_moyenne < 8) {
      newScore += 0.5;
    }

    if (nbreannee >= 20) {
      newScore += 1;
    } else if (nbreannee >= 10 && nbreannee < 20) {
      newScore += 0.5;
    }

    if (rachat_net_moyen < 0) {
      newScore += 1;
    } else if (rachat_net_moyen === 0) {
      newScore += 0.5;
    }

    if (ratio_capex_revenu_net < 20) {
      newScore += 1;
    } else if (ratio_capex_revenu_net >= 20 && ratio_capex_revenu_net < 40) {
      newScore += 0.5;
    }

    if (debt_equity < 0.5) {
      newScore += 1;
    } else if (debt_equity >= 0.5 && debt_equity < 1) {
      newScore += 0.5;
    }

    if (buyback_yield >= 4) {
      newScore += 1;
    } else if (buyback_yield >= 2 && buyback_yield < 4) {
      newScore += 0.5;
    }

    if (ratio_payout < 35) {
      newScore += 1;
    } else if (ratio_payout >= 35 && ratio_payout < 50) {
      newScore += 0.5;
    }

    if (piotroski_score >= 7 && piotroski_score <= 9) {
      newScore += 1;
    } else if (piotroski_score >= 5 && piotroski_score <= 6) {
      newScore += 0.5;
    }

    setScore(newScore); // Mise à jour du score
    setfinal(Math.round((newScore / 22) * 20));

  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) {
      return '0'; // Valeur par défaut si 'num' est null ou undefined
    }
  
    if (Math.abs(num) >= 1e9) {
      return (Math.round(num / 1e7) / 100).toFixed(3) + ' MDS'; // Limiter à trois chiffres après la virgule
    } else if (Math.abs(num) >= 1e6) {
      return (Math.round(num / 1e4) / 100).toFixed(3) + ' M'; // Limiter à trois chiffres après la virgule
    } else {
      return num.toFixed(3); // Limiter à trois chiffres après la virgule
    }
  };
  
  const formatPercentage = (num) => {
    if (num === null || num === undefined) {
      return 0; // Valeur par défaut si 'num' est null ou undefined
    }
    return Math.min(Math.max(num, 0), 100); // Limiter la valeur entre 0 et 100 pour le pourcentage
  };

  const getProgressColor = (performance) => {

    // Calcul pour la performance 5 ans
    if (performance >= 13) {
      return 'bg-success';
    } else if (performance >= 4 && performance < 13) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }

  };

  const getProgressColor1 =(croissance_CA_1_an )=>{
    if (croissance_CA_1_an >= 10) {
      return 'bg-success';
    } else if (croissance_CA_1_an >= 7 && croissance_CA_1_an < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor2 =(croissance_CA_5_ans )=>{
    if (croissance_CA_5_ans >= 10) {
      return 'bg-success';
    } else if (croissance_CA_5_ans >= 7 && croissance_CA_5_ans < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor3 =(croissance_CA_10_ans )=>{
    if (croissance_CA_10_ans >= 10) {
      return 'bg-success';
    } else if (croissance_CA_10_ans >= 7 && croissance_CA_10_ans < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor4 =(fcf_1_year )=>{
    if (fcf_1_year >= 9) {
      return 'bg-success';
    } else if (fcf_1_year >= 5 && fcf_1_year < 9) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor5 =(fcf_5_years )=>{
    if (fcf_5_years >= 10) {
      return 'bg-success';
    } else if (fcf_5_years >= 7 && fcf_5_years < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor6 =(fcf_10_years )=>{
    if (fcf_10_years >= 10) {
      return 'bg-success';
    } else if (fcf_10_years >= 7 && fcf_10_years < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor7 =( croissance_resultat_net_1_an )=>{
    if (croissance_resultat_net_1_an >= 12) {
      return 'bg-success';
    } else if (croissance_resultat_net_1_an >= 10 && croissance_resultat_net_1_an < 12) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor8 =( croissance_resultat_net_5_ans )=>{
    if (croissance_resultat_net_5_ans >= 14) {
      return 'bg-success';
    } else if (croissance_resultat_net_5_ans >= 8 && croissance_resultat_net_5_ans < 14) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor9 =( roce )=>{
    if (roce >= 14) {
      return 'bg-success';
    } else if (roce >= 7 && roce < 14) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor10 =( roce_5_year_avg )=>{
    if (roce_5_year_avg >= 15) {
      return 'bg-success';
    } else if (roce_5_year_avg >= 7 && roce_5_year_avg < 15) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor11 =( fcf_margin_one_year )=>{
    if (fcf_margin_one_year >= 10) {
      return 'bg-success';
    } else if (fcf_margin_one_year >= 5 && fcf_margin_one_year < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }


  const getProgressColor12 =( fcf_margin_five_year )=>{
    if (fcf_margin_five_year >= 10) {
      return 'bg-success';
    } else if (fcf_margin_five_year >= 6 && fcf_margin_five_year < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor13 =( croissance_annualisee )=>{
    if (croissance_annualisee >= 10) {
      return 'bg-success';
    } else if (croissance_annualisee >= 5 && croissance_annualisee < 10) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor14 =( croissance_moyenne )=>{
    if (croissance_moyenne >= 8) {
      return 'bg-success';
    } else if (croissance_moyenne >= 5 && croissance_moyenne < 8) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor15 =( nbreannee )=>{
    if (nbreannee >= 20) {
      return 'bg-success';
    } else if (nbreannee >= 10 && nbreannee < 20) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor16 =( rachat_net_moyen )=>{
    if (rachat_net_moyen < 0) {
      return 'bg-success';
    } else if (rachat_net_moyen === 0) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor17 =( ratio_capex_revenu_net )=>{
    if (ratio_capex_revenu_net < 20) {
      return 'bg-success';
    } else if (ratio_capex_revenu_net >= 20 && ratio_capex_revenu_net < 40) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }


  const getProgressColor18 =( debt_equity )=>{
    if (debt_equity < 0.5) {
      return 'bg-success';
    } else if (debt_equity >= 0.5 && debt_equity < 1) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor19 =( buyback_yield )=>{
    if (buyback_yield >= 4) {
      return 'bg-success';
    } else if (buyback_yield >= 2 && buyback_yield < 4) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor20 =( debt_equity )=>{
    if (debt_equity < 0.5) {
      return 'bg-success';
    } else if (debt_equity >= 0.5 && debt_equity < 1) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }

  const getProgressColor19 =( buyback_yield )=>{
    if (buyback_yield >= 4) {
      return 'bg-success';
    } else if (buyback_yield >= 2 && buyback_yield < 4) {
      return 'bg-warning';
    } else {
      return 'bg-danger'; // Rouge pour faible
    }
  }



  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>Analyse quantitative</h4>
          <h4>Quanti-score : {final} / 20</h4>
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
                    className={`progress-bar ${getProgressColor1(infos.croissance_CA_1_an)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_CA_1_an}%` }}
                    aria-valuenow={infos.croissance_CA_1_an }
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
                    className={`progress-bar ${getProgressColor2(infos.croissance_CA_5_ans)}`}
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
                    className={`progress-bar ${getProgressColor1(infos.croissance_CA_10_ans)}`}
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
                    className={`progress-bar ${getProgressColor1(infos.fcf_1_year)}`}
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
              <br />
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FCF 5 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.fcf_5_years)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_5_years}%` }}
                    aria-valuenow={infos.fcf_5_years}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_5_years}%
                    </span>
                  </div>
                </div>
              </div>
              <br />

              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FCF 10 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.fcf_10_years)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_10_years}%` }}
                    aria-valuenow={infos.fcf_10_years}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_10_years}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Profits</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Résultat Net 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.croissance_resultat_net_1_an)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_resultat_net_1_an}%` }}
                    aria-valuenow={infos.croissance_resultat_net_1_an}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_resultat_net_1_an}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Résultat Net 5 ans: </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.croissance_resultat_net_5_ans)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_resultat_net_5_ans}%` }}
                    aria-valuenow={infos.croissance_resultat_net_5_ans}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_resultat_net_5_ans}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>CAPEX / Résultat Net (Moy 5A) : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.ratio_capex_revenu_net)}`}
                    role="progressbar"
                    style={{ width: `${infos.ratio_capex_revenu_net}%` }}
                    aria-valuenow={infos.ratio_capex_revenu_net}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.ratio_capex_revenu_net}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Rentabilité</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>ROCE 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.roce)}`}
                    role="progressbar"
                    style={{ width: `${infos.roce}%` }}
                    aria-valuenow={infos.roce}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.roce}%
                    </span>
                  </div>
                </div>
              </div>
              <br />
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>ROCE 5 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.roce_5_year_avg)}`}
                    role="progressbar"
                    style={{ width: `${infos.roce_5_year_avg}%` }}
                    aria-valuenow={infos.roce_5_year_avg}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.roce_5_year_avg}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FcF Margin 1 an : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.fcf_margin_one_year)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_margin_one_year}%` }}
                    aria-valuenow={infos.fcf_margin_one_year}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_margin_one_year}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>FcF Margin 5 ans : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.fcf_margin_five_year)}`}
                    role="progressbar"
                    style={{ width: `${infos.fcf_margin_five_year}%` }}
                    aria-valuenow={infos.fcf_margin_five_year}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.fcf_margin_five_year}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Santé</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Debt to Equity Ratio : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.debt_equity)}`}
                    role="progressbar"
                    style={{ width: `${infos.debt_equity}%` }}
                    aria-valuenow={infos.debt_equity}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.debt_equity}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Payout Ratio : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.ratio_payout)}`}
                    role="progressbar"
                    style={{ width: `${infos.ratio_payout}%` }}
                    aria-valuenow={infos.ratio_payout}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.ratio_payout}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Dividende</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Croissance 1 AN : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.croissance_annualisee)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_annualisee}%` }}
                    aria-valuenow={infos.croissance_annualisee}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_annualisee}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Croissance (Moy 5A) : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.croissance_moyenne)}`}
                    role="progressbar"
                    style={{ width: `${infos.croissance_moyenne}%` }}
                    aria-valuenow={infos.croissance_moyenne}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.croissance_moyenne}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Le dividende n'a pas diminué depuis : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.nbreannee)}`}
                    role="progressbar"
                    style={{ width: `${infos.nbreannee}%` }}
                    aria-valuenow={infos.nbreannee}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.nbreannee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-4">
              <h5>Autres</h5>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Buyback Yield : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.buyback_yield)}`}
                    role="progressbar"
                    style={{ width: `${infos.buyback_yield}%` }}
                    aria-valuenow={infos.buyback_yield}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.buyback_yield}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Piotroski Score : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.piotroski_score)}`}
                    role="progressbar"
                    style={{ width: `${infos.piotroski_score}%` }}
                    aria-valuenow={infos.piotroski_score}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'Black' }}>
                      {infos.piotroski_score}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <p style={{ marginBottom: '0', marginRight: '10px' }}>Rachat net d'actions (Moy 5A) : </p>
                <div className="progress" style={{ height: '13px', borderRadius: '5px', width: '100px', position: 'relative', flexGrow: 1 }}>
                  <div
                    className={`progress-bar ${getProgressColor1(infos.rachat_net_moyen)}`}
                    role="progressbar"
                    style={{ width: `${formatPercentage(infos.rachat_net_moyen)}%` }}
                    aria-valuenow={infos.rachat_net_moyen}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'black' }}>
                      {formatNumber(infos.rachat_net_moyen)}
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