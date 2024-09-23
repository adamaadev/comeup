import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Fonction pour classer les ratios
const classifyRatio = (value) => {
    if (value === undefined || value === null || isNaN(value)) return 'Inconnu';
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

    // Fonction pour obtenir la valeur ou "Inconnu" si la valeur est absente
    const getValueOrUnknown = (value) => {
        return value === undefined || value === null ? 'Inconnu' : value;
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
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Excellent</th>
                        <td className={getClassificationClass(financialData.croissance_annualisee)}>{getValueOrUnknown(financialData.croissance_annualisee)}</td>
                        <td className={getClassificationClass(financialData.croissance_moyenne)}>{getValueOrUnknown(financialData.croissance_moyenne)}</td>
                        <td className={getClassificationClass(financialData.debt_equity)}>{getValueOrUnknown(financialData.debt_equity)}</td>
                        <td className={getClassificationClass(financialData.ratio_payout)}>{getValueOrUnknown(financialData.ratio_payout)}</td>
                        <td className={getClassificationClass(financialData.performance)}>{getValueOrUnknown(financialData.performance)}</td>
                        <td className={getClassificationClass(financialData.buyback_yield)}>{getValueOrUnknown(financialData.buyback_yield)}</td>
                        <td className={getClassificationClass(financialData.fcq_1_year)}>{getValueOrUnknown(financialData.fcq_1_year)}</td>
                        <td className={getClassificationClass(financialData.fcq_5_years)}>{getValueOrUnknown(financialData.fcq_5_years)}</td>
                        <td className={getClassificationClass(financialData.fcq_10_years)}>{getValueOrUnknown(financialData.fcq_10_years)}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_one_year)}>{getValueOrUnknown(financialData.fcf_margin_one_year)}</td>
                        <td className={getClassificationClass(financialData.fcf_margin_five_year)}>{getValueOrUnknown(financialData.fcf_margin_five_year)}</td>
                        <td className={getClassificationClass(financialData.roce)}>{getValueOrUnknown(financialData.roce)}</td>
                        <td className={getClassificationClass(financialData.roce_5_year_avg)}>{getValueOrUnknown(financialData.roce_5_year_avg)}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_1_an)}>{getValueOrUnknown(financialData.croissance_resultat_net_1_an)}</td>
                        <td className={getClassificationClass(financialData.croissance_resultat_net_5_ans)}>{getValueOrUnknown(financialData.croissance_resultat_net_5_ans)}</td>
                        <td className={getClassificationClass(financialData.piotroski_score)}>{getValueOrUnknown(financialData.piotroski_score)}</td>
                        <td className={getClassificationClass(financialData.ratio_capex_revenu_net)}>{getValueOrUnknown(financialData.ratio_capex_revenu_net)}</td>
                        <td className={getClassificationClass(financialData.rachat_net_moyen)}>{getValueOrUnknown(financialData.rachat_net_moyen)}</td>
                        <td className={getClassificationClass(financialData.nbreannee)}>{getValueOrUnknown(financialData.nbreannee)}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        <td>{getValueOrUnknown(financialData.croissance_CA_5_ans)}</td>
                        <td>{getValueOrUnknown(financialData.fcq_5_years)}</td>
                        <td>{getValueOrUnknown(financialData.fcq_10_years)}</td>
                        <td>{getValueOrUnknown(financialData.fcf_margin_five_year)}</td>
                        <td>{getValueOrUnknown(financialData.roce_5_year_avg)}</td>
                        <td>{getValueOrUnknown(financialData.croissance_resultat_net_5_ans)}</td>
                        <td>{getValueOrUnknown(financialData.piotroski_score)}</td>
                        <td>{getValueOrUnknown(financialData.ratio_capex_revenu_net)}</td>
                        <td>{getValueOrUnknown(financialData.nbreannee)}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        <td>{getValueOrUnknown(financialData.croissance_CA_1_an)}</td>
                        <td>{getValueOrUnknown(financialData.fcq_1_year)}</td>
                        <td>{getValueOrUnknown(financialData.fcq_10_years)}</td>
                        <td>{getValueOrUnknown(financialData.fcf_margin_one_year)}</td>
                        <td>{getValueOrUnknown(financialData.roce)}</td>
                        <td>{getValueOrUnknown(financialData.croissance_resultat_net_1_an)}</td>
                        <td>{getValueOrUnknown(financialData.piotroski_score)}</td>
                        <td>{getValueOrUnknown(financialData.ratio_capex_revenu_net)}</td>
                        <td>{getValueOrUnknown(financialData.nbreannee)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
