import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState({
        croissance_CA_1_an: { value: "", notation: "" },
        croissance_CA_5_ans: { value: "", notation: "" },
        croissance_CA_10_ans: { value: "", notation: "" }
    });

    useEffect(() => {
        // Vous pouvez remplacer cet appel axios par l'utilisation des données fournies
        const fetchedData = [
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

        if (fetchedData.length > 0) {
            setFinancialData(fetchedData[0]);
        }
    }, []);

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
                    {/* Ligne Excellente */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Excellente</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_1_an.notation === 'Excellente' ? financialData.croissance_CA_1_an.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_5_ans.notation === 'Excellente' ? financialData.croissance_CA_5_ans.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_10_ans.notation === 'Excellente' ? financialData.croissance_CA_10_ans.value : ""}
                        </td>
                    </tr>
                    {/* Ligne Correct */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_1_an.notation === 'Correct' ? financialData.croissance_CA_1_an.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_5_ans.notation === 'Correct' ? financialData.croissance_CA_5_ans.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_10_ans.notation === 'Correct' ? financialData.croissance_CA_10_ans.value : ""}
                        </td>
                    </tr>
                    {/* Ligne Faible */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_1_an.notation === 'Faible' ? financialData.croissance_CA_1_an.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_5_ans.notation === 'Faible' ? financialData.croissance_CA_5_ans.value : ""}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            {financialData.croissance_CA_10_ans.notation === 'Faible' ? financialData.croissance_CA_10_ans.value : ""}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
