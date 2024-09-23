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
        return <div>Loading...</div>;
    }

    if (!financialData) {
        return <div>Aucune donnée disponible.</div>;
    }

    const renderScore = (score) => {
        switch (score) {
            case 'Excellent':
                return <span style={{ color: 'green' }}>{score}</span>;
            case 'Correct':
                return <span style={{ color: 'orange' }}>{score}</span>;
            case 'Faible':
                return <span style={{ color: 'red' }}>{score}</span>;
            default:
                return score;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Catégorie</th>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Criteres</th>
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
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}></th>
                        <td style={{ border: '1px solid #ddd' }}>Excellent</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_10_ans?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_5_years?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_10_years?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_1_an?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_5_ans?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce_5_year_avg?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_one_year?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_five_year?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_annualisee?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_moyenne?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.debt_equity?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.ratio_payout?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.performance?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.buyback_yield?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.rachat_net_moyen?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.ratio_capex_revenu_net?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.piotroski_score?.percentile75}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.nbreannee?.percentile75}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}></th>
                        <td style={{ border: '1px solid #ddd' }}>Correct</td>

                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_1_an?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_5_ans?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_10_ans?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.fcf_1_year?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.fcf_5_years?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.fcf_10_years?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_resultat_net_1_an?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_resultat_net_5_ans?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.roce?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.roce_5_year_avg?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.fcf_margin_one_year?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.fcf_margin_five_year?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_annualisee?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_moyenne?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.debt_equity?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.ratio_payout?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.performance?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.buyback_yield?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.rachat_net_moyen?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.ratio_capex_revenu_net?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.piotroski_score?.score)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.nbreannee?.score)}</td>
                    </tr>
                    <tr>

                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Médiane</th>
                       <td style={{ border: '1px solid #ddd' }}>Faible</td>

                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_10_ans?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_5_years?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_10_years?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_1_an?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_5_ans?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce_5_year_avg?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_one_year?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_five_year?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_annualisee?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_moyenne?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.debt_equity?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.ratio_payout?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.performance?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.buyback_yield?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.rachat_net_moyen?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.ratio_capex_revenu_net?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.piotroski_score?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.nbreannee?.median}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};