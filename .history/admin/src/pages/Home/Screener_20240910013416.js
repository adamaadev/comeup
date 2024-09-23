import React, { useState } from 'react';

const AutoComplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const suggestions = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'AAPL.MX', name: 'Apple Inc. (Mexico)' },
    { symbol: 'AAPL.MDG', name: 'Apple Inc. (Madagascar)' },
    // autres suggestions
  ];

  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase();
    setInputValue(value);
    
    // Filtrer les suggestions en fonction de l'entrée
    const newSuggestions = suggestions.filter(suggestion =>
      suggestion.symbol === value
    );
    
    setFilteredSuggestions(newSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.symbol);
    setFilteredSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a symbol"
      />
      {filteredSuggestions.length > 0 && (
        <ul>
          {filteredSuggestions.map(suggestion => (
            <li key={suggestion.symbol} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.symbol} - {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
