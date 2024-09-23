import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1); // Track current page

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const fetchCompanies = (pageNumber) => {
    axios
      .get(`http://localhost:4000/screener?page=${pageNumber}`)
      .then(res => {
        setCompanies(res.data); // Save the company data to state
      })
      .catch(err => {
        console.error(err);
      });
  };

  const nextPage = () => setPage(page + 1); // Increment page
  const prevPage = () => page > 1 && setPage(page - 1); // Decrement page if greater than 1

  return (
    <div>
      <h2>Company Screener</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.symbol}</td>
              <td>{company.nom}</td>
              <td>{company.pays}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={page === 1}>Previous</button>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}
