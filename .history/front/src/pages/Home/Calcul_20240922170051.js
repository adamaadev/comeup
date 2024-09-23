export const calculateScore = (
    performance, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans,
    buyback_yield, croissance_annualisee, croissance_moyenne, croissance_resultat_net_1_an,
    croissance_resultat_net_5_ans, debt_equity, fcf_1_year, fcf_5_years, fcf_10_years,
    fcf_margin_five_year, fcf_margin_one_year, nbreannee, piotroski_score,
    rachat_net_moyen, ratio_capex_revenu_net, ratio_payout, roce, roce_5_year_avg
  ) => {
    let newScore = 0;


    // Calcul pour la croissance CA 10 ans
   

    // Calcul pour le Free Cash Flow 1 an



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