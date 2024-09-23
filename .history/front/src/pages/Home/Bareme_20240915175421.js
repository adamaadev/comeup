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

    // Fonction pour extraire la valeur du ratio s'il est excellent
    const getValueIfExcellent = (ratioData) => {
        return isExcellent(ratioData.score) ? ratioData.value : null;
    };

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
                        {getValueIfExcellent(financialData.croissance_CA_1_an) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.croissance_CA_1_an)}</td>}
                        {getValueIfExcellent(financialData.croissance_CA_5_ans) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.croissance_CA_5_ans)}</td>}
                        {getValueIfExcellent(financialData.croissance_CA_10_ans) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.croissance_CA_10_ans)}</td>}
                        {getValueIfExcellent(financialData.fcf_1_year) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.fcf_1_year)}</td>}
                        {getValueIfExcellent(financialData.fcf_5_years) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.fcf_5_years)}</td>}
                        {getValueIfExcellent(financialData.fcf_10_years) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.fcf_10_years)}</td>}
                        {getValueIfExcellent(financialData.croissance_resultat_net_1_an) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.croissance_resultat_net_1_an)}</td>}
                        {getValueIfExcellent(financialData.croissance_resultat_net_5_ans) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.croissance_resultat_net_5_ans)}</td>}
                        {getValueIfExcellent(financialData.roce) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.roce)}</td>}
                        {getValueIfExcellent(financialData.roce_5_year_avg) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.roce_5_year_avg)}</td>}
                        {getValueIfExcellent(financialData.fcf_margin_one_year) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.fcf_margin_one_year)}</td>}
                        {getValueIfExcellent(financialData.fcf_margin_five_year) && <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getValueIfExcellent(financialData.fcf_margin_five_year)}</td>}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
