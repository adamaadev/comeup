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

    const categories = ['Excellent', 'Correct', 'Faible'];

    // Organiser les données par catégorie
    const categorizedData = categories.reduce((acc, category) => {
        acc[category] = financialData.map(data => {
            const row = {};
            Object.keys(data).forEach(key => {
                if (key.endsWith('_notation') && data[key] === category) {
                    row[key.replace('_notation', '')] = data[key.replace('_notation', '')];
                }
            });
            return row;
        });
        return acc;
    }, {});

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tableau de Notation Financière</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Catégorie</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance CA</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>FCF</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance Résultat Net</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Roce</th>
                        <th colSpan="2" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Fcf Margin</th>
                        <th colSpan="7" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Autres Critères</th>
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
                    {categories.map(category => (
                        <tr key={category}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>{category}</th>
                            {/* Add Td for the ratios based on category */}
                            {Object.keys(categorizedData[category][0] || {}).map((key, index) => (
                                <td key={index} style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {categorizedData[category][0][key]}
                                </td>
                            ))}
                            {/* Fill the remaining columns with empty cells if needed */}
                            {new Array(25 - (Object.keys(categorizedData[category][0] || {}).length)).fill(null).map((_, index) => (
                                <td key={`empty-${index}`} style={{ padding: '10px', border: '1px solid #ddd' }}></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
