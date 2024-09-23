import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme () {
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

    // Fonction pour classer les ratios
    const classifyRatio = (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'Inconnu';
        if (numValue >= 10) return 'Excellent';
        if (numValue >= 7) return 'Correct';
        return 'Faible';
    };

    // Extraire les ratios financiers
    const {
        croissance_annualisee,
        croissance_moyenne,
        debt_equity,
        ratio_payout,
        performance,
        buyback_yield,
        croissance_CA_1_an,
        croissance_CA_5_ans,
        croissance_CA_10_ans,
        fcf_1_year,
        fcf_5_years,
        fcf_10_years,
        fcf_margin_one_year,
        fcf_margin_five_year,
        roce,
        roce_5_year_avg,
        croissance_resultat_net_1_an,
        croissance_resultat_net_5_ans,
        piotroski_score,
        ratio_capex_revenu_net,
        rachat_net_moyen,
        nbreannee,
        quanti
    } = financialData;

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Catégorie</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance CA</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>FCF</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance Résultat Net</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Roce</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Fcf Margin</th>
                        {/* Autres colonnes si nécessaire */}
                    </tr>
                    <tr>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>10 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>10 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance Annualisée</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance Moyenne</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Debt/Equity</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Payout Ratio</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Performance</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Buyback Yield</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Rachat Net Moyen</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Ratio Capex/Revenu Net</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Piotroski Score</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Nbre Année</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Excellent</th>
                        <td>{classifyRatio(croissance_CA_1_an)}</td>
                        <td>{classifyRatio(croissance_CA_5_ans)}</td>
                        <td>{classifyRatio(croissance_CA_10_ans)}</td>
                        <td>{classifyRatio(fcf_1_year)}</td>
                        <td>{classifyRatio(fcf_5_years)}</td>
                        <td>{classifyRatio(fcf_10_years)}</td>
                        <td>{classifyRatio(croissance_resultat_net_1_an)}</td>
                        <td>{classifyRatio(croissance_resultat_net_5_ans)}</td>
                        <td>{classifyRatio(roce)}</td>
                        <td>{classifyRatio(roce_5_year_avg)}</td>
                        <td>{classifyRatio(fcf_margin_one_year)}</td>
                        <td>{classifyRatio(fcf_margin_five_year)}</td>
                        {/* Autres données si nécessaire */}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        <td>{classifyRatio(croissance_CA_1_an)}</td>
                        <td>{classifyRatio(croissance_CA_5_ans)}</td>
                        <td>{classifyRatio(croissance_CA_10_ans)}</td>
                        <td>{classifyRatio(fcf_1_year)}</td>
                        <td>{classifyRatio(fcf_5_years)}</td>
                        <td>{classifyRatio(fcf_10_years)}</td>
                        <td>{classifyRatio(croissance_resultat_net_1_an)}</td>
                        <td>{classifyRatio(croissance_resultat_net_5_ans)}</td>
                        <td>{classifyRatio(roce)}</td>
                        <td>{classifyRatio(roce_5_year_avg)}</td>
                        <td>{classifyRatio(fcf_margin_one_year)}</td>
                        <td>{classifyRatio(fcf_margin_five_year)}</td>
                        {/* Autres données si nécessaire */}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        <td>{classifyRatio(croissance_CA_1_an)}</td>
                        <td>{classifyRatio(croissance_CA_5_ans)}</td>
                        <td>{classifyRatio(croissance_CA_10_ans)}</td>
                        <td>{classifyRatio(fcf_1_year)}</td>
                        <td>{classifyRatio(fcf_5_years)}</td>
                        <td>{classifyRatio(fcf_10_years)}</td>
                        <td>{classifyRatio(croissance_resultat_net_1_an)}</td>
                        <td>{classifyRatio(croissance_resultat_net_5_ans)}</td>
                        <td>{classifyRatio(roce)}</td>
                        <td>{classifyRatio(roce_5_year_avg)}</td>
                        <td>{classifyRatio(fcf_margin_one_year)}</td>
                        <td>{classifyRatio(fcf_margin_five_year)}</td>
                        {/* Autres données si nécessaire */}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
