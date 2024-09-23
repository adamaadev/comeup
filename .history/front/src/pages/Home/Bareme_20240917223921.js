import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState({
        croissance_CA_1_an: { value: "", notation: "" },
        croissance_CA_5_ans: { value: "", notation: "" },
        croissance_CA_10_ans: { value: "", notation: "" }
    });

    useEffect(() => {
        // Remplacer les données statiques par l'appel API
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                const fetchedData = response.data;
                if (fetchedData && fetchedData.length > 0) {
                    setFinancialData(fetchedData[0]);
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données:", error);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                <tr>
  <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Criteres</th>
  <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance</th>
</tr>
<tr>
  <th style={{ border: '2px solid #ddd', padding: '10px' }}>CA 1 an</th>
  <th style={{ border: '2px solid #ddd', padding: '10px' }}>CA 5 ans</th>
  <th style={{ border: '2px solid #ddd', padding: '10px' }}>CA 10 ans</th>
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
