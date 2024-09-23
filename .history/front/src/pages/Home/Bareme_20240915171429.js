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
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Catégorie</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Critères</th>
                        {/* Ajoutez d'autres colonnes si nécessaire */}
                    </tr>
                    <tr>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}></th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Faible</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Correct</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Excellent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA (1 an)</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_1_an?.faible)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_1_an?.correct)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_1_an?.excellent)}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA (5 ans)</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_5_ans?.faible)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_5_ans?.correct)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_5_ans?.excellent)}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA (10 ans)</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_10_ans?.faible)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_10_ans?.correct)}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{renderScore(financialData.croissance_CA_10_ans?.excellent)}</td>
                    </tr>
                    {/* Autres critères à ajouter de manière similaire */}
                </tbody>
            </table>
        </div>
    );
}
