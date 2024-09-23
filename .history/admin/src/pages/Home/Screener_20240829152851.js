import axios from 'axios';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        setInfos(res.data);
        setFilteredInfos(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Calculer les éléments à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour gérer la recherche
  const handleSearch = (event, value) => {
    setSearchQuery(value);
    const filtered = infos.filter(company =>
      company.Name.toLowerCase().includes(value.toLowerCase()) ||
      company.symbol.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInfos(filtered);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  return (
    <div>
      {/* Barre de recherche avec autocomplete */}
      <Autocomplete
        freeSolo
        options={infos.map(company => `${company.Name} (${company.symbol})`)}
        onInputChange={handleSearch}
        renderInput={(params) => (
          <TextField {...params} label="Search by Name or Symbol" variant="outlined" fullWidth />
        )}
        style={{ marginBottom: '20px' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Logo</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((company, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <img src={company.logo} alt={`${company.Name} logo`} style={{ maxWidth: '50px', height: 'auto' }} />
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {company.Name}
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {company.symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            borderRadius: '5px'
          }}
        >
          Précédent
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: '1px solid #007bff',
            borderRadius: '5px'
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
