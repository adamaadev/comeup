import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                setFinancialData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données financières :", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!financialData) {
        return <div>Aucune donnée disponible.</div>;
    }

    // Grouper les données par symbole
    const groupedData = financialData.reduce((acc, data) => {
        if (!acc[data.symbol]) {
            acc[data.symbol] = [];
        }
        acc[data.symbol].push(data);
        return acc;
    }, {});

    return (
        <div>
            <h1>Tableau de Notation Financière</h1>
            ----------------------------------------------------
            {Object.keys(groupedData).map(symbol => (
                <div key={symbol}>
                    <table>
                        <thead>
                            <tr>
                                <th>Critère</th>
                                <th>Valeur</th>
                                <th>Notation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedData[symbol].map((data, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>Croissance Annualisée</td>
                                        <td>{data.croissance_annualisee}</td>
                                        <td>{data.croissance_annualisee_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance Moyenne</td>
                                        <td>{data.croissance_moyenne}</td>
                                        <td>{data.croissance_moyenne_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Debt/Equity</td>
                                        <td>{data.debt_equity}</td>
                                        <td>{data.debt_equity_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Ratio Payout</td>
                                        <td>{data.ratio_payout}</td>
                                        <td>{data.ratio_payout_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Performance</td>
                                        <td>{data.performance}</td>
                                        <td>{data.performance_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Buyback Yield</td>
                                        <td>{data.buyback_yield}</td>
                                        <td>{data.buyback_yield_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance CA 1 an</td>
                                        <td>{data.croissance_CA_1_an}</td>
                                        <td>{data.croissance_CA_1_an_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance CA 5 ans</td>
                                        <td>{data.croissance_CA_5_ans}</td>
                                        <td>{data.croissance_CA_5_ans_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance CA 10 ans</td>
                                        <td>{data.croissance_CA_10_ans}</td>
                                        <td>{data.croissance_CA_10_ans_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>FCF 1 an</td>
                                        <td>{data.fcf_1_year}</td>
                                        <td>{data.fcf_1_year_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>FCF 5 ans</td>
                                        <td>{data.fcf_5_years}</td>
                                        <td>{data.fcf_5_years_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>FCF 10 ans</td>
                                        <td>{data.fcf_10_years}</td>
                                        <td>{data.fcf_10_years_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>FCF Margin 1 an</td>
                                        <td>{data.fcf_margin_one_year}</td>
                                        <td>{data.fcf_margin_one_year_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>FCF Margin 5 ans</td>
                                        <td>{data.fcf_margin_five_year}</td>
                                        <td>{data.fcf_margin_five_year_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>ROCE</td>
                                        <td>{data.roce}</td>
                                        <td>{data.roce_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>ROCE 5 ans</td>
                                        <td>{data.roce_5_year_avg}</td>
                                        <td>{data.roce_5_year_avg_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance Résultat Net 1 an</td>
                                        <td>{data.croissance_resultat_net_1_an}</td>
                                        <td>{data.croissance_resultat_net_1_an_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Croissance Résultat Net 5 ans</td>
                                        <td>{data.croissance_resultat_net_5_ans}</td>
                                        <td>{data.croissance_resultat_net_5_ans_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Piotroski Score</td>
                                        <td>{data.piotroski_score}</td>
                                        <td>{data.piotroski_score_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Ratio Capex/Revenu Net</td>
                                        <td>{data.ratio_capex_revenu_net}</td>
                                        <td>{data.ratio_capex_revenu_net_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Rachat Net Moyen</td>
                                        <td>{data.rachat_net_moyen}</td>
                                        <td>{data.rachat_net_moyen_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Nombre d'Années</td>
                                        <td>{data.nbreannee}</td>
                                        <td>{data.nbreannee_notation}</td>
                                    </tr>
                                    <tr>
                                        <td>Quanti</td>
                                        <td>{data.quanti}</td>
                                        <td>{data.quanti_notation}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
