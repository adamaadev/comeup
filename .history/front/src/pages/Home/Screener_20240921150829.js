import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]); // For search filtering
  const [searchTerm, setSearchTerm] = useState(''); // For storing search input
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const companiesPerPage = 20; // Number of companies per page

  useEffect(() => {
    // Fetch all companies
    axios
      .get('http://localhost:4000/screener')
      .then(res => {
        const filtered = res.data.filter(company =>
          company.pays === 'United States' &&
          !/[.-]/.test(company.symbol) // Exclude symbols containing '-' or '.'
        );
        setCompanies(filtered);
        setFilteredCompanies(filtered); // Initially, show all filtered companies
      });
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter companies based on search term (by symbol or name)
    const filtered = companies.filter(company =>
      (company.symbol.toLowerCase().includes(searchValue) ||
      company.Nom.toLowerCase().includes(searchValue))
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page after search
  };

  // Get companies for the current page
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  // Go to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCompanies.length / companiesPerPage)) {
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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by symbol or name"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Companies Table */}
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
                <img src={company.logo} alt={`${company.Nom} logo`} width="50" />
              </td>
              <td>{company.symbol}</td>
              <td>{company.Nom}</td>
              <td>{company.pays}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredCompanies.length / companiesPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
}
