import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        // Vous pouvez remplacer cet appel axios par les données fournies
        const fetchedData = [
            {
                "croissance_CA_1_an": {
                    "value": "-0.22",
                    "notation": "Faible"
                },
                "croissance_CA_5_ans": {
                    "value": "5.76",
                    "notation": "Excellente"
                },
                "croissance_CA_10_ans": {
                    "value": "0.07",
                    "notation": "Faible"
                }
            },
            {
                "croissance_CA_1_an": {
                    "value": "-21.18",
                    "notation": "Faible"
                },
                "croissance_CA_5_ans": {
                    "value": "-2.29",
                    "notation": "Faible"
                },
                "croissance_CA_10_ans": {
                    "value": "3.78",
                    "notation": "Correct"
                }
            }
        ];

        setFinancialData(fetchedData);
    }, []);

    // Obtenir toutes les notations uniques
    const getUniqueNotations = () => {
        const notationsSet = new Set();
        financialData.forEach((item) => {
            notationsSet.add(item.croissance_CA_1_an.notation);
            notationsSet.add(item.croissance_CA_5_ans.notation);
            notationsSet.add(item.croissance_CA_10_ans.notation);
        });
        return Array.from(notationsSet); // Convertir Set en tableau
    };

    const uniqueNotations = getUniqueNotations();

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
                    {/* Générer dynamiquement des lignes en fonction des notations */}
                    {uniqueNotations.map((notation, index) => (
                        <tr key={index}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>{notation}</th>
                            {financialData.map((data, idx) => (
                                <React.Fragment key={idx}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {data.croissance_CA_1_an.notation === notation ? data.croissance_CA_1_an.value : "Indisponible"}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {data.croissance_CA_5_ans.notation === notation ? data.croissance_CA_5_ans.value : "Indisponible"}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {data.croissance_CA_10_ans.notation === notation ? data.croissance_CA_10_ans.value : "Indisponible"}
                                    </td>
                                </React.Fragment>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
