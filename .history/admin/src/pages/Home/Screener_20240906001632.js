import React, { useState } from 'react';

// Exemple de données d'entreprises
const companies = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  // Ajoutez d'autres entreprises ici
];

const getClosestMatch = (query, companies) => {
  if (!query) return null;

  return companies.reduce((closest, company) => {
    const distance = levenshteinDistance(query.toUpperCase(), company.symbol.toUpperCase());
    if (distance < closest.distance) {
      return { company, distance };
    }
    return closest;
  }, { company: null, distance: Infinity }).company;
};

// Fonction pour calculer la distance de Levenshtein
const levenshteinDistance = (a, b) => {
  const dist = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dist[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dist[i][j] = Math.min(
        dist[i - 1][j] + 1,
        dist[i][j - 1] + 1,
        dist[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dist[a.length][b.length];
};

const CompanySearch = () => {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState(null);

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);
    const match = getClosestMatch(searchQuery, companies);
    setSuggestion(match);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by symbol"
      />
      {suggestion && (
        <div>
          <p><strong>Suggested Company:</strong></p>
          <p>{suggestion.symbol} - {suggestion.name}</p>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;
