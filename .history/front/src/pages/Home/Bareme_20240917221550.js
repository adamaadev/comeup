import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        // Simuler les données venant de l'API
        const data = [
            {
                "croissance_CA_1_an": {
                    "value": "-0.22",
                    "notation": "Faible"
                },
                "croissance_CA_5_ans": {
                    "value": "5.76",
                    "notation": "Correct"
                },
                "croissance_CA_10_ans": {
                    "value": "0.07",
                    "notation": "Faible"
                }
            }
        ];
        setFinancialData(data);  // Remplacez cela par l'appel API si nécessaire
    }, []);

    const getValuesByNotation = (notation) => {
        return financialData.map((item, index) => {
            return (
                <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {item.croissance_CA_1_an.notation === notation ? item.croissance_CA_1_an.value : ''}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {item.croissance_CA_5_ans.notation === notation ? item.croissance_CA_5_ans.value : ''}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {item.croissance_CA_10_ans.notation === notation ? item.croissance_CA_10_ans.value : ''}
                    </td>
                </tr>
            );
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Notation</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 10 ans</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Excellente</th>
                        {/* Aucun "Excellente" dans vos données pour le moment */}
                        <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>Aucune donnée</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        {getValuesByNotation("Correct")}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        {getValuesByNotation("Faible")}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
