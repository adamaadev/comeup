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

    if (loading) {
        return <div>Loading...</div>;
    }

    const renderRows = () => {
        return financialData.map((company, index) => (
            <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.croissance_CA_1_an || 'faux'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.croissance_CA_5_ans || 'faux'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.croissance_CA_10_ans || 'faux'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.roce_5_year_avg || 'faux'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{company.performance || 'faux'}</td>
                {/* Ajoutez d'autres colonnes si nécessaire */}
            </tr>
        ));
    };

    return (
        <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 1 an</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Croissance CA 10 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>ROCE Moyenne 5 ans</th>
                        <th style={{ border: '2px solid #ddd', padding: '10px' }}>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
}
