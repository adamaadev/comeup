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
        return <div>Chargment...</div>;
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
                    <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance Annualisée</th>

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
                       {/*Td pour les ratios excellents */}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                       {/*Td pour les ratios coorects */}
                       
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                       {/*Td pour les ratios faibles */}

                    </tr>
                </tbody>
            </table>
        </div>
    );
};