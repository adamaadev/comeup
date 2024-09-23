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

  return (
    <div>
      <h1>Ratios pour {symbol}</h1>
      <ul>
        <li>Buyback Yield: {infos.buyback_yield || 'N/A'}</li>
        <li>Croissance CA 1 an: {infos.croissance_CA_1_an || 'N/A'}</li>
        <li>Croissance CA 5 ans: {infos.croissance_CA_5_ans || 'N/A'}</li>
        <li>Croissance CA 10 ans: {infos.croissance_CA_10_ans || 'N/A'}</li>
        <li>Croissance annualisée: {infos.croissance_annualisee || 'N/A'}</li>
        <li>Croissance moyenne: {infos.croissance_moyenne || 'N/A'}</li>
        <li>Croissance résultat net 1 an: {infos.croissance_resultat_net_1_an || 'N/A'}</li>
        <li>Croissance résultat net 5 ans: {infos.croissance_resultat_net_5_ans || 'N/A'}</li>
        <li>FCF 1 year: {infos.fcf_1_year || 'N/A'}</li>
        <li>FCF 5 years: {infos.fcf_5_years || 'N/A'}</li>
        <li>FCF 10 years: {infos.fcf_10_years || 'N/A'}</li>
        <li>FCF margin five years: {infos.fcf_margin_five_year || 'N/A'}</li>
        <li>FCF margin one year: {infos.fcf_margin_one_year || 'N/A'}</li>
        <li>Performance: {infos.performance || 'N/A'}</li>
        <li>Piotroski Score: {infos.piotroski_score || 'N/A'}</li>
        <li>Price: {infos.price || 'N/A'}</li>
        <li>Rachat net moyen: {infos.rachat_net_moyen || 'N/A'}</li>
        <li>Ratio CAPEX Revenu Net: {infos.ratio_capex_revenu_net || 'N/A'}</li>
        <li>Ratio Payout: {infos.ratio_payout || 'N/A'}</li>
        <li>ROCE: {infos.roce || 'N/A'}</li>
        <li>ROCE 5 year average: {infos.roce_5_year_avg || 'N/A'}</li>
        <li>Ratio Debt to Equity: {infos.debt_equity || 'N/A'}</li>
        <li>Ratio Payout: {infos.ratio_payout || 'N/A'}</li>
        <li>Nombre d'années: {infos.nbreannee || 'N/A'}</li>
      </ul>
    </div>
  );
}
