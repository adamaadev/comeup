import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Fonction pour obtenir la classe CSS basée sur la classification
const getClassificationClass = (classification) => {
    return classification;
};

export default function Bareme() {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                setFinancialData(response.data[0]); // Assurez-vous que la réponse est un tableau et prenez le premier élément
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
                        <td className={getClassificationClass(financialData.croissance_annualisee_notation)}>{financialData.croissance_annualisee}</td>
                        <td className={getClassificationClass(financialData.croissance_moyenne_notation)}>{financialData.croissance_moyenne}</td>
                        <td className={getClassificationClass(financialData.debt_equity_notation)}>{financialData.debt_equity}</td>
                        <td className={getClassificationClass(financialData.ratio_payout_notation)}>{financialData.ratio_payout}</td>
                        <td className={getClassificationClass(financialData.performance_notation)}>{financialData.performance}</td>
                        <td className={getClassificationClass(financialData.buyback_yield_notation)}>{financialData.buyback_yield}</td>
                        <td className={getClassificationClass(financialData.fcf_1_year_notation)}>{financialData.fcq_1_year}</td>
                        <td className={getClassificationClass(financialData.fcf_5_years_notation)}>{financialData.fcq_5_years}</td>
                        <td className={getClassificationClass(financialData.fcf_10_years_notation)}>{financialData.fcq_10_years}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_one_year_notation)}>{financialData.fcf_margin_one_year}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_five_year_notation)}>{financialData.fcf_margin_five_year}</td>
                        <td className={getClassificationClass(financialData.roce_notation)}>{financialData.roce}</td>
                        <td className={getClassificationClass(financialData.roce_5_year_avg_notation)}>{financialData.roce_5_year_avg}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_1_an_notation)}>{financialData.croissance_resultat_net_1_an}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_5_ans_notation)}>{financialData.croissance_resultat_net_5_ans}</td>
                        <td className={getClassificationClass(financialData.piotroski_score_notation)}>{financialData.piotroski_score}</td>
                        <td className={getClassificationClass(financialData.ratio_capex_revenu_net_notation)}>{financialData.ratio_capex_revenu_net}</td>
                        <td className={getClassificationClass(financialData.rachat_net_moyen_notation)}>{financialData.rachat_net_moyen}</td>
                        <td className={getClassificationClass(financialData.nbreannee_notation)}>{financialData.nbreannee}</td>
                    </tr>
                    {/* Ajoutez ici des lignes pour les classifications "Correct" et "Faible" si nécessaire */}
                </tbody>
            </table>
        </div>
    );
};
