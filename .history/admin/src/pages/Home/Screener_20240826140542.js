import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [ratio, setRatio] = useState('marketcap'); // Default sorting column
  const [sortOrder, setSortOrder] = useState('ASC'); // Default sorting order
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, [page, ratio, sortOrder, filterType, filterValue]);

  const fetchCompanies = () => {
    const url = `http://localhost:4000/screener?page=${page}&limit=20&sortBy=${ratio}&sortOrder=${sortOrder}&filterType=${filterType}&filterValue=${filterValue}&query=${query}`;

    axios.get(url)
      .then(res => {
        setInfos(res.data.data);
        setTotalPages(res.data.totalPages);
      });
  };

  const fetchFilterOptions = (type) => {
    axios.get(`http://localhost:4000/filter-options?filterType=${type}`)
      .then(res => setFilterOptions(res.data))
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchCompanies(); // Call fetchCompanies directly to filter results based on query
  };

  const handleRatioChange = (e) => {
    setRatio(e.target.value);
    setSortOrder('ASC'); // Reset sort order to ascending when ratio changes
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    const selectedFilterType = e.target.value;
    setFilterType(selectedFilterType);
    setFilterValue(''); // Reset filter value when type changes
    setFilterOptions([]); // Reset filter options when type changes
    if (selectedFilterType) {
      fetchFilterOptions(selectedFilterType);
    }
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const formatNumber = (num) => (num / 1e9).toFixed(3);

  return (
    <Container>
      <Grid container spacing={2} alignItems="center" marginBottom={4}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h4">Screener</Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            value={query}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Choisissez un Ratio</InputLabel>
            <Select value={ratio} onChange={handleRatioChange} label="Choisissez un Ratio">
              <MenuItem value="marketcap">Market Cap</MenuItem>
              <MenuItem value="croissance_CA_1_an">Croissance CA 1 an</MenuItem>
              <MenuItem value="croissance_CA_5_ans">Croissance CA 5 ans</MenuItem>
              <MenuItem value="croissance_CA_10_ans">Croissance CA 10 ans</MenuItem>
              <MenuItem value="fcf_1_year">FCF 1 an</MenuItem>
              <MenuItem value="fcf_5_years">FCF 5 ans</MenuItem>
              <MenuItem value="fcf_10_years">FCF 10 ans</MenuItem>
              <MenuItem value="fcf_margin_one_year">Marge FCF 1 an</MenuItem>
              <MenuItem value="fcf_margin_five_year">Marge FCF 5 ans</MenuItem>
              <MenuItem value="roce">RoCE</MenuItem>
              <MenuItem value="roce_5_year_avg">RoCE Moyenne 5 ans</MenuItem>
              <MenuItem value="croissance_resultat_net_1_an">Croissance Résultat Net 1 an</MenuItem>
              <MenuItem value="croissance_resultat_net_5_ans">Croissance Résultat Net 5 ans</MenuItem>
              <MenuItem value="piotroski_score">Score Piotroski</MenuItem>
              <MenuItem value="ratio_capex_revenu_net">Ratio Capex / Revenu Net</MenuItem>
              <MenuItem value="rachat_net_moyen">Rachat Net Moyen</MenuItem>
              <MenuItem value="croissance_annualisee">Croissance Annualisée</MenuItem>
              <MenuItem value="croissance_moyenne">Croissance Moyenne</MenuItem>
              <MenuItem value="debt_equity">Ratio Dette / Capitaux Propres</MenuItem>
              <MenuItem value="ratio_payout">Ratio de Distribution</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="stabilite_nbreannee">Stabilité Nombre d’Années</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Choisissez un Ordre</InputLabel>
            <Select value={sortOrder} onChange={handleOrderChange} label="Choisissez un Ordre">
              <MenuItem value="ASC">Croissant</MenuItem>
              <MenuItem value="DESC">Décroissant</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center" marginBottom={4}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filtrer par</InputLabel>
            <Select value={filterType} onChange={handleFilterTypeChange} label="Filtrer par">
              <MenuItem value="">Aucun filtre</MenuItem>
              <MenuItem value="pays">Pays</MenuItem>
              <MenuItem value="secteur">Secteur</MenuItem>
              <MenuItem value="eligiblePea">Eligible PEA</MenuItem>
              <MenuItem value="verseDividende">Verse Dividende</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {filterType && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Valeur du filtre</InputLabel>
              <Select value={filterValue} onChange={handleFilterValueChange} label="Valeur du filtre">
                <MenuItem value="">Sélectionnez une valeur</MenuItem>
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Entreprise</TableCell>
              <TableCell>Pays</TableCell>
              <TableCell>Secteur - Industrie</TableCell>
              <TableCell>Capitalisation</TableCell>
              <TableCell>Eligible PEA</TableCell>
              <TableCell>Verse Dividende</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {infos.map((company) => (
              <TableRow key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')} hover>
                <TableCell>
                  <Grid container alignItems="center">
                    <Grid item>
                      <img
                        src={company.logo}
                        alt={`${company.Name} logo`}
                        width="50"
                        height="50"
                        style={{ marginRight: '10px' }}
                      />
                    </Grid>
                    <Grid item>
                      <div>{company.Name}</div>
                      <div>{company.symbol}</div>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>{company.pays}</TableCell>
                <TableCell>{company.secteur} - {company.industrie}</TableCell>
                <TableCell>{formatNumber(company.marketcap)}</TableCell>
                <TableCell>{company.eligiblePea ? 'Oui' : 'Non'}</TableCell>
                <TableCell>{company.verseDividende ? 'Oui' : 'Non'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent="space-between" alignItems="center" marginTop={4}>
        <Grid item>
          <IconButton
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Page précédente"
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Page suivante"
          >
            <ArrowForward />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            Page {page} sur {totalPages}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
