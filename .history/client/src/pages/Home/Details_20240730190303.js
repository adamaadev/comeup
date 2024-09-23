import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Details() {
  const { symbol } = useParams(); // Extracts 'symbol' from the URL
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      fetchCompanyData(symbol);
    }
  }, [symbol]);

  const fetchCompanyData = (symbol) => {
    axios.get(`http://localhost:4000/getRoceData/${symbol}`)
      .then(res => {
        setCompanyData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching company data');
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Company Details for {symbol}</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ROCE 1 Year</th>
            <th>ROCE 5 Years</th>
            <th>Scores</th>
            <th>Overall Score</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{companyData.roce1Year}</td>
            <td>{companyData.roce5Years}</td>
            <td>
              ROCE 1 Year: {companyData.scores.roce1Year}, ROCE 5 Years: {companyData.scores.roce5Years}
            </td>
            <td>{companyData.overallScore}</td>
            <td>{companyData.rating}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
