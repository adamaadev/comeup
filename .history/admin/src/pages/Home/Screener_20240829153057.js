import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Paper, TextField, Autocomplete, Button
} from '@mui/material';

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((company, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img src={company.logo} alt={`${company.Name} logo`} style={{ maxWidth: '50px', height: 'auto' }} />
                </TableCell>
                <TableCell>{company.Name}</TableCell>
                <TableCell>{company.symbol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          variant="contained"
          color="primary"
          style={{ margin: '0 5px' }}
        >
          Précédent
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="contained"
          color="primary"
          style={{ margin: '0 5px' }}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
