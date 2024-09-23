import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CompanyDetails() {
  const { symbol } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/getFinancialRatios/${symbol}`);
        setCompanyData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching company details');
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!companyData) return <div>No data available</div>;

  const {
    margeFcf1Year,
    moyenneMargeFcf5Years,
    croissanceResultatNet1Year,
    croissanceResultatNet5Years,
    moyenneRatioCapexResultatNet,
    percentiles // Assumes that percentiles are provided in the response
  } = companyData;

  // Function to classify each ratio based on percentiles
  const classifyRatio = (value, percentiles) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'Données indisponibles';
    if (numericValue >= percentiles.p75) return 'Top';
    if (numericValue >= percentiles.p25) return 'Correct';
    return 'Mauvais';
  };

  return (
    <div className="container mt-4">
      <h2>Détails de l'Entreprise</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Critère</th>
            <th>Valeur</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Marge FCF 1 An</td>
            <td>{margeFcf1Year || 'Données indisponibles'}</td>
            <td>{margeFcf1Year ? classifyRatio(margeFcf1Year, percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>Moyenne Marge FCF 5 Ans</td>
            <td>{moyenneMargeFcf5Years || 'Données indisponibles'}</td>
            <td>{moyenneMargeFcf5Years ? classifyRatio(moyenneMargeFcf5Years, percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>Croissance Résultat Net 1 An</td>
            <td>{croissanceResultatNet1Year || 'Données indisponibles'}</td>
            <td>{croissanceResultatNet1Year ? classifyRatio(croissanceResultatNet1Year, percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>Croissance Résultat Net 5 Ans</td>
            <td>{croissanceResultatNet5Years || 'Données indisponibles'}</td>
            <td>{croissanceResultatNet5Years ? classifyRatio(croissanceResultatNet5Years, percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>Moyenne Ratio Capex/ Résultat Net</td>
            <td>{moyenneRatioCapexResultatNet || 'Données indisponibles'}</td>
            <td>{moyenneRatioCapexResultatNet ? classifyRatio(moyenneRatioCapexResultatNet, percentiles) : 'Mauvais'}</td>
          </tr>
        </tbody>
      </table>
      <h3>Score Global</h3>
      <p>Score: {companyData.overallScore}</p>
      <p>Notation: {companyData.rating}</p>
    </div>
  );
}
