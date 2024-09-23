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
      <ol>
        <li>1. Buyback Yield: {infos.buyback_yield || 'N/A'}</li>
        <li>2. Croissance CA 1 an: {infos.croissance_CA_1_an || 'N/A'}</li>
        <li>3. Croissance CA 5 ans: {infos.croissance_CA_5_ans || 'N/A'}</li>
        <li>4. Croissance CA 10 ans: {infos.croissance_CA_10_ans || 'N/A'}</li>
        <li>5. Croissance annualisée: {infos.croissance_annualisee || 'N/A'}</li>
        <li>6. Croissance moyenne: {infos.croissance_moyenne || 'N/A'}</li>
        <li>7. Croissance résultat net 1 an: {infos.croissance_resultat_net_1_an || 'N/A'}</li>
        <li>8. Croissance résultat net 5 ans: {infos.croissance_resultat_net_5_ans || 'N/A'}</li>
        <li>9. FCF 1 year: {infos.fcf_1_year || 'N/A'}</li>
        <li>10. FCF 5 years: {infos.fcf_5_years || 'N/A'}</li>
        <li>11. FCF 10 years: {infos.fcf_10_years || 'N/A'}</li>
        <li>12. FCF margin five years: {infos.fcf_margin_five_year || 'N/A'}</li>
        <li>13. FCF margin one year: {infos.fcf_margin_one_year || 'N/A'}</li>
        <li>14. Performance: {infos.performance || 'N/A'}</li>
        <li>15. Piotroski Score: {infos.piotroski_score || 'N/A'}</li>
        <li>16. Rachat net moyen: {infos.rachat_net_moyen || 'N/A'}</li>
        <li>17. Ratio CAPEX Revenu Net: {infos.ratio_capex_revenu_net || 'N/A'}</li>
        <li>18. Ratio Payout: {infos.ratio_payout || 'N/A'}</li>
        <li>19. ROCE: {infos.roce || 'N/A'}</li>
        <li>20. ROCE 5 year average: {infos.roce_5_year_avg || 'N/A'}</li>
        <li>21. Ratio Debt to Equity: {infos.debt_equity || 'N/A'}</li>
        <li>22. Nombre d'années: {infos.nbreannee || 'N/A'}</li>
      </ol>
    </div>
  );
}
