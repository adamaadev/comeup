import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Details() {
  const { symbol } = useParams();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyDetails();
  }, [symbol]);

  const fetchCompanyDetails = () => {
    axios.get(`http://localhost:4000/getRoceData/${symbol}`)
      .then(res => {
        setCompanyDetails(res.data);
      })
      .catch(err => {
        setError('Error fetching company details.');
        console.error(err);
      });
  };

  if (error) return <div className="container mt-4"><p>{error}</p></div>;
  if (!companyDetails) return <div className="container mt-4"><p>Loading...</p></div>;

  const { classifications, overallScore, rating } = companyDetails;

  return (
    <div className="container mt-4">
      <h2>Company Details: {symbol}</h2>
      <table className="table table-bordered mt-4">
        <tbody>
          <tr>
            <th>ROCE 1 Year</th>
            <td>{companyDetails.roce_1_an}</td>
            <td>{classifications.roce1YearClassification}</td>
          </tr>
          <tr>
            <th>ROCE 5 Years</th>
            <td>{companyDetails.roce_5_ans}</td>
            <td>{classifications.roce5YearsClassification}</td>
          </tr>
          <tr>
            <th>Overall Score</th>
            <td colSpan="2">{overallScore.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Rating</th>
            <td colSpan="2">{rating}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
