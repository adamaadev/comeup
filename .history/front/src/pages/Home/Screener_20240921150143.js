import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const companiesPerPage = 20; // Number of companies per page

  useEffect(() => {
    // Fetch all companies at once
    axios
      .get('http://localhost:4000/screener')
      .then(res => {
        setCompanies(res.data); // Save the company data to state
      })
  }, []);

  // Get the companies for the current page
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  // Go to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(companies.length / companiesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Company Screener</h2>
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {currentCompanies.map(company => (
            <tr key={company.id}>
              <td>
                <img src={company.logo} alt={`${company.nom} logo`} width="50" />
              </td>
              <td>{company.symbol}</td>
              <td>{company.nom}</td>
              <td>{company.pays}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(companies.length / companiesPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
}
