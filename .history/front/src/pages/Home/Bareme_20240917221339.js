import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                setFinancialData(response.data);
                setLoading(false);
            });
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
                        {/* Ajoutez d'autres colonnes si nécessaire */}
                    </tr>
                </thead>
                <tbody>
                    {/* Lignes pour chaque catégorie */}
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Excellente</th>
                        {groupedData.Excellente.map((data, index) => (
                            <td key={index} style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {data.croissance_CA_1_an} / {data.croissance_CA_5_ans} / {data.croissance_CA_10_ans}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        {groupedData.Correct.map((data, index) => (
                            <td key={index} style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {data.croissance_CA_1_an} / {data.croissance_CA_5_ans} / {data.croissance_CA_10_ans}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        {groupedData.Faible.map((data, index) => (
                            <td key={index} style={{ padding: '10px', border: '1px solid #ddd' }}>
                                {data.croissance_CA_1_an} / {data.croissance_CA_5_ans} / {data.croissance_CA_10_ans}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
