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
            case 'Excellente':
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
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Notation</th>
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
                    {financialData.map((data, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.quanti)}</td>
                            {/* Croissance CA */}
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.croissance_CA_1_an)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.croissance_CA_5_ans)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.croissance_CA_10_ans)}</td>
                            {/* FCF */}
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.fcf_1_year)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.fcf_5_years)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.fcf_10_years)}</td>
                            {/* Croissance Résultat Net */}
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.croissance_resultat_net_1_an)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.croissance_resultat_net_5_ans)}</td>
                            {/* Roce */}
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.roce)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.roce_5_year_avg)}</td>
                            {/* FCF Margin */}
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.fcf_margin_one_year)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{renderScore(data.fcf_margin_five_year)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
