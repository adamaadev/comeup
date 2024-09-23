import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CompanyDetails = () => {
  const { symbol } = useParams(); // Récupère le symbole de l'entreprise depuis l'URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les données de l'API
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getFinancialRatios/${symbol}`);
        setCompanyData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!companyData) return <div>No data found</div>;

  const {
    marge_fcf_1_an,
    moyenne_marge_fcf_5_ans,
    croissance_resultat_net_1_an,
    croissance_resultat_net_5_ans,
    moyenne_ratio_capex_resultat_net,
    classifications,
    overallScore,
    rating
  } = companyData;

  return (
    <div>
      <h1>Company Details: {symbol}</h1>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ROCE 1 Year</td>
            <td>{marge_fcf_1_an}</td>
            <td>{classifications.margeFcf1YearClassification}</td>
          </tr>
          <tr>
            <td>ROCE 5 Years</td>
            <td>{moyenne_marge_fcf_5_ans}</td>
            <td>{classifications.moyenneMargeFcf5YearsClassification}</td>
          </tr>
          <tr>
            <td>Net Income Growth 1 Year</td>
            <td>{croissance_resultat_net_1_an}</td>
            <td>{classifications.croissanceResultatNet1YearClassification}</td>
          </tr>
          <tr>
            <td>Net Income Growth 5 Years</td>
            <td>{croissance_resultat_net_5_ans}</td>
            <td>{classifications.croissanceResultatNet5YearsClassification}</td>
          </tr>
          <tr>
            <td>Capex to Net Income Ratio</td>
            <td>{moyenne_ratio_capex_resultat_net}</td>
            <td>{classifications.moyenneRatioCapexResultatNetClassification}</td>
          </tr>
          <tr>
            <td>Overall Score</td>
            <td>{overallScore.toFixed(2)}</td>
            <td>{rating}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompanyDetails;
