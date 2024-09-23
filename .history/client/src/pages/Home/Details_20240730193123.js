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
    margeFcf1YearClassification,
    moyenneMargeFcf5YearsClassification,
    croissanceResultatNet1YearClassification,
    croissanceResultatNet5YearsClassification,
    moyenneRatioCapexResultatNetClassification,
    overallScore,
    rating
  } = companyData;

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
            <td>ROCE 1 An</td>
            <td>{companyData.roce_1_an || 'Données indisponibles'}</td>
            <td>{companyData.roce_1_an ? 
              classifyRatio(companyData.roce_1_an, companyData.roce_1_an_percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>ROCE 5 Ans</td>
            <td>{companyData.roce_5_ans || 'Données indisponibles'}</td>
            <td>{companyData.roce_5_ans ? 
              classifyRatio(companyData.roce_5_ans, companyData.roce_5_ans_percentiles) : 'Mauvais'}</td>
          </tr>
          <tr>
            <td>Marge FCF 1 An</td>
            <td>{companyData.marge_fcf_1_an || 'Données indisponibles'}</td>
            <td>{margeFcf1YearClassification}</td>
          </tr>
          <tr>
            <td>Moyenne Marge FCF 5 Ans</td>
            <td>{companyData.moyenne_marge_fcf_5_ans || 'Données indisponibles'}</td>
            <td>{moyenneMargeFcf5YearsClassification}</td>
          </tr>
          <tr>
            <td>Croissance Résultat Net 1 An</td>
            <td>{companyData.croissance_resultat_net_1_an || 'Données indisponibles'}</td>
            <td>{croissanceResultatNet1YearClassification}</td>
          </tr>
          <tr>
            <td>Croissance Résultat Net 5 Ans</td>
            <td>{companyData.croissance_resultat_net_5_ans || 'Données indisponibles'}</td>
            <td>{croissanceResultatNet5YearsClassification}</td>
          </tr>
          <tr>
            <td>Moyenne Ratio Capex/ Résultat Net</td>
            <td>{companyData.moyenne_ratio_capex_resultat_net || 'Données indisponibles'}</td>
            <td>{moyenneRatioCapexResultatNetClassification}</td>
          </tr>
        </tbody>
      </table>
      <h3>Score Global</h3>
      <p>Score: {overallScore}</p>
      <p>Notation: {rating}</p>
    </div>
  );
}

// Fonction pour classifier les ratios (en supposant que vous avez les percentiles comme props ou obtenus par une autre méthode)
const classifyRatio = (value, percentiles) => {
  const numericValue = parseFloat(value);
  if (numericValue >= percentiles.p75) return 'Top';
  if (numericValue >= percentiles.p25) return 'Correct';
  return 'Mauvais';
};
