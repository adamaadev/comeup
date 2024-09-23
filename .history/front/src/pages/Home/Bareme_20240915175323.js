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
        return <div>Loading...</div>;
    }

    if (!financialData) {
        return <div>Aucune donnée disponible.</div>;
    }

    // Fonction pour vérifier si un ratio est excellent
    const isExcellent = (ratio) => ratio === 'Excellent';

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Catégorie</th>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Critères</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance CA</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>FCF</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance Résultat Net</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Roce</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Fcf Margin</th>
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
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Score</th>
                        <td style={{ border: '1px solid #ddd' }}>Excellent</td>
                        {isExcellent(financialData.croissance_CA_1_an?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.percentile75}</td>}
                        {isExcellent(financialData.croissance_CA_5_ans?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.percentile75}</td>}
                        {isExcellent(financialData.croissance_CA_10_ans?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_10_ans?.percentile75}</td>}
                        {isExcellent(financialData.fcf_1_year?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.percentile75}</td>}
                        {isExcellent(financialData.fcf_5_years?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_5_years?.percentile75}</td>}
                        {isExcellent(financialData.fcf_10_years?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_10_years?.percentile75}</td>}
                        {isExcellent(financialData.croissance_resultat_net_1_an?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_1_an?.percentile75}</td>}
                        {isExcellent(financialData.croissance_resultat_net_5_ans?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_resultat_net_5_ans?.percentile75}</td>}
                        {isExcellent(financialData.roce?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce?.percentile75}</td>}
                        {isExcellent(financialData.roce_5_year_avg?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.roce_5_year_avg?.percentile75}</td>}
                        {isExcellent(financialData.fcf_margin_one_year?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_one_year?.percentile75}</td>}
                        {isExcellent(financialData.fcf_margin_five_year?.score) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_margin_five_year?.percentile75}</td>}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
