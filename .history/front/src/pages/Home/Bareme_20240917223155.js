import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        // Remplacez cet appel axios par les données fournies
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

    // Fonction pour regrouper les données par notation
    const groupByNotation = (data) => {
        const groupedData = {
            "Excellente": {
                "croissance_CA_1_an": "Indisponible",
                "croissance_CA_5_ans": "Indisponible",
                "croissance_CA_10_ans": "Indisponible"
            },
            "Correct": {
                "croissance_CA_1_an": "Indisponible",
                "croissance_CA_5_ans": "Indisponible",
                "croissance_CA_10_ans": "Indisponible"
            },
            "Faible": {
                "croissance_CA_1_an": "Indisponible",
                "croissance_CA_5_ans": "Indisponible",
                "croissance_CA_10_ans": "Indisponible"
            }
        };

        data.forEach(item => {
            if (item.croissance_CA_1_an.notation) {
                groupedData[item.croissance_CA_1_an.notation].croissance_CA_1_an = item.croissance_CA_1_an.value;
            }
            if (item.croissance_CA_5_ans.notation) {
                groupedData[item.croissance_CA_5_ans.notation].croissance_CA_5_ans = item.croissance_CA_5_ans.value;
            }
            if (item.croissance_CA_10_ans.notation) {
                groupedData[item.croissance_CA_10_ans.notation].croissance_CA_10_ans = item.croissance_CA_10_ans.value;
            }
        });

        return groupedData;
    };

    const groupedData = groupByNotation(financialData);

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Excellente</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Correct</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Faible</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Lignes pour chaque catégorie de croissance */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA 1 an</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Excellente.croissance_CA_1_an}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Correct.croissance_CA_1_an}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Faible.croissance_CA_1_an}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA 5 ans</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Excellente.croissance_CA_5_ans}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Correct.croissance_CA_5_ans}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Faible.croissance_CA_5_ans}</td>
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Croissance CA 10 ans</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Excellente.croissance_CA_10_ans}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Correct.croissance_CA_10_ans}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{groupedData.Faible.croissance_CA_10_ans}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
