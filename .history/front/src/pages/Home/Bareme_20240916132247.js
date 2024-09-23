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
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th rowSpan="2" style={{ border: '2px solid #ddd', padding: '10px' }}>Notation</th>
                        <th colSpan="3" style={{ border: '2px solid #ddd', padding: '10px', textAlign: 'center' }}>Croissance CA</th>
                    </tr>
                    <tr>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>10 ans</th>
                    </tr>
                </thead>
                <tbody>
                    {financialData.map((data, index) => (
                        <tr key={index}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>{data.croissance_CA_1_an_notation}</th>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.croissance_CA_1_an}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.croissance_CA_5_ans}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.croissance_CA_10_ans}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
