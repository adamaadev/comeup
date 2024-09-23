import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
    const [financialData, setFinancialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/api/ratios')
            .then(response => {
                setFinancialData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données financières :", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!financialData) {
        return <div>Aucune donnée disponible.</div>;
    }

    const criteria = [
        { name: "Croissance Annualisée", key: "croissance_annualisee" },
        { name: "Croissance Moyenne", key: "croissance_moyenne" },
        { name: "Debt/Equity", key: "debt_equity" },
        { name: "Ratio Payout", key: "ratio_payout" },
        { name: "Performance", key: "performance" },
        { name: "Buyback Yield", key: "buyback_yield" },
        { name: "Croissance CA 1 an", key: "croissance_CA_1_an" },
        { name: "Croissance CA 5 ans", key: "croissance_CA_5_ans" },
        { name: "Croissance CA 10 ans", key: "croissance_CA_10_ans" },
        { name: "FCF 1 an", key: "fcf_1_year" },
        { name: "FCF 5 ans", key: "fcf_5_years" },
        { name: "FCF 10 ans", key: "fcf_10_years" },
        { name: "FCF Margin 1 an", key: "fcf_margin_one_year" },
        { name: "FCF Margin 5 ans", key: "fcf_margin_five_year" },
        { name: "ROCE", key: "roce" },
        { name: "ROCE 5 ans", key: "roce_5_year_avg" },
        { name: "Croissance Résultat Net 1 an", key: "croissance_resultat_net_1_an" },
        { name: "Croissance Résultat Net 5 ans", key: "croissance_resultat_net_5_ans" },
        { name: "Piotroski Score", key: "piotroski_score" },
        { name: "Ratio Capex/Revenu Net", key: "ratio_capex_revenu_net" },
        { name: "Rachat Net Moyen", key: "rachat_net_moyen" },
        { name: "Nombre d'Années", key: "nbreannee" },
        { name: "Quanti", key: "quanti" }
    ];

    return (
        <div>
            <h1>Tableau de Notation Financière</h1>
            <table>
                <thead>
                    <tr>
                        <th>Critère</th>
                        <th>Faible</th>
                        <th>Correct</th>
                        <th>Excellent</th>
                    </tr>
                </thead>
                <tbody>
                    {criteria.map((criterion) => (
                        <tr key={criterion.key}>
                            <td>{criterion.name}</td>
                            <td>{financialData.map(data => data[`${criterion.key}_faible`]).join(', ')}</td>
                            <td>{financialData.map(data => data[`${criterion.key}_correct`]).join(', ')}</td>
                            <td>{financialData.map(data => data[`${criterion.key}_excellent`]).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
