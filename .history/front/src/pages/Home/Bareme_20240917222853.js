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

    // Fonction pour regrouper les données par type de notation
    const groupByNotation = (data) => {
        const groupedData = {
            "Excellente": [],
            "Correct": [],
            "Faible": []
        };

        data.forEach(item => {
            if (item.croissance_CA_1_an.notation) groupedData[item.croissance_CA_1_an.notation].push(item.croissance_CA_1_an.value);
            if (item.croissance_CA_5_ans.notation) groupedData[item.croissance_CA_5_ans.notation].push(item.croissance_CA_5_ans.value);
            if (item.croissance_CA_10_ans.notation) groupedData[item.croissance_CA_10_ans.notation].push(item.croissance_CA_10_ans.value);
        });

        return groupedData;
    };

    const groupedData = groupByNotation(financialData);

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
                    {Object.keys(groupedData).map((notation, index) => (
                        groupedData[notation].length > 0 && (
                            <tr key={index}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>{notation}</th>
                                {financialData.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {item.croissance_CA_1_an.notation === notation ? item.croissance_CA_1_an.value : "Indisponible"}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {item.croissance_CA_5_ans.notation === notation ? item.croissance_CA_5_ans.value : "Indisponible"}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {item.croissance_CA_10_ans.notation === notation ? item.croissance_CA_10_ans.value : "Indisponible"}
                                        </td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}
