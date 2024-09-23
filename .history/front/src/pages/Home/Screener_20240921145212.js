import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Screener() {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCompanies = (page = 1) => {
    axios.get(`http://localhost:4000/screener?page=${page}`)
      .then(res => {
        setCompanies(res.data.data);
        setCurrentPage(parseInt(res.data.currentPage));
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <h1>Liste des entreprises par capitalisation (décroissant)</h1>
      <table>
        <thead>
          <tr>
            <th>Symbole</th>
            <th>Nom</th>
            <th>Pays</th>
            <th>Capitalisation</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.symbol}</td>
              <td>{company.nom}</td>
              <td>{company.pays}</td>
              <td>{company.capitalisation.toLocaleString()} M</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Page Précédente</button>
        <span>Page {currentPage} de {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Page Suivante</button>
      </div>
    </div>
  );
}
