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
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Criteres</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Faible</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Correct</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Excellent</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Exemple pour "Croissance CA" */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA 1 an</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.percentile25}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_1_an?.percentile75}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA 5 ans</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.percentile25}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.croissance_CA_5_ans?.percentile75}</td>
                    </tr>
                    {/* Ajouter d'autres lignes de critères de la même manière */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>FCF 1 an</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.percentile25}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.median}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{financialData.fcf_1_year?.percentile75}</td>
                    </tr>
                    {/* Ajouter les autres catégories et données */}
                </tbody>
            </table>
        </div>
    );
}
