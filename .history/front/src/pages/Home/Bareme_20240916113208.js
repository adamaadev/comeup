import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Fonction pour classer les ratios
const classifyRatio = (value) => {
    if (value < 7) return 'Faible';
    if (value >= 7 && value <= 10) return 'Correct';
    return 'Excellent';
};

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

    // Fonction pour obtenir la classe CSS basée sur la classification
    const getClassificationClass = (value) => {
        const classification = classifyRatio(parseFloat(value));
        return classification.toLowerCase();
    };

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
                        <td className={getClassificationClass(financialData.croissance_annualisee)}>{financialData.croissance_annualisee}</td>
                        <td className={getClassificationClass(financialData.croissance_moyenne)}>{financialData.croissance_moyenne}</td>
                        <td className={getClassificationClass(financialData.debt_equity)}>{financialData.debt_equity}</td>
                        <td className={getClassificationClass(financialData.ratio_payout)}>{financialData.ratio_payout}</td>
                        <td className={getClassificationClass(financialData.performance)}>{financialData.performance}</td>
                        <td className={getClassificationClass(financialData.buyback_yield)}>{financialData.buyback_yield}</td>
                        <td className={getClassificationClass(financialData.fcq_1_year)}>{financialData.fcq_1_year}</td>
                        <td className={getClassificationClass(financialData.fcq_5_years)}>{financialData.fcq_5_years}</td>
                        <td className={getClassificationClass(financialData.fcq_10_years)}>{financialData.fcq_10_years}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_one_year)}>{financialData.fcf_margin_one_year}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_five_year)}>{financialData.fcf_margin_five_year}</td>
                        <td className={getClassificationClass(financialData.roce)}>{financialData.roce}</td>
                        <td className={getClassificationClass(financialData.roce_5_year_avg)}>{financialData.roce_5_year_avg}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_1_an)}>{financialData.croissance_resultat_net_1_an}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_5_ans)}>{financialData.croissance_resultat_net_5_ans}</td>
                        <td className={getClassificationClass(financialData.piotroski_score)}>{financialData.piotroski_score}</td>
                        <td className={getClassificationClass(financialData.ratio_capex_revenu_net)}>{financialData.ratio_capex_revenu_net}</td>
                        <td className={getClassificationClass(financialData.rachat_net_moyen)}>{financialData.rachat_net_moyen}</td>
                        <td className={getClassificationClass(financialData.nbreannee)}>{financialData.nbreannee}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        {/* Td pour les ratios corrects */}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        {/* Td pour les ratios faibles */}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
