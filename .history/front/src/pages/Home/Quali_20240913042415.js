import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Quali({ symbol }) {
  const [infos, setInfos] = useState({});
  const [quantiScore, setQuantiScore] = useState(0);

  useEffect(() => {
    axios.post("http://localhost:4000/screener/ratios", { symbol })
      .then((res) => {
        console.log(res.data);
        setInfos(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  const ratios = [
    { label: 'Buyback Yield', value: infos.buyback_yield },
    { label: 'Croissance CA 1 an', value: infos.croissance_CA_1_an },
    { label: 'Croissance CA 5 ans', value: infos.croissance_CA_5_ans },
    { label: 'Croissance CA 10 ans', value: infos.croissance_CA_10_ans },
    { label: 'Croissance annualisée', value: infos.croissance_annualisee },
    { label: 'Croissance moyenne', value: infos.croissance_moyenne },
    { label: 'Croissance résultat net 1 an', value: infos.croissance_resultat_net_1_an },
    { label: 'Croissance résultat net 5 ans', value: infos.croissance_resultat_net_5_ans },
    { label: 'FCF 1 year', value: infos.fcf_1_year },
    { label: 'FCF 5 years', value: infos.fcf_5_years },
    { label: 'FCF 10 years', value: infos.fcf_10_years },
    { label: 'FCF margin five years', value: infos.fcf_margin_five_year },
    { label: 'FCF margin one year', value: infos.fcf_margin_one_year },
    { label: 'Performance', value: infos.performance },
    { label: 'Piotroski Score', value: infos.piotroski_score },
    { label: 'Price', value: infos.price },
    { label: 'Rachat net moyen', value: infos.rachat_net_moyen },
    { label: 'Ratio CAPEX Revenu Net', value: infos.ratio_capex_revenu_net },
    { label: 'Ratio Payout', value: infos.ratio_payout },
    { label: 'ROCE', value: infos.roce },
    { label: 'ROCE 5 year average', value: infos.roce_5_year_avg },
    { label: 'Ratio Debt to Equity', value: infos.debt_equity },
    { label: 'Nombre d\'années', value: infos.nbreannee }
  ];

  return (
    <div>
      <h1>Ratios pour {symbol}</h1>
      <ol>
        {ratios.map((ratio, index) => (
          <li key={index}>
            {index + 1}. {ratio.label}: {ratio.value || 'N/A'}
          </li>
        ))}
      </ol>
    </div>
  );
}
