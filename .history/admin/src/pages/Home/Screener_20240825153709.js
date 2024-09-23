import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  IconButton,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add } from '@mui/icons-material';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [ratio, setRatio] = useState('marketcap');
  const [sortOrder, setSortOrder] = useState('DESC');
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
    fetchCompanies();
  };

  const handleRatioChange = (e) => {
    setRatio(e.target.value);
    setSortOrder('ASC');
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    const selectedFilterType = e.target.value;
    setFilterType(selectedFilterType);
    setFilterValue('');
    setFilterOptions([]);
    if (selectedFilterType) {
      fetchFilterOptions(selectedFilterType);
    }
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const formatNumber = (num) => (num / 1e9).toFixed(3);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f4f6f8' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
          Screener
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ textTransform: 'none' }}
        >
          Ajouter à
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          variant="outlined"
          fullWidth
          label="Rechercher"
          value={query}
          onChange={handleInputChange}
        />
        <FormControl fullWidth>
          <InputLabel id="ratio-select-label">Choisissez un Ratio</InputLabel>
          <Select
            labelId="ratio-select-label"
            id="ratio_select"
            value={ratio}
            label="Choisissez un Ratio"
            onChange={handleRatioChange}
          >
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
        <FormControl fullWidth>
          <InputLabel id="order-select-label">Choisissez un Ordre</InputLabel>
          <Select
            labelId="order-select-label"
            id="order_select"
            value={sortOrder}
            label="Choisissez un Ordre"
            onChange={handleOrderChange}
          >
            <MenuItem value="ASC">Croissant</MenuItem>
            <MenuItem value="DESC">Décroissant</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="filter-type-select-label">Filtrer par</InputLabel>
          <Select
            labelId="filter-type-select-label"
            id="filter_type_select"
            value={filterType}
            label="Filtrer par"
            onChange={handleFilterTypeChange}
          >
            <MenuItem value="">Aucun filtre</MenuItem>
            <MenuItem value="pays">Pays</MenuItem>
            <MenuItem value="secteur">Secteur</MenuItem>
            <MenuItem value="eligiblePea">Eligible PEA</MenuItem>
            <MenuItem value="verseDividende">Verse Dividende</MenuItem>
          </Select>
        </FormControl>
        {filterType && (
          <FormControl fullWidth>
            <InputLabel id="filter-value-select-label">Valeur du filtre</InputLabel>
            <Select
              labelId="filter-value-select-label"
              id="filter_value_select"
              value={filterValue}
              label="Valeur du filtre"
              onChange={handleFilterValueChange}
            >
              <MenuItem value="">Sélectionnez une valeur</MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
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
            <TableRow
              key={company.symbol}
              onClick={() => window.open(`/details/${company.symbol}`, '_blank')}
              hover
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={company.logo}
                  alt={`${company.Name} logo`}
                  width="50"
                  height="50"
                  style={{ marginRight: '10px' }}
                />
                <Box>
                  <Typography variant="body1">{company.Name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {company.symbol}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{company.pays}</TableCell>
              <TableCell>{company.Sector} - {company.Industry}</TableCell>
              <TableCell>{formatNumber(company.MarketCapitalization)} Mds €</TableCell>
              <TableCell>{company.eligiblePea ? 'Oui' : 'Non'}</TableCell>
              <TableCell>{company.verseDividende ? 'Oui' : 'Non'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
}
