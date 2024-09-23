import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                setFinancialData(response.data);
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
                        {/*Pour uniquement les td ayant des notations excellentes*/}
                       
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Correct</th>
                        {/*Pour uniquement les td ayant des notations corrects*/}
                      
                    </tr>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faible</th>
                        {/*Pour uniquement les td ayant des notations faibles*/}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
